import React, { useRef, useEffect, useState } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';
import { useIDEStore } from '../store/useIDEStore';
import { runCommand } from '../services/webcontainerService';

const WebContainerTerminal: React.FC = () => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<Terminal | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);

  const { webcontainerInstance, terminalOutput, clearTerminalOutput } = useIDEStore();
  const [currentCommand, setCurrentCommand] = useState<string>('');
  const [isProcessingCommand, setIsProcessingCommand] = useState<boolean>(false);

  useEffect(() => {
    if (terminalRef.current && !xtermRef.current) {
      const xterm = new Terminal({
        cursorBlink: true,
        fontFamily: 'Fira Code, monospace',
        fontSize: 14,
        theme: {
          background: '#1f2937', // Tailwind gray-800
          foreground: '#f9fafb', // Tailwind gray-50
          cursor: '#f9fafb',
          selectionBackground: '#4b5563',
          red: '#ef4444',
          green: '#22c55e',
          yellow: '#eab308',
          blue: '#3b82f6',
          magenta: '#a855f7',
          cyan: '#06b6d4',
          white: '#f9fafb',
          brightBlack: '#6b7280',
          brightRed: '#f87171',
          brightGreen: '#4ade80',
          brightYellow: '#facc15',
          brightBlue: '#60a5fa',
          brightMagenta: '#c084fc',
          brightCyan: '#22d3ee',
          brightWhite: '#ffffff',
        },
      });
      const fitAddon = new FitAddon();
      xterm.loadAddon(fitAddon);
      xterm.open(terminalRef.current);
      fitAddon.fit();

      xtermRef.current = xterm;
      fitAddonRef.current = fitAddon;

      // Initial prompt
      xterm.write('\x1b[1;34mwebcontainer-ide\x1b[0m $ ');

      xterm.onKey(({ key, domEvent }) => {
        if (webcontainerInstance && !isProcessingCommand) {
          if (domEvent.key === 'Enter') {
            xterm.write('\r\n');
            if (currentCommand.trim() === 'clear') {
              xterm.clear();
              clearTerminalOutput();
            } else {
              executeTerminalCommand(currentCommand);
            }
            setCurrentCommand('');
            xterm.write('\x1b[1;34mwebcontainer-ide\x1b[0m $ ');
          } else if (domEvent.key === 'Backspace') {
            if (currentCommand.length > 0) {
              xterm.write('\b \b'); // Delete character visually
              setCurrentCommand((prev) => prev.slice(0, -1));
            }
          } else {
            xterm.write(key);
            setCurrentCommand((prev) => prev + key);
          }
        }
      });

      // Resize observer to refit terminal
      const resizeObserver = new ResizeObserver(() => fitAddon.fit());
      resizeObserver.observe(terminalRef.current);

      return () => {
        xterm.dispose();
        resizeObserver.disconnect();
      };
    }
  }, [webcontainerInstance, clearTerminalOutput, isProcessingCommand]);

  useEffect(() => {
    if (xtermRef.current) {
      // Find the last actual line of output (excluding the current input line)
      const lines = terminalOutput.split('\r\n');
      const outputToWrite = lines.slice(xtermRef.current.buffer.active.length - 1).join('\r\n');
      xtermRef.current.write(outputToWrite);
      xtermRef.current.scrollToBottom();
    }
  }, [terminalOutput]);


  const executeTerminalCommand = async (command: string) => {
    if (!webcontainerInstance) return;

    setIsProcessingCommand(true);
    try {
      const [cmd, ...args] = command.split(' ');
      await runCommand(webcontainerInstance, cmd, args);
    } catch (error) {
      xtermRef.current?.write(`\r\nError: ${error}\r\n`);
      console.error('Terminal command execution error:', error);
    } finally {
      setIsProcessingCommand(false);
    }
  };

  return (
    <div className="h-full w-full p-2 bg-gray-900 overflow-hidden">
      <div ref={terminalRef} className="h-full w-full"></div>
    </div>
  );
};

export default WebContainerTerminal;