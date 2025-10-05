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
Concise rules for building accessible, fast, delightful UIs Use MUST/SHOULD/NEVER to guide decisions

## Interactions

- Keyboard
  - MUST: Full keyboard support per [WAI-ARIA APG](https://www.w3.org/WAI/ARIA/apg/patterns/)
  - MUST: Visible focus rings (`:focus-visible`; group with `:focus-within`)
  - MUST: Manage focus (trap, move, and return) per APG patterns
- Targets & input
  - MUST: Hit target ≥24px (mobile ≥44px) If visual <24px, expand hit area
  - MUST: Mobile `<input>` font-size ≥16px or set:
    ```html
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover">
    ```
  - NEVER: Disable browser zoom
  - MUST: `touch-action: manipulation` to prevent double-tap zoom; set `-webkit-tap-highlight-color` to match design
- Inputs & forms (behavior)
  - MUST: Hydration-safe inputs (no lost focus/value)
  - NEVER: Block paste in `<input>/<textarea>`
  - MUST: Loading buttons show spinner and keep original label
  - MUST: Enter submits focused text input In `<textarea>`, ⌘/Ctrl+Enter submits; Enter adds newline
  - MUST: Keep submit enabled until request starts; then disable, show spinner, use idempotency key
  - MUST: Don’t block typing; accept free text and validate after
  - MUST: Allow submitting incomplete forms to surface validation
  - MUST: Errors inline next to fields; on submit, focus first error
  - MUST: `autocomplete` + meaningful `name`; correct `type` and `inputmode`
  - SHOULD: Disable spellcheck for emails/codes/usernames
  - SHOULD: Placeholders end with ellipsis and show example pattern (eg, `+1 (123) 456-7890`, `sk-012345…`)
  - MUST: Warn on unsaved changes before navigation
  - MUST: Compatible with password managers & 2FA; allow pasting one-time codes
  - MUST: Trim values to handle text expansion trailing spaces
  - MUST: No dead zones on checkboxes/radios; label+control share one generous hit target
- State & navigation
  - MUST: URL reflects state (deep-link filters/tabs/pagination/expanded panels) Prefer libs like [nuqs](https://nuqs.dev)
  - MUST: Back/Forward restores scroll
  - MUST: Links are links—use `<a>/<Link>` for navigation (support Cmd/Ctrl/middle-click)
- Feedback
  - SHOULD: Optimistic UI; reconcile on response; on failure show error and rollback or offer Undo
  - MUST: Confirm destructive actions or provide Undo window
  - MUST: Use polite `aria-live` for toasts/inline validation
  - SHOULD: Ellipsis (`…`) for options that open follow-ups (eg, “Rename…”)
- Touch/drag/scroll
  - MUST: Design forgiving interactions (generous targets, clear affordances; avoid finickiness)
  - MUST: Delay first tooltip in a group; subsequent peers no delay
  - MUST: Intentional `overscroll-behavior: contain` in modals/drawers
  - MUST: During drag, disable text selection and set `inert` on dragged element/containers
  - MUST: No “dead-looking” interactive zones—if it looks clickable, it is
- Autofocus
  - SHOULD: Autofocus on desktop when there’s a single primary input; rarely on mobile (to avoid layout shift)

## Animation

- MUST: Honor `prefers-reduced-motion` (provide reduced variant)
- SHOULD: Prefer CSS > Web Animations API > JS libraries
- MUST: Animate compositor-friendly props (`transform`, `opacity`); avoid layout/repaint props (`top/left/width/height`)
- SHOULD: Animate only to clarify cause/effect or add deliberate delight
- SHOULD: Choose easing to match the change (size/distance/trigger)
- MUST: Animations are interruptible and input-driven (avoid autoplay)
- MUST: Correct `transform-origin` (motion starts where it “physically” should)

## Layout

- SHOULD: Optical alignment; adjust by ±1px when perception beats geometry
- MUST: Deliberate alignment to grid/baseline/edges/optical centers—no accidental placement
- SHOULD: Balance icon/text lockups (stroke/weight/size/spacing/color)
- MUST: Verify mobile, laptop, ultra-wide (simulate ultra-wide at 50% zoom)
- MUST: Respect safe areas (use env(safe-area-inset-*))
- MUST: Avoid unwanted scrollbars; fix overflows

## Content & Accessibility

- SHOULD: Inline help first; tooltips last resort
- MUST: Skeletons mirror final content to avoid layout shift
- MUST: `<title>` matches current context
- MUST: No dead ends; always offer next step/recovery
- MUST: Design empty/sparse/dense/error states
- SHOULD: Curly quotes (“ ”); avoid widows/orphans
- MUST: Tabular numbers for comparisons (`font-variant-numeric: tabular-nums` or a mono like Geist Mono)
- MUST: Redundant status cues (not color-only); icons have text labels
- MUST: Don’t ship the schema—visuals may omit labels but accessible names still exist
- MUST: Use the ellipsis character `…` (not ``)
- MUST: `scroll-margin-top` on headings for anchored links; include a “Skip to content” link; hierarchical `<h1–h6>`
- MUST: Resilient to user-generated content (short/avg/very long)
- MUST: Locale-aware dates/times/numbers/currency
- MUST: Accurate names (`aria-label`), decorative elements `aria-hidden`, verify in the Accessibility Tree
- MUST: Icon-only buttons have descriptive `aria-label`
- MUST: Prefer native semantics (`button`, `a`, `label`, `table`) before ARIA
- SHOULD: Right-clicking the nav logo surfaces brand assets
- MUST: Use non-breaking spaces to glue terms: `10&nbsp;MB`, `⌘&nbsp;+&nbsp;K`, `Vercel&nbsp;SDK`

## Performance

- SHOULD: Test iOS Low Power Mode and macOS Safari
- MUST: Measure reliably (disable extensions that skew runtime)
- MUST: Track and minimize re-renders (React DevTools/React Scan)
- MUST: Profile with CPU/network throttling
- MUST: Batch layout reads/writes; avoid unnecessary reflows/repaints
- MUST: Mutations (`POST/PATCH/DELETE`) target <500 ms
- SHOULD: Prefer uncontrolled inputs; make controlled loops cheap (keystroke cost)
- MUST: Virtualize large lists (eg, `virtua`)
- MUST: Preload only above-the-fold images; lazy-load the rest
- MUST: Prevent CLS from images (explicit dimensions or reserved space)

## Design

- SHOULD: Layered shadows (ambient + direct)
- SHOULD: Crisp edges via semi-transparent borders + shadows
- SHOULD: Nested radii: child ≤ parent; concentric
- SHOULD: Hue consistency: tint borders/shadows/text toward bg hue
- MUST: Accessible charts (color-blind-friendly palettes)
- MUST: Meet contrast—prefer [APCA](https://apcacontrastcom/) over WCAG 2
- MUST: Increase contrast on `:hover/:active/:focus`
- SHOULD: Match browser UI to bg
- SHOULD: Avoid gradient banding (use masks when needed)
## License
This project is released under the MIT License.

Skip to content
Open sidebar

ChatGPT 5
You said:
Lets dl deep and drive about v0.app for make alternatives  also include all 
ChatGPT said:
Could you please clarify what aspects of v0.app you'd like me to focus on when creating alternatives? For example:

Key features you want alternatives to match (e.g., AI UI generation, React export, design-to-code, etc.)

Your intended use case (e.g., web design, app prototyping, production-ready UI)

Budget or preference for free vs. paid tools

Any specific platforms you want compatibility with (e.g., Figma, TailwindCSS, Next.js)

Once I have that information, I can start the deep research and comparison.

You said:
Key features you want alternatives to match (e.g., AI UI generation, React export, design-to-code, etc.)

Your intended use case (e.g., web design, app prototyping, production-ready UI)

Budget or preference for free vs. paid tools

Any specific platforms you want compatibility with (e.g., Figma, TailwindCSS, Next.js) Ai Eluments x Vercel AI SDK with Gemini Backends codemirror react x webcontainer x shodcn and prompt engniaring 
ChatGPT said:
Great, I’ll begin researching alternatives to v0.app that support AI-powered UI generation and design-to-code functionality, with compatibility for tools like AI Elements, Vercel AI SDK, Gemini backends, Codemirror, React, WebContainer, shadcn/ui, and prompt engineering.

I'll include options that support production-ready UI, React export, and TailwindCSS integration, and note whether they are free or paid.

I’ll let you know as soon as I have the full comparison ready.

Research completed in 5m · 13 sources · 54 searches
You said:
 Erite down the stacture now and create AGENTS.md fkt build 
ChatGPT said:
Could you please clarify what structure you'd like written down for AGENTS.md? Are you referring to outlining the architecture and design of AI agents (like for a v0.app alternative), or documenting specific agents and their roles in your own app/project build? Also let me know which framework or tech stack you're targeting (e.g., Next.js + Vercel SDK + Gemini + Shadcn).

You said:
Yes 
ChatGPT said:
Great. I’ll create a detailed AGENTS.md structure suitable for building an app using AI agents, assuming a modern stack like Next.js, Vercel AI SDK, Gemini backend, shadcn/ui, and tools like Codemirror, WebContainer, and prompt engineering integrations.

I'll document each agent role, input/output formats, LLM usage, and how they integrate with your frontend/backend logic.

I'll get back to you shortly with the structure ready for your review.

Research completed in 10m · 9 sources · 34 searches
ChatGPT said:
Structure and Documentation for AGENTS.md in AI-Driven App

AGENTS.md
Overview and Architecture
The AGENTS.md file serves as a central guide to our AI agents, defining their roles, interactions, and how they integrate into the project. Think of it as a README for the AI agents themselves – a dedicated, predictable place to provide context and instructions to help LLM-based agents work effectively in our codebase
agents.md
. This document outlines the multi-agent architecture, including how each agent functions, how they communicate, and how the system is deployed on our modern stack. Our application is built with Next.js 13+ (App Router), leveraging React Server Components (RSCs) and server actions for efficient server-side processing
vercel.com
. We use the Vercel AI SDK as a unified interface to multiple LLM providers
vercel.com
 – by default the agents use Google’s Gemini models, though the AI SDK makes it easy to switch between providers like OpenAI or Anthropic
vercel.com
. The frontend UI uses shadcn/ui (Radix-based components styled with Tailwind CSS) for a consistent and accessible design
vercel.com
. Additionally, we integrate CodeMirror as an in-browser code editor and WebContainer as an in-browser Node.js runtime sandbox. This combination allows agents to generate and execute code directly in the browser, providing a fast, secure feedback loop with zero server cost for code runs
webcontainers.io
webcontainers.io
. Prompt engineering workflows are employed to give each agent a clear persona and strategy, ensuring that outputs follow the expected format and policies. High-Level Architecture: Below is a simplified diagram of the agent system and data flow:
 User (Next.js + shadcn/UI) 
    │
    │ User query or command (open-ended prompt)
    ▼ 
 [Chat Agent] (LLM via Vercel AI SDK, e.g. Gemini)
    │ 
    ├─► If code needed: calls [Code Generation Agent] (LLM, specialized prompt) 
    │         └─► [Execution Agent] runs code in WebContainer, returns results
    │
    └─► Otherwise: processes query directly
    ▼ 
 Response streamed back to user UI (via AI SDK hooks)
In this architecture, the Chat Agent is the coordinator that interfaces with the user. It may invoke the specialized Code Generation Agent for coding tasks, which in turn can use the Execution Agent to run sandboxed code and verify outputs. The agents communicate through defined function calls (tools) and shared context, orchestrated on the server side. The result is then streamed back to the UI for the user. This design keeps the conversation flowing naturally while delegating complex tasks to the appropriate expert agent.
Agent Registry
Below is a registry of each AI agent in the system, including their purpose and configuration. Each agent is defined with a distinct name and role, along with the schemas, prompts, and tools that characterize its interaction. The input/output schema defines what the agent expects and produces (often enforced via JSON structures or TypeScript types), the prompt strategy outlines how we engineer the system and user prompts for that agent, and tools/functions are the programmatic capabilities or integrations the agent can use (for example, calling code execution or file APIs). We also list the model configuration (LLM provider, model name, temperature, etc.) and any routing logic that determines when this agent is activated (e.g., specific user commands or as a sub-agent in a chain).
Chat Agent (User Facing Coordinator)
Role: Primary interface with the user. This agent handles natural language dialogue, answers general questions, and delegates specialized tasks to other agents when needed. It maintains the overall conversational context and ensures the user’s requests are fulfilled by either responding directly or invoking other agents.
Input Schema: Free-form user messages (text). The agent expects open-ended prompts or instructions from the user. Internally, it can also accept signals from other agents (e.g. results from the Code Agent) to incorporate into the conversation.
Output Schema: Primarily conversational responses in Markdown (which may include formatted text, code blocks, etc., as appropriate for the query). If invoking other agents, it may output an action request in a structured format (e.g., a function call with arguments) instead of a direct user-facing answer, which the orchestrator uses to route to another agent.
Prompt Strategy: Uses a conversational system prompt that establishes its persona and high-level behavior. For example, a system message might instruct: “You are a helpful AI assistant and project coordinator. Answer user questions or delegate to coding tools as needed. Speak in a friendly, concise tone. When needed, use the Code Agent by calling the appropriate function, then continue the conversation with the results.” The prompt template includes guidelines for when to just answer vs. when to call other agents. Few-shot examples are provided to demonstrate this decision process (e.g., a Q&A example vs. a “please write code” example).
Tools/Functions: The Chat Agent can invoke internal functions exposed via the Vercel AI SDK (function calling) to trigger other agents. For instance, it has access to a generateCode() function (which forwards the request to the Code Generation Agent) and an executeCode() function (to run code via the Execution Agent). It does not directly use CodeMirror or WebContainer, but it orchestrates those that do by calling the appropriate functions. It may also use other tools like search or knowledge-base queries if those are provided (not in this stack by default).
Model Config: Uses a general-purpose LLM. By default this is Google Gemini (e.g. gemini-1.5-pro) for strong conversational and reasoning ability
vercel.com
. Temperature is set moderately low (e.g. 0.7) to maintain a balance between creativity and reliability in responses. The model is configured via the AI SDK, which means we can easily swap in another model (e.g., GPT-4 from OpenAI or Claude from Anthropic) with minimal code changes
vercel.com
. The Chat Agent’s responses are streamed back to the UI for a smooth experience (leveraging the AI SDK’s streaming support).
Routing Logic: Always the entry point for user input. Runs on Next.js server (via a server action or API route) and first processes every user message. If the user’s query indicates a need for coding (detected via keywords or by the model’s reasoning), the agent formulates a function call to invoke the Code Generation Agent. Otherwise, it responds directly. After other agents complete their tasks, the Chat Agent formats the final answer to the user. In a chain-of-agents, the Chat Agent is effectively the controller that decides which path to take.
Code Generation Agent (Coding Specialist)
Role: A specialized agent responsible for writing or modifying code based on a given specification. When the user asks for code (e.g., “Build a function to do X” or “Fix this code snippet”), this agent generates the code in the requested language, following project conventions and ensuring correctness.
Input Schema: A structured request for code. This could include a description of the desired functionality, constraints, and optionally snippets of existing code or error messages. For example, the input might be a JSON object like { "task": "create_function", "description": "Sort an array of numbers", "language": "TypeScript", "starterCode": "<optional existing code>" }. In practice, the Chat Agent provides the prompt context for this agent, combining the user’s request and any relevant context (file contents, error logs, etc.) into a detailed instruction.
Output Schema: The primary output is a code snippet or file content, typically delivered in Markdown format (fenced code block) for display. Additionally, the agent may return a metadata object alongside the code, e.g. { "filename": "sortUtil.ts", "explanation": "This function uses quicksort..." }. If using the AI SDK’s structured output capabilities, the code agent could return a JSON with separate fields for code and explanation, which the Chat Agent can then format for the user
ai-sdk.dev
. The output follows the project’s code style and type definitions as closely as possible.
Prompt Strategy: We use a system prompt that puts the model in the role of a senior software engineer familiar with our codebase. It includes project-specific guidelines from this AGENTS.md (like coding style, testing requirements, etc.) to ensure consistency
rimusz.net
rimusz.net
. For example: “You are a coding agent tasked with generating code that fits our project. Follow the coding conventions (TypeScript strict, single quotes, no semicolons)
agents.md
 and ensure all code passes tests. Given a task, output only the code unless an explanation is requested, and adhere to the input/output schema.” The prompt may also include templates for how to format the answer (e.g., “if an explanation field is requested, provide a brief comment”) and it might leverage few-shot examples of inputs and outputs to illustrate the expected format. We utilize Gemini’s advanced reasoning (the “thinking” mode) for complex coding tasks – Gemini’s internal multi-step planning is effective for coding and debugging
ai-sdk.dev
, which helps in writing correct code and even planning tests if needed.
Tools/Functions: The Code Generation Agent has access to the project’s virtual filesystem and editing tools. It can call a function like writeFile(path, content) to create or update a file in the WebContainer’s filesystem. It can also trigger an executeCode() tool to run tests or execute the generated code in the sandbox (though sometimes the Validation/Execution Agent handles actual running). In essence, this agent uses an internal “file API” to manipulate code; for example, after generating code, it might use a function to insert that code into the CodeMirror editor in the UI (so the user can see it or further edit). Additionally, it could use analysis tools – e.g., if a function call to a linter or compiler is available, it might invoke that to self-check the code before returning. All these tools are provided via the AI SDK’s function calling interface.
Model Config: Uses an LLM specialized or well-suited for code. By default, we use Gemini here as well, because Gemini’s model (especially newer versions like gemini-2.5 series) has strong coding capabilities with an internal reasoning process
ai-sdk.dev
. Alternatively, one could configure an OpenAI model like GPT-4 or code-davinci for this agent. The temperature is set lower (around 0.2-0.5) to prioritize deterministic, accurate code generation over creativity. We also enable structured output mode in the AI SDK if we want the agent to return JSON objects (for example, to separate code and explanations)
ai-sdk.dev
. The model is invoked with a function name (so it knows it’s fulfilling a tool request rather than chatting) which keeps the output focused.
Routing Logic: This agent is not called unless the task requires code generation or modification. It is typically invoked by the Chat Agent via a function call (e.g., generateCode). Once invoked, the orchestrator (Next.js API route or server action) passes along the prepared prompt and context to this agent’s model. After the Code Agent produces its output, the orchestrator may directly forward the results to the Execution Agent for testing if the workflow demands it, or return the results back to the Chat Agent. In summary, the Code Agent sits in the middle of the chain: it only runs as part of a chain when triggered, and it either returns code (and possibly an explanation) to the caller or triggers a subsequent test run.
Execution Agent (Sandbox Runner)
Role: Executes and evaluates code in a safe environment. This agent is responsible for running generated code, capturing its output or any errors, and feeding that information back to the other agents. It acts as a validation step – ensuring that code produced by the Code Agent actually works as intended (for example, passes all tests or produces expected results).
Input Schema: A specification of what to execute. Typically this includes a reference to the file or code snippet to run, along with any context needed (e.g., test cases or input data). For instance: { "action": "run_file", "file": "sortUtil.ts", "runTests": true } or { "action": "run_code", "code": "<inline code>", "input": [<test inputs>] }. The input can be flexible: if tests are part of the project, it might simply receive a command like “run pnpm test” to execute the test suite.
Output Schema: The runtime results of the execution. This typically includes stdout/stderr output, exit codes, and any structured result (like test pass/fail summary). For example, output could be { "stdout": "All tests passed", "stderr": "", "exitCode": 0 } or { "error": "TypeError: x is undefined", "trace": "Stack trace..." } depending on outcome. We ensure that this agent’s output is serialized as text or JSON so it can be interpreted by the Chat Agent or Code Agent. If all goes well, it might return a simple confirmation (or even no content, just a success status). If errors occur, it returns the error details so the Code Agent (or Chat Agent) can decide how to handle them.
Prompt Strategy: Unlike the others, the Execution Agent is less about natural language and more about performing an action. It doesn’t use a large language model to “generate” content; instead it executes code in the WebContainer. Thus, it doesn’t have a prompt in the usual sense. However, we can describe its behavior as: “When invoked with a file or code, run it in the sandbox and capture the output. Do not attempt to correct errors (you are not an LLM), just return the raw results.” The logic for this agent is implemented in our backend using the WebContainer API, not via an LLM prompt.
Tools/Functions: The Execution Agent’s primary tool is the WebContainer runtime. It uses the WebContainer Node.js environment to run commands. For example, it might execute node filename.js or npm run test within the sandbox. We use the WebContainer’s file system APIs to ensure the latest code from the Code Agent is present, and then use its process API to run the code. This occurs entirely client-side in the user’s browser tab (thanks to WebContainer’s ability to run Node.js in-browser)
webcontainers.io
. This approach is secure and fast – running inside the user’s browser avoids any server round-trip and isolates the execution to the user’s environment, which is ideal for untrusted code
webcontainers.io
. The Execution Agent function is exposed via the AI SDK as well (though it’s not an LLM call, just a normal function), so the Chat or Code agents can invoke it when needed (e.g., after code generation).
Model Config: N/A – This agent does not use an LLM. There is no model or temperature. It’s implemented as part of our application logic (TypeScript/Node code running via WebContainer). If we consider it an “agent” in the broader sense, it’s a non-LLM functional agent.
Routing Logic: Called whenever we need to validate or run code. Typically the flow is: the Code Agent finishes generating code, and then the orchestrator automatically invokes the Execution Agent to run tests or execute the code. The results are then fed back. In some cases, if the code failed (e.g., tests didn’t pass), the orchestrator might loop back and prompt the Code Agent to fix the issues, supplying the error output as additional context. This forms a feedback loop: Code Agent -> Execution Agent -> (feedback) -> Code Agent, until success or a certain number of tries. Once execution is successful, or if it’s just a onetime run (like running a script to show output), the final results (or confirmation of success) are passed to the Chat Agent, which then communicates it to the user. The Execution Agent is not directly exposed to user; it’s an internal helper that runs when triggered by other agents’ requests.
(If new agents are added in the future – for example, a Documentation Agent for writing project docs or a Data Analysis Agent for handling datasets – they would be appended here following the same format.)
Inter-Agent Communication and Orchestration
Our agents don’t operate in isolation – they coordinate through a managed orchestration process. This section describes how agents communicate and how the system ensures a coherent workflow:
Coordinator & Messaging: The Chat Agent serves as the high-level coordinator. In implementation terms, the Next.js server (via an API route or a server action) receives user messages and feeds them to the Chat Agent’s model. We utilize the Vercel AI SDK’s capabilities to handle this conversation, including its hook for streaming responses to the UI
vercel.com
. When the Chat Agent decides to invoke another agent, it does so by outputting a special structured message (using the function calling format). The server intercepts this and does not send it to the user; instead, it triggers the target agent’s logic. This is similar to how OpenAI function calling or tools in LangChain work, but implemented via our custom logic with AI SDK.
React Server Components (RSC) Role: We leverage Next.js RSCs and server-side routes to manage agent interaction securely. The heavy logic (LLM API calls, code execution, etc.) runs on the server (or in the client sandbox for WebContainer) and only the final UI-ready data is sent to the client, which improves performance and keeps secrets safe
vercel.com
. For example, the Chat Agent’s streaming reply is handled by an RSC that calls the AI SDK’s streamText() or similar function, and the partial data is streamed to the browser. RSCs also allow calling subsequent agents in sequence without additional client round-trips – the server can await the Code Agent and Execution Agent and compile their results before sending back a consolidated response.
State Management: We maintain an interaction state that tracks the conversation history and any intermediate artifacts (like generated code or execution results). The Chat Agent’s context includes the conversation messages (using the AI SDK’s message format for system, user, assistant messages) and any function results. When the Chat Agent calls the Code Agent, we append the user’s request and the function call into a new context for the Code Agent. After the Code Agent returns code, we capture that and invoke the Execution Agent, then take the Execution results and feed them (along with the original query and the code) back into the Code Agent or Chat Agent as needed. Essentially, we have a simple loop that goes: check next action → call agent → get result → repeat or finalize. This orchestration logic is implemented in the server action that powers the chat interface.
React Hooks for UI updates: On the client side, we use the Vercel AI SDK’s React hooks (such as useChat or similar) to bind the agent outputs to the UI. These hooks manage the streaming of tokens and also can help trigger actions on certain special messages. For example, if a function-result message comes through (which normally wouldn’t stream to the user), the hook or a custom effect can intercept it, and we prevent showing it in the chat UI. Instead, that triggers a state update that perhaps displays a loading indicator for “Code is being executed...” while the Execution Agent runs. Once the final output is ready (say the code executed successfully), the orchestrator sends a normal assistant message which the hook then appends to the chat UI. This way, the UI remains responsive and informs the user of each stage, without exposing the raw internals.
Inter-agent data format: Agents communicate via structured messages. Thanks to the AI SDK, our Chat Agent can output tool calls in a standardized way (similar to function calls with arguments), which we define for each agent. We use JSON schemas to define these where possible so that the LLM knows exactly how to format the call (the AI SDK and Gemini models support structured output and function calling natively
ai-sdk.dev
ai-sdk.dev
). This reduces misunderstandings – e.g., the Chat Agent might produce: {"function": "generateCode", "arguments": { "description": "sort an array", "language": "TypeScript" } }. The orchestrator recognizes this JSON and calls the generateCode handler (wired to the Code Generation Agent). Similarly, after execution, the Execution Agent returns a result object that we feed back in a system message or as part of the prompt to help the Code Agent refine its output if needed.
Error Handling and Timeouts: If any agent fails or takes too long (say code execution hangs), the orchestrator will catch that. We implement timeouts for the Execution Agent to avoid locking up the UI (since it runs in the browser, we also ensure it runs in a WebWorker or separate thread via WebContainer’s API if possible, to not freeze the UI). If an error occurs, that error is turned into a message that either goes back to the Code Agent (to prompt a fix) or to the Chat Agent to apologize to the user. We also include safety checks – for instance, we use the model/provider’s safety settings (like Google’s safety settings in Gemini) to avoid disallowed content
ai-sdk.dev
ai-sdk.dev
, and we sanitize any code execution outputs.
Logging and Iteration: For development, we log the interactions between agents (in development mode) for debugging our prompt strategies. This helps refine prompts when an agent does not behave as expected. We treat this system as a prompt-engineering-in-the-loop setup – logs of agent miscommunications lead to updates in prompt instructions or function definitions. Because the entire flow is contained within our Next.js app, we can iterate quickly on these workflows with hot reload.
In summary, the orchestration ensures each agent does its part and passes the baton to the next agent or back to the user. We use a mix of server-side coordination (for LLM calls and overall flow control) and client-side sandbox execution (for running code) to create a seamless experience. React hooks and streaming keep the UI responsive and interactive during multi-step agent tasks.
Deployment Notes
Deploying and running this multi-agent system requires certain configurations, especially concerning API keys and environment settings for the AI models:
Environment Configuration: We rely on environment variables for the AI providers. For example, to use the Gemini model, you must set GOOGLE_GENERATIVE_AI_API_KEY in the environment
ai.google.dev
ai.google.dev
. The app uses the Vercel AI SDK’s provider system to choose the model based on config. By default, our .env.example is set up for Google’s Gemini (which might require Google Cloud project setup and API key). If you want to switch to OpenAI, set the OPENAI_API_KEY and adjust the provider in the config (the AI SDK makes this a one-liner change to use OpenAI() instead of google() in our code
vercel.com
). We also have keys for any other tools (though in this project most heavy lifting is done by the LLMs and WebContainer which does not require a key).
Vercel Deployment: This project can be deployed on Vercel seamlessly, as it uses Next.js App Router and serverless functions that are Vercel-compatible. If deploying on Vercel, use the Vercel Dashboard or vercel env CLI to set the above environment variables (never commit your API keys)
vercel.com
. The WebContainer feature (running Node in the browser) does not require any server resources, but note that it may need certain headers or cross-origin settings if not on a Vercel domain. We have configured the app to use Vercel’s Edge Runtime where possible for the fastest responses, especially for streaming.
Gemini Model Routing: Because we use the AI SDK, the model routing is abstracted. In code, we initialize the default model as model = google('gemini-2.5-flash') or similar. The AI SDK’s unified API means that we can treat this like any other provider. Under the hood, the SDK calls the Gemini API endpoints. This also means we can take advantage of Gemini-specific features such as the “thinking” mode for step-by-step reasoning by setting thinkingConfig in the call
ai-sdk.dev
. We have enabled a moderate thinking budget for the Code Agent to allow it to internally reason through complex coding tasks (this does not produce external messages but improves the quality of code reasoning). The deployment should ensure the project is linked to a Google Cloud project with access to the Generative AI (Gemini) API. If that’s not available, one can switch to OpenAI’s models easily without changing the overall agent logic.
Testing and Monitoring: Before deployment, it’s important to run tests for each agent’s logic. We have unit tests that simulate agent inputs (e.g., a sample code request) and verify that the chain produces the expected outcome. In a production setting, you should also monitor the usage of the LLM APIs (they can be rate-limited or incur costs). Vercel’s AI SDK might eventually offer built-in monitoring or you can use logging to track each call. Also, consider using streaming for responses in production to improve user experience – our implementation already uses streaming for the Chat Agent’s responses, which is supported by both OpenAI and Gemini via the AI SDK
vercel.com
.
Security Considerations: Because we allow code execution (even if sandboxed), we need to be mindful of what that code can do. WebContainer is quite restricted (no network access by default, limited CPU/memory), which is good. We also ensure that user inputs that get to code execution are either coming from our agents (i.e., the user can’t directly inject malicious code to run outside of the sandbox) or sanitized. On the LLM side, we use safety filters (for Gemini via safetySettings
ai-sdk.dev
, and OpenAI has its own content filters). We also maintain AGENTS.md guidelines up to date so that any AI agent given access to our repo via tools like GitHub Copilot or similar will know the boundaries (for instance, we might explicitly note in this file “Do not access external URLs” if that was a concern).
Finally, deploying this system means we are essentially shipping a small scale AI orchestration. Treat the prompts and this documentation as living documents – as we update our codebase or find better prompt techniques, we should update AGENTS.md accordingly. This file not only guides human developers but also any AI agents reading the repo about how to interact with our project. By clearly defining agent roles and rules here, we create a more robust, maintainable, and AI-friendly codebase going forward
agents.md
agents.md
.






Sources



No file chosenNo file chosen
ChatGPT can make mistakes. OpenAI doesn't use Likhon Sheikh's Workspace workspace data to train its models.

Structure and Documentation for AGENTS.md in AI-Driven App
ChatGPT
I'm detailedly outlining the structure and content for AGENTS.md, focusing on AI agents, their roles, input/output schemas, tools, models, and deployment details in a modern stack.

Searched for AGENTS.md multi-agent repository
ChatGPT
I’m examining search results to understand "AGENTS.md" and its role in guiding coding agents, similar to a README file. The results point to its utility in AI-driven coding projects.

Searched for Vercel AI SDK Google Gemini
ChatGPT
I’m gathering info on integrating AGENTS.md with Next.js, Vercel AI SDK, Gemini backend APIs, and other tools to streamline AI agent orchestration and development.


Read rimusz.net

ChatGPT
I'm piecing together the components of AGENTS.md, focusing on a multi-agent architecture for a Next.js project. This includes defining agent roles, their responsibilities, and inter-agent communication methods.


Read ai.google.dev

ChatGPT
I’m curious about using the Vercel AI SDK and Gemini for complex tasks. The Gemini 2.5 series models impress with their 'thinking process,' boosting reasoning and planning.


Read ai-sdk.dev

ChatGPT
It's interesting to see the emphasis on different agents: UI Chat Agent, Code Generation Agent, Code Execution Agent, File Management Agent, and a Documentation Agent, each with specific responsibilities and integration points.

Searched for Next.js AI multi-agent chain
ChatGPT
Gathering info helps understand architecture or best practices in integrating AI agents with LangGraph and NextJS.


Read akveo.com

ChatGPT
Mapping out a custom architecture document for multi-agent systems, blending coding guidelines, agent roles, and system prompts, likely in a markdown format.


Read agents.md

ChatGPT
I’m thinking about defining AGENTS.md with a clear intro, sections on architecture, agents, inter-agent communication, and deployment notes, tailored for developers to understand and maintain the multi-agent system.


Read reddit.com

ChatGPT
I'm piecing together the roles of agents, such as a "UI/Chat agent" for user interactions and a "Code Generation Agent" for coding tasks, in a Next.js application.


Read vercel.com

ChatGPT
The template leverages Next.js for SSR, AI SDK for unified model calls, Shadcn for UI components, and supports dynamic chat UI with Hooks.

Searched for Next.js WebContainer AI agent execution
ChatGPT
I'm considering "How to Build Client-Side Code Execution for AI Agents - Medium" [5] to understand potential insights into using WebContainer.


Read medium.com

ChatGPT
I'm exploring the medium article's analysis of client vs server code execution for AI agents. It doesn't mention WebContainer or CodeMirror, but suggests client-side execution likely involves technologies like Pyodide or WebContainer for running JavaScript code.


Read webcontainers.io

ChatGPT
I'm mapping out potential agent names like "Conversation Agent" for interactions and "Coding Agent" for code generation. This approach ensures clarity and roles are well defined.

Research completed in 10m · 9 sources

AGENTS.md
Overview and Architecture
The AGENTS.md file serves as a central guide to our AI agents, defining their roles, interactions, and how they integrate into the project. Think of it as a README for the AI agents themselves – a dedicated, predictable place to provide context and instructions to help LLM-based agents work effectively in our codebase
agents.md
. This document outlines the multi-agent architecture, including how each agent functions, how they communicate, and how the system is deployed on our modern stack. Our application is built with Next.js 13+ (App Router), leveraging React Server Components (RSCs) and server actions for efficient server-side processing
vercel.com
. We use the Vercel AI SDK as a unified interface to multiple LLM providers
vercel.com
 – by default the agents use Google’s Gemini models, though the AI SDK makes it easy to switch between providers like OpenAI or Anthropic
vercel.com
. The frontend UI uses shadcn/ui (Radix-based components styled with Tailwind CSS) for a consistent and accessible design
vercel.com
. Additionally, we integrate CodeMirror as an in-browser code editor and WebContainer as an in-browser Node.js runtime sandbox. This combination allows agents to generate and execute code directly in the browser, providing a fast, secure feedback loop with zero server cost for code runs
webcontainers.io
webcontainers.io
. Prompt engineering workflows are employed to give each agent a clear persona and strategy, ensuring that outputs follow the expected format and policies. High-Level Architecture: Below is a simplified diagram of the agent system and data flow:
 User (Next.js + shadcn/UI) 
    │
    │ User query or command (open-ended prompt)
    ▼ 
 [Chat Agent] (LLM via Vercel AI SDK, e.g. Gemini)
    │ 
    ├─► If code needed: calls [Code Generation Agent] (LLM, specialized prompt) 
    │         └─► [Execution Agent] runs code in WebContainer, returns results
    │
    └─► Otherwise: processes query directly
    ▼ 
 Response streamed back to user UI (via AI SDK hooks)
In this architecture, the Chat Agent is the coordinator that interfaces with the user. It may invoke the specialized Code Generation Agent for coding tasks, which in turn can use the Execution Agent to run sandboxed code and verify outputs. The agents communicate through defined function calls (tools) and shared context, orchestrated on the server side. The result is then streamed back to the UI for the user. This design keeps the conversation flowing naturally while delegating complex tasks to the appropriate expert agent.
Agent Registry
Below is a registry of each AI agent in the system, including their purpose and configuration. Each agent is defined with a distinct name and role, along with the schemas, prompts, and tools that characterize its interaction. The input/output schema defines what the agent expects and produces (often enforced via JSON structures or TypeScript types), the prompt strategy outlines how we engineer the system and user prompts for that agent, and tools/functions are the programmatic capabilities or integrations the agent can use (for example, calling code execution or file APIs). We also list the model configuration (LLM provider, model name, temperature, etc.) and any routing logic that determines when this agent is activated (e.g., specific user commands or as a sub-agent in a chain).
Chat Agent (User Facing Coordinator)
Role: Primary interface with the user. This agent handles natural language dialogue, answers general questions, and delegates specialized tasks to other agents when needed. It maintains the overall conversational context and ensures the user’s requests are fulfilled by either responding directly or invoking other agents.
Input Schema: Free-form user messages (text). The agent expects open-ended prompts or instructions from the user. Internally, it can also accept signals from other agents (e.g. results from the Code Agent) to incorporate into the conversation.
Output Schema: Primarily conversational responses in Markdown (which may include formatted text, code blocks, etc., as appropriate for the query). If invoking other agents, it may output an action request in a structured format (e.g., a function call with arguments) instead of a direct user-facing answer, which the orchestrator uses to route to another agent.
Prompt Strategy: Uses a conversational system prompt that establishes its persona and high-level behavior. For example, a system message might instruct: “You are a helpful AI assistant and project coordinator. Answer user questions or delegate to coding tools as needed. Speak in a friendly, concise tone. When needed, use the Code Agent by calling the appropriate function, then continue the conversation with the results.” The prompt template includes guidelines for when to just answer vs. when to call other agents. Few-shot examples are provided to demonstrate this decision process (e.g., a Q&A example vs. a “please write code” example).
Tools/Functions: The Chat Agent can invoke internal functions exposed via the Vercel AI SDK (function calling) to trigger other agents. For instance, it has access to a generateCode() function (which forwards the request to the Code Generation Agent) and an executeCode() function (to run code via the Execution Agent). It does not directly use CodeMirror or WebContainer, but it orchestrates those that do by calling the appropriate functions. It may also use other tools like search or knowledge-base queries if those are provided (not in this stack by default).
Model Config: Uses a general-purpose LLM. By default this is Google Gemini (e.g. gemini-1.5-pro) for strong conversational and reasoning ability
vercel.com
. Temperature is set moderately low (e.g. 0.7) to maintain a balance between creativity and reliability in responses. The model is configured via the AI SDK, which means we can easily swap in another model (e.g., GPT-4 from OpenAI or Claude from Anthropic) with minimal code changes
vercel.com
. The Chat Agent’s responses are streamed back to the UI for a smooth experience (leveraging the AI SDK’s streaming support).
Routing Logic: Always the entry point for user input. Runs on Next.js server (via a server action or API route) and first processes every user message. If the user’s query indicates a need for coding (detected via keywords or by the model’s reasoning), the agent formulates a function call to invoke the Code Generation Agent. Otherwise, it responds directly. After other agents complete their tasks, the Chat Agent formats the final answer to the user. In a chain-of-agents, the Chat Agent is effectively the controller that decides which path to take.
Code Generation Agent (Coding Specialist)
Role: A specialized agent responsible for writing or modifying code based on a given specification. When the user asks for code (e.g., “Build a function to do X” or “Fix this code snippet”), this agent generates the code in the requested language, following project conventions and ensuring correctness.
Input Schema: A structured request for code. This could include a description of the desired functionality, constraints, and optionally snippets of existing code or error messages. For example, the input might be a JSON object like { "task": "create_function", "description": "Sort an array of numbers", "language": "TypeScript", "starterCode": "<optional existing code>" }. In practice, the Chat Agent provides the prompt context for this agent, combining the user’s request and any relevant context (file contents, error logs, etc.) into a detailed instruction.
Output Schema: The primary output is a code snippet or file content, typically delivered in Markdown format (fenced code block) for display. Additionally, the agent may return a metadata object alongside the code, e.g. { "filename": "sortUtil.ts", "explanation": "This function uses quicksort..." }. If using the AI SDK’s structured output capabilities, the code agent could return a JSON with separate fields for code and explanation, which the Chat Agent can then format for the user
ai-sdk.dev
. The output follows the project’s code style and type definitions as closely as possible.
Prompt Strategy: We use a system prompt that puts the model in the role of a senior software engineer familiar with our codebase. It includes project-specific guidelines from this AGENTS.md (like coding style, testing requirements, etc.) to ensure consistency
rimusz.net
rimusz.net
. For example: “You are a coding agent tasked with generating code that fits our project. Follow the coding conventions (TypeScript strict, single quotes, no semicolons)
agents.md
 and ensure all code passes tests. Given a task, output only the code unless an explanation is requested, and adhere to the input/output schema.” The prompt may also include templates for how to format the answer (e.g., “if an explanation field is requested, provide a brief comment”) and it might leverage few-shot examples of inputs and outputs to illustrate the expected format. We utilize Gemini’s advanced reasoning (the “thinking” mode) for complex coding tasks – Gemini’s internal multi-step planning is effective for coding and debugging
ai-sdk.dev
, which helps in writing correct code and even planning tests if needed.
Tools/Functions: The Code Generation Agent has access to the project’s virtual filesystem and editing tools. It can call a function like writeFile(path, content) to create or update a file in the WebContainer’s filesystem. It can also trigger an executeCode() tool to run tests or execute the generated code in the sandbox (though sometimes the Validation/Execution Agent handles actual running). In essence, this agent uses an internal “file API” to manipulate code; for example, after generating code, it might use a function to insert that code into the CodeMirror editor in the UI (so the user can see it or further edit). Additionally, it could use analysis tools – e.g., if a function call to a linter or compiler is available, it might invoke that to self-check the code before returning. All these tools are provided via the AI SDK’s function calling interface.
Model Config: Uses an LLM specialized or well-suited for code. By default, we use Gemini here as well, because Gemini’s model (especially newer versions like gemini-2.5 series) has strong coding capabilities with an internal reasoning process
ai-sdk.dev
. Alternatively, one could configure an OpenAI model like GPT-4 or code-davinci for this agent. The temperature is set lower (around 0.2-0.5) to prioritize deterministic, accurate code generation over creativity. We also enable structured output mode in the AI SDK if we want the agent to return JSON objects (for example, to separate code and explanations)
ai-sdk.dev
. The model is invoked with a function name (so it knows it’s fulfilling a tool request rather than chatting) which keeps the output focused.
Routing Logic: This agent is not called unless the task requires code generation or modification. It is typically invoked by the Chat Agent via a function call (e.g., generateCode). Once invoked, the orchestrator (Next.js API route or server action) passes along the prepared prompt and context to this agent’s model. After the Code Agent produces its output, the orchestrator may directly forward the results to the Execution Agent for testing if the workflow demands it, or return the results back to the Chat Agent. In summary, the Code Agent sits in the middle of the chain: it only runs as part of a chain when triggered, and it either returns code (and possibly an explanation) to the caller or triggers a subsequent test run.
Execution Agent (Sandbox Runner)
Role: Executes and evaluates code in a safe environment. This agent is responsible for running generated code, capturing its output or any errors, and feeding that information back to the other agents. It acts as a validation step – ensuring that code produced by the Code Agent actually works as intended (for example, passes all tests or produces expected results).
Input Schema: A specification of what to execute. Typically this includes a reference to the file or code snippet to run, along with any context needed (e.g., test cases or input data). For instance: { "action": "run_file", "file": "sortUtil.ts", "runTests": true } or { "action": "run_code", "code": "<inline code>", "input": [<test inputs>] }. The input can be flexible: if tests are part of the project, it might simply receive a command like “run pnpm test” to execute the test suite.
Output Schema: The runtime results of the execution. This typically includes stdout/stderr output, exit codes, and any structured result (like test pass/fail summary). For example, output could be { "stdout": "All tests passed", "stderr": "", "exitCode": 0 } or { "error": "TypeError: x is undefined", "trace": "Stack trace..." } depending on outcome. We ensure that this agent’s output is serialized as text or JSON so it can be interpreted by the Chat Agent or Code Agent. If all goes well, it might return a simple confirmation (or even no content, just a success status). If errors occur, it returns the error details so the Code Agent (or Chat Agent) can decide how to handle them.
Prompt Strategy: Unlike the others, the Execution Agent is less about natural language and more about performing an action. It doesn’t use a large language model to “generate” content; instead it executes code in the WebContainer. Thus, it doesn’t have a prompt in the usual sense. However, we can describe its behavior as: “When invoked with a file or code, run it in the sandbox and capture the output. Do not attempt to correct errors (you are not an LLM), just return the raw results.” The logic for this agent is implemented in our backend using the WebContainer API, not via an LLM prompt.
Tools/Functions: The Execution Agent’s primary tool is the WebContainer runtime. It uses the WebContainer Node.js environment to run commands. For example, it might execute node filename.js or npm run test within the sandbox. We use the WebContainer’s file system APIs to ensure the latest code from the Code Agent is present, and then use its process API to run the code. This occurs entirely client-side in the user’s browser tab (thanks to WebContainer’s ability to run Node.js in-browser)
webcontainers.io
. This approach is secure and fast – running inside the user’s browser avoids any server round-trip and isolates the execution to the user’s environment, which is ideal for untrusted code
webcontainers.io
. The Execution Agent function is exposed via the AI SDK as well (though it’s not an LLM call, just a normal function), so the Chat or Code agents can invoke it when needed (e.g., after code generation).
Model Config: N/A – This agent does not use an LLM. There is no model or temperature. It’s implemented as part of our application logic (TypeScript/Node code running via WebContainer). If we consider it an “agent” in the broader sense, it’s a non-LLM functional agent.
Routing Logic: Called whenever we need to validate or run code. Typically the flow is: the Code Agent finishes generating code, and then the orchestrator automatically invokes the Execution Agent to run tests or execute the code. The results are then fed back. In some cases, if the code failed (e.g., tests didn’t pass), the orchestrator might loop back and prompt the Code Agent to fix the issues, supplying the error output as additional context. This forms a feedback loop: Code Agent -> Execution Agent -> (feedback) -> Code Agent, until success or a certain number of tries. Once execution is successful, or if it’s just a onetime run (like running a script to show output), the final results (or confirmation of success) are passed to the Chat Agent, which then communicates it to the user. The Execution Agent is not directly exposed to user; it’s an internal helper that runs when triggered by other agents’ requests.
(If new agents are added in the future – for example, a Documentation Agent for writing project docs or a Data Analysis Agent for handling datasets – they would be appended here following the same format.)
Inter-Agent Communication and Orchestration
Our agents don’t operate in isolation – they coordinate through a managed orchestration process. This section describes how agents communicate and how the system ensures a coherent workflow:
Coordinator & Messaging: The Chat Agent serves as the high-level coordinator. In implementation terms, the Next.js server (via an API route or a server action) receives user messages and feeds them to the Chat Agent’s model. We utilize the Vercel AI SDK’s capabilities to handle this conversation, including its hook for streaming responses to the UI
vercel.com
. When the Chat Agent decides to invoke another agent, it does so by outputting a special structured message (using the function calling format). The server intercepts this and does not send it to the user; instead, it triggers the target agent’s logic. This is similar to how OpenAI function calling or tools in LangChain work, but implemented via our custom logic with AI SDK.
React Server Components (RSC) Role: We leverage Next.js RSCs and server-side routes to manage agent interaction securely. The heavy logic (LLM API calls, code execution, etc.) runs on the server (or in the client sandbox for WebContainer) and only the final UI-ready data is sent to the client, which improves performance and keeps secrets safe
vercel.com
. For example, the Chat Agent’s streaming reply is handled by an RSC that calls the AI SDK’s streamText() or similar function, and the partial data is streamed to the browser. RSCs also allow calling subsequent agents in sequence without additional client round-trips – the server can await the Code Agent and Execution Agent and compile their results before sending back a consolidated response.
State Management: We maintain an interaction state that tracks the conversation history and any intermediate artifacts (like generated code or execution results). The Chat Agent’s context includes the conversation messages (using the AI SDK’s message format for system, user, assistant messages) and any function results. When the Chat Agent calls the Code Agent, we append the user’s request and the function call into a new context for the Code Agent. After the Code Agent returns code, we capture that and invoke the Execution Agent, then take the Execution results and feed them (along with the original query and the code) back into the Code Agent or Chat Agent as needed. Essentially, we have a simple loop that goes: check next action → call agent → get result → repeat or finalize. This orchestration logic is implemented in the server action that powers the chat interface.
React Hooks for UI updates: On the client side, we use the Vercel AI SDK’s React hooks (such as useChat or similar) to bind the agent outputs to the UI. These hooks manage the streaming of tokens and also can help trigger actions on certain special messages. For example, if a function-result message comes through (which normally wouldn’t stream to the user), the hook or a custom effect can intercept it, and we prevent showing it in the chat UI. Instead, that triggers a state update that perhaps displays a loading indicator for “Code is being executed...” while the Execution Agent runs. Once the final output is ready (say the code executed successfully), the orchestrator sends a normal assistant message which the hook then appends to the chat UI. This way, the UI remains responsive and informs the user of each stage, without exposing the raw internals.
Inter-agent data format: Agents communicate via structured messages. Thanks to the AI SDK, our Chat Agent can output tool calls in a standardized way (similar to function calls with arguments), which we define for each agent. We use JSON schemas to define these where possible so that the LLM knows exactly how to format the call (the AI SDK and Gemini models support structured output and function calling natively
ai-sdk.dev
ai-sdk.dev
). This reduces misunderstandings – e.g., the Chat Agent might produce: {"function": "generateCode", "arguments": { "description": "sort an array", "language": "TypeScript" } }. The orchestrator recognizes this JSON and calls the generateCode handler (wired to the Code Generation Agent). Similarly, after execution, the Execution Agent returns a result object that we feed back in a system message or as part of the prompt to help the Code Agent refine its output if needed.
Error Handling and Timeouts: If any agent fails or takes too long (say code execution hangs), the orchestrator will catch that. We implement timeouts for the Execution Agent to avoid locking up the UI (since it runs in the browser, we also ensure it runs in a WebWorker or separate thread via WebContainer’s API if possible, to not freeze the UI). If an error occurs, that error is turned into a message that either goes back to the Code Agent (to prompt a fix) or to the Chat Agent to apologize to the user. We also include safety checks – for instance, we use the model/provider’s safety settings (like Google’s safety settings in Gemini) to avoid disallowed content
ai-sdk.dev
ai-sdk.dev
, and we sanitize any code execution outputs.
Logging and Iteration: For development, we log the interactions between agents (in development mode) for debugging our prompt strategies. This helps refine prompts when an agent does not behave as expected. We treat this system as a prompt-engineering-in-the-loop setup – logs of agent miscommunications lead to updates in prompt instructions or function definitions. Because the entire flow is contained within our Next.js app, we can iterate quickly on these workflows with hot reload.
In summary, the orchestration ensures each agent does its part and passes the baton to the next agent or back to the user. We use a mix of server-side coordination (for LLM calls and overall flow control) and client-side sandbox execution (for running code) to create a seamless experience. React hooks and streaming keep the UI responsive and interactive during multi-step agent tasks.
Deployment Notes
Deploying and running this multi-agent system requires certain configurations, especially concerning API keys and environment settings for the AI models:
Environment Configuration: We rely on environment variables for the AI providers. For example, to use the Gemini model, you must set GOOGLE_GENERATIVE_AI_API_KEY in the environment
ai.google.dev
ai.google.dev
. The app uses the Vercel AI SDK’s provider system to choose the model based on config. By default, our .env.example is set up for Google’s Gemini (which might require Google Cloud project setup and API key). If you want to switch to OpenAI, set the OPENAI_API_KEY and adjust the provider in the config (the AI SDK makes this a one-liner change to use OpenAI() instead of google() in our code
vercel.com
). We also have keys for any other tools (though in this project most heavy lifting is done by the LLMs and WebContainer which does not require a key).
Vercel Deployment: This project can be deployed on Vercel seamlessly, as it uses Next.js App Router and serverless functions that are Vercel-compatible. If deploying on Vercel, use the Vercel Dashboard or vercel env CLI to set the above environment variables (never commit your API keys)
vercel.com
. The WebContainer feature (running Node in the browser) does not require any server resources, but note that it may need certain headers or cross-origin settings if not on a Vercel domain. We have configured the app to use Vercel’s Edge Runtime where possible for the fastest responses, especially for streaming.
Gemini Model Routing: Because we use the AI SDK, the model routing is abstracted. In code, we initialize the default model as model = google('gemini-2.5-flash') or similar. The AI SDK’s unified API means that we can treat this like any other provider. Under the hood, the SDK calls the Gemini API endpoints. This also means we can take advantage of Gemini-specific features such as the “thinking” mode for step-by-step reasoning by setting thinkingConfig in the call
ai-sdk.dev
. We have enabled a moderate thinking budget for the Code Agent to allow it to internally reason through complex coding tasks (this does not produce external messages but improves the quality of code reasoning). The deployment should ensure the project is linked to a Google Cloud project with access to the Generative AI (Gemini) API. If that’s not available, one can switch to OpenAI’s models easily without changing the overall agent logic.
Testing and Monitoring: Before deployment, it’s important to run tests for each agent’s logic. We have unit tests that simulate agent inputs (e.g., a sample code request) and verify that the chain produces the expected outcome. In a production setting, you should also monitor the usage of the LLM APIs (they can be rate-limited or incur costs). Vercel’s AI SDK might eventually offer built-in monitoring or you can use logging to track each call. Also, consider using streaming for responses in production to improve user experience – our implementation already uses streaming for the Chat Agent’s responses, which is supported by both OpenAI and Gemini via the AI SDK
vercel.com
.
Security Considerations: Because we allow code execution (even if sandboxed), we need to be mindful of what that code can do. WebContainer is quite restricted (no network access by default, limited CPU/memory), which is good. We also ensure that user inputs that get to code execution are either coming from our agents (i.e., the user can’t directly inject malicious code to run outside of the sandbox) or sanitized. On the LLM side, we use safety filters (for Gemini via safetySettings
ai-sdk.dev
, and OpenAI has its own content filters). We also maintain AGENTS.md guidelines up to date so that any AI agent given access to our repo via tools like GitHub Copilot or similar will know the boundaries (for instance, we might explicitly note in this file “Do not access external URLs” if that was a concern).
Finally, deploying this system means we are essentially shipping a small scale AI orchestration. Treat the prompts and this documentation as living documents – as we update our codebase or find better prompt techniques, we should update AGENTS.md accordingly. This file not only guides human developers but also any AI agents reading the repo about how to interact with our project. By clearly defining agent roles and rules here, we create a more robust, maintainable, and AI-friendly codebase going forward
agents.md
agents.md
.
Citations

AGENTS.md

https://agents.md/

Gemini AI Chatbot

https://vercel.com/templates/next.js/gemini-ai-chatbot

Gemini AI Chatbot

https://vercel.com/templates/next.js/gemini-ai-chatbot

Gemini AI Chatbot

https://vercel.com/templates/next.js/gemini-ai-chatbot

Gemini AI Chatbot

https://vercel.com/templates/next.js/gemini-ai-chatbot

Runtime Test Cases For AI Agents | WebContainers

https://webcontainers.io/guides/ai-agents

Runtime Test Cases For AI Agents | WebContainers

https://webcontainers.io/guides/ai-agents

AI SDK Providers: Google Generative AI

https://ai-sdk.dev/providers/ai-sdk-providers/google-generative-ai

Unlocking the Power of AI Coding Agents: A Deep Dive into OpenAI's AGENTS.md Format

https://rimusz.net/unlocking-the-power-of-ai-coding-agents-a-deep-dive-into-openais-agents-md-format/

Unlocking the Power of AI Coding Agents: A Deep Dive into OpenAI's AGENTS.md Format

https://rimusz.net/unlocking-the-power-of-ai-coding-agents-a-deep-dive-into-openais-agents-md-format/

AGENTS.md

https://agents.md/

AI SDK Providers: Google Generative AI

https://ai-sdk.dev/providers/ai-sdk-providers/google-generative-ai

AI SDK Providers: Google Generative AI

https://ai-sdk.dev/providers/ai-sdk-providers/google-generative-ai

AI SDK Providers: Google Generative AI

https://ai-sdk.dev/providers/ai-sdk-providers/google-generative-ai

AI SDK Providers: Google Generative AI

https://ai-sdk.dev/providers/ai-sdk-providers/google-generative-ai

AI SDK Providers: Google Generative AI

https://ai-sdk.dev/providers/ai-sdk-providers/google-generative-ai

AI SDK Providers: Google Generative AI

https://ai-sdk.dev/providers/ai-sdk-providers/google-generative-ai

Market Research Agent with Gemini and the AI SDK by Vercel  |  Gemini API  |  Google AI for Developers

https://ai.google.dev/gemini-api/docs/vercel-ai-sdk-example

Market Research Agent with Gemini and the AI SDK by Vercel  |  Gemini API  |  Google AI for Developers

https://ai.google.dev/gemini-api/docs/vercel-ai-sdk-example

Gemini AI Chatbot

https://vercel.com/templates/next.js/gemini-ai-chatbot

AGENTS.md

https://agents.md/

AGENTS.md

https://agents.md/
All Sources

agents

vercel

webcontainers

ai-sdk

rimusz

ai.google
