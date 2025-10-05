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

## Testing and Linting
- `pnpm lint --filter @viber/web` – Runs Next.js ESLint checks for the web application.
- `pnpm build --filter @viber/web` – Validates that the Next.js build pipeline succeeds with the shared packages.

## Contribution Guidelines
- Maintain zero-placeholder code and follow the Geist design system for UI contributions.
- Ensure accessibility, performance, and security standards for every change.
- Validate agent workflows with integration tests and sandbox executions prior to submitting pull requests.

## License
This project is released under the MIT License.
