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