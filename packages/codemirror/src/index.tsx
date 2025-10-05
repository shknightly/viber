'use client';

import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';
import type { FC } from 'react';

type CodeEditorProps = {
  value: string;
  onChange: (value: string) => void;
  ariaLabel?: string;
};

export const CodeEditor: FC<CodeEditorProps> = ({ value, onChange, ariaLabel }) => (
  <CodeMirror
    value={value}
    theme={oneDark}
    height="200px"
    aria-label={ariaLabel ?? 'Code editor'}
    basicSetup={{
      autocompletion: true,
      highlightActiveLine: true,
      lineNumbers: true,
    }}
    extensions={[javascript({ jsx: true })]}
    onChange={(nextValue) => onChange(nextValue)}
  />
);

export default CodeEditor;
