import React, { useEffect, useRef } from 'react';
import { Terminal as XTerminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';

const Terminal = React.forwardRef(({ username, onCommand }, ref) => {
  const terminalRef = useRef(null);
  const terminalInstance = useRef(null);
  const fitAddon = useRef(null);
  const commandBuffer = useRef('');
  const commandHistory = useRef([]);
  const historyIndex = useRef(-1);

  useEffect(() => {
    if (!terminalRef.current) return;

    // Initialize terminal
    const term = new XTerminal({
      cursorBlink: true,
      fontSize: 14,
      fontFamily: '"JetBrains Mono", monospace',
      theme: {
        background: '#050508',
        foreground: '#e0e0e0',
        cursor: '#4aff91',
        green: '#4aff91',
        red: '#ff6b6b',
        cyan: '#4dd0e1',
        brightYellow: '#d4a843'
      }
    });

    fitAddon.current = new FitAddon();
    term.loadAddon(fitAddon.current);

    term.open(terminalRef.current);

    // Delay fit() to allow layout to calculate
    setTimeout(() => {
      try {
        fitAddon.current?.fit();
      } catch (e) {
        console.warn('FitAddon fit failed (expected on mount):', e.message);
      }
    }, 0);

    terminalInstance.current = term;

    // Write banner
    term.writeln('┌─ COGSWORTH ACADEMY ─┐');
    term.writeln('│ Brass Terminal v2.4  │');
    term.writeln('└─ [CONNECTED] ───────┘');
    term.writeln('');
    writePrompt(term);

    // Handle input
    let inputMode = true;

    term.onData(async (data) => {
      if (!inputMode) return;

      if (data === '\r') {
        // Enter - submit command
        const command = commandBuffer.current;
        term.writeln('');
        commandBuffer.current = '';
        historyIndex.current = -1;

        if (command.trim()) {
          commandHistory.current.push(command);
          await onCommand(command);
        }

        writePrompt(term);
      } else if (data === '\u007F') {
        // Backspace
        if (commandBuffer.current.length > 0) {
          commandBuffer.current = commandBuffer.current.slice(0, -1);
          term.write('\b \b');
        }
      } else if (data === '\u0003') {
        // Ctrl+C
        term.writeln('^C');
        commandBuffer.current = '';
        historyIndex.current = -1;
        writePrompt(term);
      } else if (data === '\u001b[A') {
        // Arrow Up - previous command
        if (historyIndex.current < commandHistory.current.length - 1) {
          historyIndex.current++;
          const cmd = commandHistory.current[commandHistory.current.length - 1 - historyIndex.current];
          // Clear current input
          for (let i = 0; i < commandBuffer.current.length; i++) {
            term.write('\b \b');
          }
          commandBuffer.current = cmd;
          term.write(cmd);
        }
      } else if (data === '\u001b[B') {
        // Arrow Down - next command
        if (historyIndex.current > 0) {
          historyIndex.current--;
          const cmd = commandHistory.current[commandHistory.current.length - 1 - historyIndex.current];
          // Clear current input
          for (let i = 0; i < commandBuffer.current.length; i++) {
            term.write('\b \b');
          }
          commandBuffer.current = cmd;
          term.write(cmd);
        } else if (historyIndex.current === 0) {
          historyIndex.current = -1;
          // Clear current input
          for (let i = 0; i < commandBuffer.current.length; i++) {
            term.write('\b \b');
          }
          commandBuffer.current = '';
        }
      } else if (data.charCodeAt(0) >= 32) {
        // Regular character
        commandBuffer.current += data;
        term.write(data);
      }
    });

    // Expose write method via ref
    if (ref) {
      ref.current = {
        write: (text, color = 'white') => {
          const colorMap = {
            red: '\x1b[31m',
            green: '\x1b[32m',
            yellow: '\x1b[33m',
            blue: '\x1b[36m',
            cyan: '\x1b[36m',
            white: '\x1b[37m',
            amber: '\x1b[33m'
          };
          const reset = '\x1b[0m';
          const code = colorMap[color] || '';
          const lines = text.split('\n');
          lines.forEach((line, idx) => {
            term.writeln(`${code}${line}${reset}`);
          });
        },
        clear: () => term.clear(),
        writePrompt: () => writePrompt(term)
      };
    }

    // Handle window resize
    const handleResize = () => {
      try {
        fitAddon.current?.fit();
      } catch (e) {
        // Ignore resize fit errors
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      term.dispose();
    };
  }, [username, onCommand, ref]);

  return (
    <div
      ref={terminalRef}
      style={{
        width: '100%',
        height: '100%',
        background: '#050508'
      }}
    />
  );
});

Terminal.displayName = 'Terminal';

function writePrompt(term) {
  term.write('\x1b[32m$\x1b[37m ');
}

export default Terminal;
