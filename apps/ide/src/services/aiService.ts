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