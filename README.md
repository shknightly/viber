# Viber

## Overview
Viber is an experimental multi-agent platform designed to showcase advanced orchestration patterns across shared frontend, backend, and sandbox environments. The repository is organized as a Turborepo/Nx-style monorepo, enabling rapid iteration and code sharing between agents, UI primitives, and execution environments. The web experience demonstrates how to integrate the Google Gemini API using the official `@google/generative-ai` SDK, stream results to the browser, and wrap everything in the Geist design system.

## Directory Structure
```
/ai-agent-platform/
│
├── apps/
│   ├── web/                     # Next.js 14 App Router project with streaming Gemini chat UI
│   └── sandbox/                 # Reserved for WebContainer integrations and runtime tooling
│
├── packages/
│   ├── agent-core/              # Agent orchestration helpers shared across runtimes
│   ├── agent-llm/               # Google Gemini client wrapper and streaming utilities
│   ├── ui/                      # Geist UI footer and shared layout pieces
│   ├── codemirror/              # Reusable CodeMirror editor component
│   └── types/                   # Shared TypeScript models and Zod schemas
│
├── prisma/                      # Database schema for task/memory persistence
├── docs/                        # Documentation (Markdown, Mermaid, code samples)
├── .env.example                 # Environment variable template
├── package.json                 # Turborepo workspace definition
├── tsconfig.base.json           # Shared TypeScript configuration
└── turbo.json                   # Build orchestration configuration
```

## Agent Roles and Responsibilities
- **Orchestrator ("Parent")** – Coordinates specialized agents based on user input and intent routing.
- **Frontend Expert** – Delivers UI/UX, React, and Next.js implementations using the shared design system.
- **Backend Expert** – Provides API, database, and integration logic aligned with Prisma schemas.
- **Code Interpreter** – Executes and debugs code in secure sandboxes such as WebContainer.
- **Prompt Engineer** – Crafts and refines system/user prompts for optimal model performance.
- **Data/RAG Agent** – Retrieves contextual data using embeddings and hybrid semantic search.
- **Reviewer/Validator** – Performs linting, testing, and quality enforcement before deployment.
- **SEO/Compliance Agent** – Guarantees adherence to SEO best practices and policy constraints.

## Gemini Integration Walkthrough
1. Requests originate from the Next.js App Router route `/api/chat`, which validates the payload using the shared `@viber/types` Zod schemas.
2. The route delegates to `@viber/agent-core` which sanitizes the conversation history and streams completions through `@viber/agent-llm`.
3. `@viber/agent-llm` wraps the official Google SDK to enforce safety settings, configure model parameters, and expose a `ReadableStream` for incremental delivery.
4. The React front-end consumes the `ReadableStream`, progressively updating the conversation window and reflecting streaming status indicators.

## Getting Started
1. **Install dependencies**
   ```bash
   pnpm install
   ```
2. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Populate GOOGLE_GENAI_API_KEY with your Gemini key
   ```
3. **Run the development server**
   ```bash
   pnpm dev --filter @viber/web
   ```
4. **Open the app** at [http://localhost:3000](http://localhost:3000) to interact with the Gemini-powered workspace.

5. Understood. Based on the detailed design and incorporating the considerations discussed, here is the file tree and codebase for a browser-based AI IDE.

This structure provides a robust starting point, integrating WebContainers for the runtime environment, Monaco Editor for code editing, XTerm.js for the terminal, and the Vercel AI SDK with Google Gemini for AI capabilities.

```
.
├── public/
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── AIChatPanel.tsx
│   │   ├── FileExplorer.tsx
│   │   ├── MonacoEditorComponent.tsx
│   │   └── WebContainerTerminal.tsx
│   ├── services/
│   │   ├── aiService.ts
│   │   └── webcontainerService.ts
│   ├── store/
│   │   └── useIDEStore.ts
│   ├── App.tsx
│   ├── index.css
│   ├── index.html
│   └── main.tsx
├── .env.local
├── .gitignore
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite-env.d.ts
└── vite.config.ts
```

### Core Codebase

---

#### `package.json`

```json
{
  "name": "browser-ai-ide",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
  "dependencies": {
    "@monaco-editor/react": "^4.6.0",
    "@webcontainer/api": "^1.2.0",
    "ai": "^3.0.18",
    "monaco-editor": "^0.46.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "xterm": "^5.3.0",
    "xterm-addon-fit": "^0.8.0",
    "zustand": "^4.5.2"
  },
  "devDependencies": {
    "@types/node": "^20.11.25",
    "@types/react": "^18.2.64",
    "@types/react-dom": "^18.2.21",
    "@types/xterm": "^3.12.2",
    "@typescript-eslint/eslint-plugin": "^7.1.1",
    "@typescript-eslint/parser": "^7.1.1",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.18",
    "eslint": "^8.57.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5",
    "postcss": "^8.4.35",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.2.2",
    "vite": "^5.1.6"
  }
}
```

---

#### `vite.config.ts`

This configuration sets up the Vite development server and, crucially, adds the `Cross-Origin-Embedder-Policy` and `Cross-Origin-Opener-Policy` headers required for WebContainers to function correctly in a browser environment.

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
    },
  },
  optimizeDeps: {
    // WebContainers use a lot of CJS modules, tell Vite to pre-bundle them
    // This can also help with some performance issues.
    include: ['@webcontainer/api'],
  },
});
```

---

#### `public/favicon.ico`

*(Placeholder - you can replace with your own favicon)*

---

#### `src/index.html`

The root HTML file. Note the `crossorigin` attribute for the script, which might be necessary in some setups.

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <!-- Critical for WebContainers: Cross-Origin Isolation -->
    <meta http-equiv="Cross-Origin-Embedder-Policy" content="require-corp" />
    <meta http-equiv="Cross-Origin-Opener-Policy" content="same-origin" />
    <title>Browser AI IDE</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

---

#### `src/main.tsx`

The entry point for the React application.

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

---

#### `src/index.css`

Basic Tailwind CSS setup for global styles.

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

html, body, #root {
  height: 100%;
  margin: 0;
  overflow: hidden; /* Prevent global scrollbars */
}
```

---

#### `src/vite-env.d.ts`

TypeScript declaration for Vite environment variables.

```typescript
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GOOGLE_API_KEY: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

---

#### `.env.local`

**Important**: This file should *not* be committed to version control. Replace `YOUR_GOOGLE_API_KEY` with your actual key.

```
VITE_GOOGLE_API_KEY=YOUR_GOOGLE_API_KEY
```

---

#### `src/store/useIDEStore.ts`

Centralized state management using Zustand for various IDE components.

```typescript
import { create } from 'zustand';
import { WebContainer } from '@webcontainer/api';

interface FileEntry {
  name: string;
  content: string;
  isDirectory: boolean;
}

interface IDEState {
  webcontainerInstance: WebContainer | null;
  terminalOutput: string;
  activeFilePath: string | null;
  editorContent: string;
  fileTree: FileEntry[];
  aiChatHistory: { role: 'user' | 'assistant'; content: string }[];
  isLoadingWebContainer: boolean;

  setWebcontainerInstance: (instance: WebContainer | null) => void;
  appendToTerminalOutput: (text: string) => void;
  clearTerminalOutput: () => void;
  setActiveFilePath: (path: string | null) => void;
  setEditorContent: (content: string) => void;
  updateFileTree: (tree: FileEntry[]) => void;
  addAIChatMessage: (message: { role: 'user' | 'assistant'; content: string }) => void;
  setIsLoadingWebContainer: (loading: boolean) => void;
  resetEditorAndTerminal: () => void;
}

export const useIDEStore = create<IDEState>((set) => ({
  webcontainerInstance: null,
  terminalOutput: '',
  activeFilePath: null,
  editorContent: '',
  fileTree: [],
  aiChatHistory: [],
  isLoadingWebContainer: true,

  setWebcontainerInstance: (instance) => set({ webcontainerInstance: instance }),
  appendToTerminalOutput: (text) =>
    set((state) => ({ terminalOutput: state.terminalOutput + text })),
  clearTerminalOutput: () => set({ terminalOutput: '' }),
  setActiveFilePath: (path) => set({ activeFilePath: path }),
  setEditorContent: (content) => set({ editorContent: content }),
  updateFileTree: (tree) => set({ fileTree: tree }),
  addAIChatMessage: (message) =>
    set((state) => ({ aiChatHistory: [...state.aiChatHistory, message] })),
  setIsLoadingWebContainer: (loading) => set({ isLoadingWebContainer: loading }),
  resetEditorAndTerminal: () => set({ terminalOutput: '', editorContent: '', activeFilePath: null }),
}));
```

---

#### `src/services/webcontainerService.ts`

Handles the initialization and interaction with WebContainers.

```typescript
import { WebContainer, FileSystemTree } from '@webcontainer/api';
import { useIDEStore } from '../store/useIDEStore';

let webcontainerInstance: WebContainer | null = null;

const initialFiles: FileSystemTree = {
  'index.js': {
    file: {
      contents: `
import express from 'express';
const app = express();
const port = 3111;

app.get('/', (req, res) => {
  res.send('Hello from your WebContainer IDE!');
});

app.listen(port, () => {
  console.log(\`App is running on http://localhost:\${port}\`);
});
`,
    },
  },
  'package.json': {
    file: {
      contents: `
{
  "name": "webcontainer-app",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "express": "^4.18.2"
  }
}
`,
    },
  },
};

export async function initializeWebContainer() {
  const { setWebcontainerInstance, appendToTerminalOutput, setIsLoadingWebContainer } = useIDEStore.getState();

  if (webcontainerInstance) {
    return webcontainerInstance;
  }

  appendToTerminalOutput('Booting WebContainer...\r\n');
  setIsLoadingWebContainer(true);

  try {
    webcontainerInstance = await WebContainer.boot();
    setWebcontainerInstance(webcontainerInstance);
    appendToTerminalOutput('WebContainer booted successfully!\r\n');

    await webcontainerInstance.mount(initialFiles);
    appendToTerminalOutput('Initial files mounted.\r\n');

    // Listen for WebContainer logs and append to terminal output
    webcontainerInstance.on('server-ready', (port, url) => {
        appendToTerminalOutput(`Server ready on port ${port}: ${url}\r\n`);
    });

    setIsLoadingWebContainer(false);
    return webcontainerInstance;
  } catch (error) {
    console.error('Failed to boot WebContainer:', error);
    appendToTerminalOutput(`Error booting WebContainer: ${error}\r\n`);
    setIsLoadingWebContainer(false);
    throw error;
  }
}

export async function installDependencies(instance: WebContainer) {
  const { appendToTerminalOutput } = useIDEStore.getState();
  appendToTerminalOutput('Installing dependencies...\r\n');
  const installProcess = await instance.spawn('npm', ['install']);
  installProcess.output.pipeTo(
    new WritableStream({
      write(chunk) {
        appendToTerminalOutput(chunk);
      },
    }),
  );
  const exitCode = await installProcess.exit;
  if (exitCode !== 0) {
    throw new Error('Failed to install dependencies');
  }
  appendToTerminalOutput('Dependencies installed.\r\n');
}

export async function runCommand(instance: WebContainer, command: string, args: string[]) {
  const { appendToTerminalOutput } = useIDEStore.getState();
  const process = await instance.spawn(command, args);

  process.output.pipeTo(
    new WritableStream({
      write(chunk) {
        appendToTerminalOutput(chunk);
      },
    }),
  );

  const exitCode = await process.exit;
  return exitCode;
}

export async function writeFile(instance: WebContainer, path: string, content: string) {
  await instance.fs.writeFile(path, content);
}

export async function readFile(instance: WebContainer, path: string): Promise<string> {
  const content = await instance.fs.readFile(path, 'utf8');
  return content;
}

export async function readDir(instance: WebContainer, path: string = '.'): Promise<{ name: string; isDirectory: boolean }[]> {
  const entries = await instance.fs.readdir(path, { withFileTypes: true });
  return entries.map(entry => ({
    name: entry.name,
    isDirectory: entry.isDirectory()
  }));
}

// Helper to recursively get files for the file explorer
export async function getFileTree(instance: WebContainer, path: string = '.'): Promise<any[]> {
    const entries = await readDir(instance, path);
    const tree: any[] = [];
    for (const entry of entries) {
        if (entry.name === 'node_modules') continue; // Ignore node_modules for cleaner display
        if (entry.isDirectory) {
            tree.push({
                name: entry.name,
                isDirectory: true,
                children: await getFileTree(instance, `${path}/${entry.name}`)
            });
        } else {
            tree.push({
                name: entry.name,
                isDirectory: false,
                content: await readFile(instance, `${path}/${entry.name}`) // Read content for editor sync
            });
        }
    }
    return tree;
}```

---

#### `src/services/aiService.ts`

Leverages Vercel AI SDK to interact with Google Gemini for chat, autocompletion, and refactoring.

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';
import { generateText, streamText, type CoreMessage } from 'ai';
import { google } from '@ai-sdk/google'; // Assuming @ai-sdk/google provides the provider

const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

if (!API_KEY) {
  console.error('VITE_GOOGLE_API_KEY is not set. AI services will not be available.');
}

// Basic chat function
export async function chatWithAI(messages: CoreMessage[]) {
  if (!API_KEY) {
    throw new Error('Google API Key is not configured.');
  }
  const result = await streamText({
    model: google('gemini-pro'), // Or 'gemini-1.5-flash', 'gemini-1.5-pro' etc.
    messages: messages,
  });
  return result;
}

// Function for code completion/refactoring
export async function getAICompletion(
  prompt: string,
  fullCode: string,
  cursorPosition: { lineNumber: number; column: number },
  context?: string,
) {
  if (!API_KEY) {
    throw new Error('Google API Key is not configured.');
  }

  const messages: CoreMessage[] = [
    {
      role: 'system',
      content: `You are an expert coding assistant. Provide precise code completions, refactoring suggestions, or answers to coding questions based on the user's input and the provided code context.
                Focus on generating only the necessary code or a concise explanation.
                The user's cursor is at line ${cursorPosition.lineNumber}, column ${cursorPosition.column}.
                Here is the current file content:
                \`\`\`
                ${fullCode}
                \`\`\`
                ${context ? `Additional context: ${context}` : ''}
               `,
    },
    {
      role: 'user',
      content: prompt,
    },
  ];

  const result = await generateText({
    model: google('gemini-pro'),
    messages: messages,
    temperature: 0.4, // Lower temperature for more deterministic code suggestions
  });

  return result.text;
}

// Example for a specific refactoring action
export async function refactorCode(
  action: 'rename-variable' | 'extract-function' | 'add-comments',
  selectedText: string,
  fullCode: string,
  filePath: string,
  additionalContext?: string,
) {
  if (!API_KEY) {
    throw new Error('Google API Key is not configured.');
  }

  let prompt = '';
  switch (action) {
    case 'rename-variable':
      prompt = `Rename the selected variable "${selectedText}" to a more descriptive name. Provide only the new code snippet with the variable renamed. Context: ${additionalContext}`;
      break;
    case 'extract-function':
      prompt = `Extract the selected code block into a new function. Provide the new function and its integration into the existing code. Selected code: \`\`\`${selectedText}\`\`\` Context: ${additionalContext}`;
      break;
    case 'add-comments':
      prompt = `Add comprehensive comments to the selected code block. Provide only the commented code block. Selected code: \`\`\`${selectedText}\`\`\` Context: ${additionalContext}`;
      break;
  }

  const messages: CoreMessage[] = [
    {
      role: 'system',
      content: `You are an expert coding refactoring assistant. Apply the requested refactoring action to the provided code.
                Return only the modified code, or the new code snippet if creating a new function.
                Do not include any conversational text.
                The refactoring is for file: ${filePath}
                Here is the current file content for context:
                \`\`\`
                ${fullCode}
                \`\`\`
               `,
    },
    {
      role: 'user',
      content: prompt,
    },
  ];

  const result = await generateText({
    model: google('gemini-pro'),
    messages: messages,
    temperature: 0.2, // Very low temperature for precise refactoring
  });

  return result.text;
}
```

---

#### `src/App.tsx`

The main application component, orchestrating the layout and initial WebContainer setup.

```tsx
import React, { useEffect } from 'react';
import { useIDEStore } from './store/useIDEStore';
import { initializeWebContainer, installDependencies, getFileTree, writeFile } from './services/webcontainerService';
import MonacoEditorComponent from './components/MonacoEditorComponent';
import WebContainerTerminal from './components/WebContainerTerminal';
import AIChatPanel from './components/AIChatPanel';
import FileExplorer from './components/FileExplorer';

function App() {
  const {
    webcontainerInstance,
    setWebcontainerInstance,
    appendToTerminalOutput,
    isLoadingWebContainer,
    setIsLoadingWebContainer,
    activeFilePath,
    editorContent,
    setEditorContent,
    updateFileTree,
    setActiveFilePath,
  } = useIDEStore();

  useEffect(() => {
    const setupWebContainer = async () => {
      try {
        const instance = await initializeWebContainer();
        await installDependencies(instance);
        const tree = await getFileTree(instance);
        updateFileTree(tree);
        // Set a default file to open
        const defaultFile = tree.find(f => f.name === 'index.js' && !f.isDirectory);
        if (defaultFile) {
          setActiveFilePath('index.js');
          setEditorContent(defaultFile.content);
        }
      } catch (error) {
        console.error('Error setting up WebContainer:', error);
        appendToTerminalOutput(`Failed to set up IDE: ${error}\r\n`);
      } finally {
        setIsLoadingWebContainer(false);
      }
    };

    if (!webcontainerInstance) {
      setupWebContainer();
    }
  }, [webcontainerInstance, setWebcontainerInstance, appendToTerminalOutput, setIsLoadingWebContainer, updateFileTree, setActiveFilePath, setEditorContent]);


  // Handler for editor content changes
  const handleEditorChange = async (value: string | undefined) => {
    if (activeFilePath && webcontainerInstance && value !== undefined) {
      setEditorContent(value);
      // Persist changes to WebContainer FS
      await writeFile(webcontainerInstance, activeFilePath, value);
    }
  };

  // Handler for file selection in explorer
  const handleFileSelect = async (path: string) => {
    if (webcontainerInstance) {
      try {
        const content = await webcontainerInstance.fs.readFile(path, 'utf8');
        setActiveFilePath(path);
        setEditorContent(content);
      } catch (error) {
        console.error(`Failed to read file ${path}:`, error);
        appendToTerminalOutput(`Error: Could not open file ${path}. It might be a directory or non-existent.\r\n`);
      }
    }
  };


  if (isLoadingWebContainer) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <p>Loading WebContainer and dependencies...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-800 text-gray-100 font-mono">
      <header className="bg-gray-900 p-3 shadow-md flex justify-between items-center">
        <h1 className="text-xl font-bold">Browser AI IDE</h1>
        <span className="text-sm text-gray-400">Powered by WebContainers, Monaco, Xterm.js & Google Gemini</span>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Pane: File Explorer */}
        <div className="w-1/5 bg-gray-900 border-r border-gray-700 overflow-auto">
          <FileExplorer onFileSelect={handleFileSelect} />
        </div>

        {/* Center Pane: Editor & Terminal */}
        <div className="flex flex-col flex-1">
          <div className="flex-1 border-b border-gray-700 overflow-hidden">
            <MonacoEditorComponent
              value={editorContent}
              onChange={handleEditorChange}
              language={activeFilePath?.split('.').pop() || 'javascript'} // Infer language from extension
            />
          </div>
          <div className="h-1/3 bg-gray-900 overflow-hidden">
            <WebContainerTerminal />
          </div>
        </div>

        {/* Right Pane: AI Chat */}
        <div className="w-1/4 bg-gray-900 border-l border-gray-700 flex flex-col">
          <AIChatPanel />
        </div>
      </div>
    </div>
  );
}

export default App;
```

---

#### `src/components/FileExplorer.tsx`

Component to display the file tree and allow file selection.

```tsx
import React from 'react';
import { useIDEStore } from '../store/useIDEStore';

interface FileExplorerProps {
  onFileSelect: (path: string) => void;
}

const FileExplorer: React.FC<FileExplorerProps> = ({ onFileSelect }) => {
  const { fileTree, activeFilePath } = useIDEStore();

  const renderTree = (nodes: any[], currentPath: string = '') => {
    return (
      <ul className="pl-2">
        {nodes.map((node) => {
          const fullPath = currentPath ? `${currentPath}/${node.name}` : node.name;
          const isActive = fullPath === activeFilePath;
          return (
            <li key={fullPath} className="my-1">
              {node.isDirectory ? (
                <div className="flex items-center text-blue-300">
                  <span className="mr-1">📁</span>
                  <span>{node.name}</span>
                </div>
              ) : (
                <button
                  className={`block w-full text-left p-1 rounded hover:bg-gray-700 transition-colors duration-200
                              ${isActive ? 'bg-blue-600 text-white' : 'text-gray-200'}`}
                  onClick={() => onFileSelect(fullPath)}
                >
                  <span className="mr-1">📄</span>
                  {node.name}
                </button>
              )}
              {node.isDirectory && node.children && (
                renderTree(node.children, fullPath)
              )}
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div className="p-3 text-sm">
      <h2 className="text-lg font-semibold mb-2 text-white">Files</h2>
      {fileTree.length === 0 ? (
        <p className="text-gray-400">Loading files...</p>
      ) : (
        renderTree(fileTree)
      )}
    </div>
  );
};

export default FileExplorer;
```

---

#### `src/components/MonacoEditorComponent.tsx`

Wrapper for the Monaco Editor.

```tsx
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
```

---

#### `src/components/WebContainerTerminal.tsx`

Component for the XTerm.js terminal, connected to WebContainers.

```tsx
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
```

---

#### `src/components/AIChatPanel.tsx`

Component for the AI chat interface.

```tsx
import React, { useState, useRef, useEffect } from 'react';
import { useChat } from 'ai/react'; // Vercel AI SDK hook for chat
import { useIDEStore } from '../store/useIDEStore';
import { getAICompletion, refactorCode } from '../services/aiService';

const AIChatPanel: React.FC = () => {
  const {
    aiChatHistory,
    addAIChatMessage,
    editorContent,
    activeFilePath,
    webcontainerInstance,
    setEditorContent,
  } = useIDEStore();

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat', // Vercel AI SDK's default API route, we'll simulate this with direct calls
    initialMessages: aiChatHistory,
    onFinish: (message) => {
      addAIChatMessage(message);
    },
    // We'll manage sending messages manually without the built-in handleSubmit
    // to allow for custom actions like code completion/refactoring.
  });

  const [chatInput, setChatInput] = useState(input);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setChatInput(input);
  }, [input]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, aiChatHistory]);


  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    addAIChatMessage({ role: 'user', content: chatInput });

    // Simulate Vercel AI SDK chat API for demonstration
    // In a real app, this would hit your /api/chat route
    // For this client-side setup, we directly call aiService.chatWithAI
    const newMessages = [...aiChatHistory, { role: 'user', content: chatInput }];
    const resultStream = await getAICompletion(
      chatInput,
      editorContent,
      { lineNumber: 1, column: 1 }, // Placeholder for actual cursor position
      `Current file: ${activeFilePath || 'none'}`
    );

    let assistantResponse = '';
    for await (const delta of resultStream.textStream) {
        assistantResponse += delta;
        // Optionally update UI in real-time if needed, or wait for full response
    }
    addAIChatMessage({ role: 'assistant', content: assistantResponse });
    setChatInput(''); // Clear input
  };

  const handleRefactorAction = async (actionType: 'add-comments' | 'extract-function') => {
    if (!activeFilePath || !editorContent || !webcontainerInstance) {
      alert('Please open a file in the editor first.');
      return;
    }

    // This is a simplified example. In a real IDE, you'd get selected text.
    // For now, let's assume we operate on the whole content for demonstration.
    const selectedText = editorContent; // Or get from Monaco selection

    addAIChatMessage({ role: 'user', content: `AI, please ${actionType === 'add-comments' ? 'add comments to' : 'extract a function from'} the current code in ${activeFilePath}.` });
    try {
      const refinedCode = await refactorCode(
        actionType,
        selectedText,
        editorContent,
        activeFilePath,
        `User wants to ${actionType === 'add-comments' ? 'add comments' : 'extract a function'}.`
      );

      if (refinedCode) {
        setEditorContent(refinedCode);
        await webcontainerInstance.fs.writeFile(activeFilePath, refinedCode); // Update WebContainer FS
        addAIChatMessage({ role: 'assistant', content: `Code successfully ${actionType === 'add-comments' ? 'commented' : 'refactored'} in the editor.` });
      } else {
        addAIChatMessage({ role: 'assistant', content: "Sorry, I couldn't perform the refactoring." });
      }
    } catch (error) {
      console.error('AI Refactor Error:', error);
      addAIChatMessage({ role: 'assistant', content: `An error occurred during refactoring: ${(error as Error).message}` });
    }
  };


  return (
    <div className="flex flex-col h-full p-3 bg-gray-900">
      <h2 className="text-lg font-semibold mb-2 text-white">AI Assistant</h2>
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto pr-2 mb-4 space-y-3 custom-scrollbar">
        {aiChatHistory.map((m, index) => (
          <div
            key={index}
            className={`p-2 rounded-lg text-sm max-w-[85%] ${
              m.role === 'user'
                ? 'bg-blue-600 text-white self-end ml-auto'
                : 'bg-gray-700 text-gray-100 self-start mr-auto'
            }`}
          >
            <strong>{m.role === 'user' ? 'You' : 'AI'}:</strong> {m.content}
          </div>
        ))}
        {isLoading && (
          <div className="p-2 rounded-lg text-sm bg-gray-700 text-gray-100 self-start mr-auto max-w-[85%]">
            <strong>AI:</strong> Thinking...
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 mb-4">
        <button
          onClick={() => handleRefactorAction('add-comments')}
          className="bg-purple-600 hover:bg-purple-700 text-white py-1 px-3 rounded text-sm disabled:opacity-50"
          disabled={!activeFilePath || !webcontainerInstance}
        >
          Add Comments to Current File
        </button>
        <button
          onClick={() => handleRefactorAction('extract-function')}
          className="bg-purple-600 hover:bg-purple-700 text-white py-1 px-3 rounded text-sm disabled:opacity-50"
          disabled={!activeFilePath || !webcontainerInstance}
        >
          Extract Function from Selected Code (WIP)
        </button>
      </div>

      <form onSubmit={handleChatSubmit} className="flex gap-2">
        <input
          className="flex-1 p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
          value={chatInput}
          placeholder="Ask AI for help..."
          onChange={(e) => setChatInput(e.target.value)}
          disabled={isLoading}
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded disabled:opacity-50"
          disabled={isLoading || !chatInput.trim()}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default AIChatPanel;
```

---

#### `README.md`

*(A placeholder README to get started)*

```markdown
# Browser AI IDE

A cutting-edge, in-browser Integrated Development Environment powered by WebContainers, Monaco Editor, XTerm.js, and Google Gemini via the Vercel AI SDK. This IDE aims to provide a seamless, AI-accelerated development experience directly within your web browser.

## Features

-   **Instant Dev Environments**: Spin up Node.js environments directly in your browser with WebContainers.
-   **Full-featured Code Editor**: Monaco Editor provides a rich coding experience with syntax highlighting, IntelliSense (expandable with AI), and more.
-   **Integrated Terminal**: XTerm.js offers a fully interactive terminal for running commands, installing dependencies, and interacting with your project.
-   **AI-Powered Assistance**: Leverage Google Gemini for:
    -   **AI Chat**: Conversational help and coding questions.
    -   **Code Autocompletion**: Intelligent code suggestions (WIP).
    -   **Refactoring Actions**: Automated code refactoring (e.g., add comments, extract function).
-   **File Explorer**: Navigate and manage project files within the IDE.
-   **Client-Side Security**: Your code stays in your browser, enhancing privacy and security.

## Getting Started

### Prerequisites

-   Node.js (for development environment setup)
-   Google Generative AI API Key (obtainable from [Google AI Studio](https://ai.google.dev/))

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [your-repo-link]
    cd browser-ai-ide
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure API Key:**
    Create a `.env.local` file in the root of the project and add your Google Generative AI API key:
    ```
    VITE_GOOGLE_API_KEY=YOUR_GOOGLE_API_KEY_HERE
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

5.  **Access the IDE:**
    Open your browser to `http://localhost:5173` (or the port Vite provides).

### Usage

-   **File Explorer**: Click on files to open them in the editor.
-   **Editor**: Edit your code. Changes are automatically saved to the WebContainer's virtual file system.
-   **Terminal**: Use the integrated terminal to run `npm` commands (like `npm start`), execute scripts, etc. Type commands and press Enter.
-   **AI Assistant**: Use the chat panel to ask questions or trigger refactoring actions.

## Architecture

-   **WebContainers**: Provides an in-browser Node.js runtime environment.
-   **Monaco Editor**: The powerful code editor component from VS Code.
-   **XTerm.js**: A robust terminal emulator for the browser.
-   **Vercel AI SDK**: A lightweight library for building AI-powered user interfaces.
-   **Google Gemini**: The large language model powering AI capabilities (via `@ai-sdk/google`).
-   **React & Vite**: Frontend framework and build tool for a fast and reactive UI.
-   **Zustand**: A small, fast, and scalable bear-necessities state-management solution for React.
-   **Tailwind CSS**: For utility-first styling.

## Development Notes

-   **Cross-Origin Isolation**: Crucial for WebContainers. Ensured via `vite.config.ts` headers and `index.html` meta tags.
-   **AI Key Security**: For production, consider proxying AI API calls through a secure backend to prevent client-side exposure of your API key.
-   **Monaco Autocompletion**: The `MonacoEditorComponent` includes a basic example of registering a completion provider. This is where more advanced AI-driven autocompletion would integrate, using `aiService.getAICompletion`.
-   **Refactoring Actions**: The `AIChatPanel` demonstrates basic AI-triggered refactoring. More sophisticated implementations would involve getting precise selections from Monaco and using source code parsing (e.g., Babel, ASTs) for more accurate transformations.

## Contributing

Contributions are welcome! Please feel free to open issues or submit pull requests.
``````

## Testing and Linting
- `pnpm lint --filter @viber/web` – Runs Next.js ESLint checks for the web application.
- `pnpm build --filter @viber/web` – Validates that the Next.js build pipeline succeeds with the shared packages.

## Contribution Guidelines
- Maintain zero-placeholder code and follow the Geist design system for UI contributions.
- Ensure accessibility, performance, and security standards for every change.
- Validate agent workflows with integration tests and sandbox executions prior to submitting pull requests.

## License
This project is released under the MIT License.
