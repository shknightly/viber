import { streamGenerativeContent } from '@viber/agent-llm';
import {
  chatRequestSchema,
  sanitizeMessages,
  type ChatMessage,
  type ChatRequestConfig,
} from '@viber/types';

export interface ChatStreamOptions {
  messages: ChatMessage[];
  config?: ChatRequestConfig;
  model?: string;
}

export const streamChatCompletion = async ({
  messages,
  config,
  model,
}: ChatStreamOptions) => {
  const parsed = chatRequestSchema.parse({
    messages: sanitizeMessages(messages),
    config: config ?? {},
  });

  return streamGenerativeContent({
    messages: parsed.messages,
    config: parsed.config,
    model,
  });
};

export class AgentCoreError extends Error {
  public readonly cause?: unknown;

  constructor(message: string, cause?: unknown) {
    super(message);
    this.name = 'AgentCoreError';
    this.cause = cause;
  }
}

export const assertMessagesNotEmpty = (messages: ChatMessage[]): void => {
  if (messages.length === 0) {
    throw new AgentCoreError('At least one message is required before invoking the model.');
  }
};
