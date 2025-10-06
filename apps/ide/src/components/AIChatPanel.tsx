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