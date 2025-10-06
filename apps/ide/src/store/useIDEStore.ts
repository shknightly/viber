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