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