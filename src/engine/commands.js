import { listFiles, readFile } from './filesystem.js';
import { runScript } from './pythonRunner.js';

export async function handleCommand(line, context) {
  const { fs, env, username, unlockedCommands, level } = context;

  const tokens = line.trim().split(/\s+/);
  const cmd = tokens[0]?.toLowerCase();
  const args = tokens.slice(1);

  if (!cmd) return [];

  if (!unlockedCommands.includes(cmd)) {
    return [{ text: `${cmd}: command not found`, color: 'red' }];
  }

  try {
    switch (cmd) {
      case 'help':
        return handleHelp(unlockedCommands);
      case 'ls':
        return handleLs(fs, args);
      case 'cat':
        return handleCat(fs, args);
      case 'echo':
        return handleEcho(args, env);
      case 'env':
        return handleEnv(env);
      case 'export':
        return handleExport(args, env);
      case 'python3':
        return await handlePython3(args, fs, env, username, level);
      case 'clear':
        return [{ type: 'clear' }];
      case 'nano':
        return handleNano(args, fs, level);
      case 'grep':
        return handleGrep(args, fs);
      default:
        return [{ text: `${cmd}: command not found`, color: 'red' }];
    }
  } catch (error) {
    return [{ text: `Error: ${error.message}`, color: 'red' }];
  }
}

function handleHelp(unlockedCommands) {
  const lines = [
    { text: 'Available commands:', color: 'amber' },
    ''
  ];

  const cmds = {
    help: 'Show this help message',
    ls: 'List files in the current directory',
    'ls -la': 'List all files including hidden ones',
    cat: 'Print file contents',
    echo: 'Print text or environment variable values',
    env: 'Show all environment variables',
    export: 'Set an environment variable',
    'python3 <file>': 'Run a Python script',
    nano: 'Edit a text file',
    grep: 'Search for text in a file',
    clear: 'Clear the terminal screen'
  };

  Object.entries(cmds).forEach(([name, desc]) => {
    if (unlockedCommands.includes(name.split(/\s/)[0]) || name.includes('<')) {
      lines.push({ text: `  ${name.padEnd(20)} ${desc}`, color: 'cyan' });
    }
  });

  return lines;
}

function handleLs(fs, args) {
  const showHidden = args.includes('-la') || args.includes('-a');
  const files = listFiles(fs, showHidden);

  if (files.length === 0) {
    return [{ text: '(empty directory)', color: 'cyan' }];
  }

  return [{ text: files.join('  '), color: 'cyan' }];
}

function handleCat(fs, args) {
  if (args.length === 0) {
    return [{ text: 'cat: missing operand', color: 'red' }];
  }

  const filename = args[0];
  const content = readFile(fs, filename);

  if (content === null) {
    return [{ text: `cat: ${filename}: No such file or directory`, color: 'red' }];
  }

  return content.split('\n').map(line => ({ text: line, color: 'white' }));
}

function handleEcho(args, env) {
  let text = args.join(' ');

  // Replace $VAR with environment variable value
  text = text.replace(/\$(\w+)/g, (match, varName) => {
    return env[varName] || '';
  });

  return [{ text, color: 'white' }];
}

function handleEnv(env) {
  const lines = Object.entries(env)
    .map(([key, value]) => ({ text: `${key}=${value}`, color: 'cyan' }));

  if (lines.length === 0) {
    return [{ text: '(no environment variables set)', color: 'cyan' }];
  }

  return lines;
}

function handleExport(args, env) {
  if (args.length === 0) {
    return [{ text: 'export: missing argument', color: 'red' }];
  }

  const assignment = args[0];
  const [key, ...valueParts] = assignment.split('=');
  const value = valueParts.join('=');

  if (!value) {
    return [{ text: 'export: invalid assignment', color: 'red' }];
  }

  env[key] = value;
  return [{ text: `${key}=${value}`, color: 'white' }];
}

async function handlePython3(args, fs, env, username, level) {
  if (args.length === 0) {
    return [{ text: 'python3: missing filename', color: 'red' }];
  }

  const scriptName = args[0];
  const scriptContent = readFile(fs, scriptName);

  if (scriptContent === null) {
    return [{ text: `python3: ${scriptName}: No such file or directory`, color: 'red' }];
  }

  try {
    const result = await runScript(scriptContent, fs, env, args);

    if (result.error) {
      return [{ text: `Traceback (most recent call last):\n${result.error}`, color: 'red' }];
    }

    const output = result.output.trimEnd();
    return output.split('\n').map(line => ({ text: line, color: 'white' }));
  } catch (error) {
    return [{ text: `Error: ${error.message}`, color: 'red' }];
  }
}

function handleNano(args, fs, level) {
  if (args.length === 0) {
    return [{ text: 'nano: missing filename', color: 'red' }];
  }

  const filename = args[0];

  // Check if file exists
  if (!(filename in fs)) {
    return [{ text: `nano: ${filename}: No such file or directory`, color: 'red' }];
  }

  // Return special nano trigger
  return [{ type: 'nano', filename }];
}

function handleGrep(args, fs) {
  if (args.length < 2) {
    return [{ text: 'grep: missing arguments', color: 'red' }];
  }

  const pattern = args[0].replace(/^["']|["']$/g, ''); // Remove quotes
  const filename = args[args.length - 1];
  const content = readFile(fs, filename);

  if (content === null) {
    return [{ text: `grep: ${filename}: No such file or directory`, color: 'red' }];
  }

  const regex = new RegExp(pattern, 'i');
  const lines = content.split('\n').filter(line => regex.test(line));

  if (lines.length === 0) {
    return [];
  }

  return lines.map(line => ({ text: line, color: 'white' }));
}
