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