let pyodideInstance = null;
let pyodideLoading = null;

export async function loadPyodide() {
  if (pyodideInstance) return pyodideInstance;
  if (pyodideLoading) return pyodideLoading;

  // Load Pyodide from CDN
  pyodideLoading = (async () => {
    // Load the Pyodide script tag
    await new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/pyodide/v0.26.0/full/pyodide.js';
      script.onload = resolve;
      document.head.appendChild(script);
    });

    // Use the global loadPyodide function
    pyodideInstance = await window.loadPyodide({
      indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.0/full/'
    });
    return pyodideInstance;
  })();

  return pyodideLoading;
}

export async function runScript(scriptContent, fs, env, args = []) {
  let py = pyodideInstance;

  if (!py) {
    py = await loadPyodide();
  }

  try {
    // Write all virtual FS files to Pyodide FS
    Object.entries(fs).forEach(([name, content]) => {
      try {
        py.FS.writeFile(name, content);
      } catch (e) {
        // File might already exist, try to unlink and rewrite
        try {
          py.FS.unlink(name);
          py.FS.writeFile(name, content);
        } catch (e2) {
          // Ignore
        }
      }
    });

    // Setup stdout capture
    py.runPython(`
import sys
from io import StringIO
_stdout = StringIO()
_stderr = StringIO()
sys.stdout = _stdout
sys.stderr = _stderr
`);

    // Set environment variables
    Object.entries(env).forEach(([key, value]) => {
      py.runPython(`import os; os.environ['${key}'] = '${value.replace(/'/g, "\\'")}'`);
    });

    // Set sys.argv
    const argv = [args[0] || 'script', ...args.slice(1)];
    py.runPython(`import sys; sys.argv = ${JSON.stringify(argv)}`);

    // Run the script
    py.runPython(scriptContent);

    // Capture output
    const output = py.runPython('_stdout.getvalue()');
    const error = py.runPython('_stderr.getvalue()');

    // Restore stdout
    py.runPython('sys.stdout = sys.__stdout__; sys.stderr = sys.__stderr__');

    return {
      output: output || '',
      error: error || ''
    };
  } catch (e) {
    // Restore stdout
    try {
      py.runPython('sys.stdout = sys.__stdout__; sys.stderr = sys.__stderr__');
    } catch (e2) {
      // Ignore
    }

    return {
      output: '',
      error: e.message || String(e)
    };
  }
}
