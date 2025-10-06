import React from 'react';
import Editor from '@monaco-editor/react';
import { useIDEStore } from '../store/useIDEStore';

interface MonacoEditorProps {
  value: string;
  onChange: (value: string | undefined) => void;
  language?: string;
}

const MonacoEditorComponent: React.FC<MonacoEditorProps> = ({ value, onChange, language = 'javascript' }) => {
  const { webcontainerInstance, activeFilePath, editorContent, setEditorContent } = useIDEStore();

  // Basic autocompletion provider setup (can be expanded)
  const handleEditorDidMount = (editor: any, monaco: any) => {
    monaco.languages.registerCompletionItemProvider(language, {
      provideCompletionItems: (model: any, position: any) => {
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        };

        // Simple example completions
        const suggestions = [
          {
            label: 'console.log',
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: 'console.log(${1:variable});',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            detail: 'Log a message to the console',
            range: range,
          },
          {
            label: 'const',
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: 'const ${1:name} = ${2:value};',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            detail: 'Declare a constant variable',
            range: range,
          },
          // ... more static completions
        ];

        // Here, you would integrate with aiService for dynamic completions
        // Example: if (word.word.length > 2) {
        //    getAICompletion(word.word, editor.getValue(), position).then(aiSuggestions => {
        //       // Process aiSuggestions and return
        //    });
        // }

        return { suggestions: suggestions };
      },
    });
  };


  return (
    <Editor
      height="100%"
      language={language}
      theme="vs-dark"
      value={value}
      onChange={onChange}
      onMount={handleEditorDidMount}
      options={{
        minimap: { enabled: false },
        readOnly: !webcontainerInstance, // Make read-only until WebContainer is ready
      }}
    />
  );
};

export default MonacoEditorComponent;