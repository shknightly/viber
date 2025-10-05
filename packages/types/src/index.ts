import { z } from 'zod';

const iso8601Regex =
  /^(\\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])T([01]\\d|2[0-3]):([0-5]\\d):([0-5]\\d)(\\.\\d+)?Z$/;

export const messageRoleSchema = z.enum(['system', 'user', 'assistant']);

export const isoDateSchema = z
  .string()
  .refine((value) => iso8601Regex.test(value), {
    message: 'createdAt must be a valid ISO 8601 UTC timestamp.',
  });

export const chatMessageSchema = z.object({
  id: z.string().min(1, 'Message id must be provided.'),
  role: messageRoleSchema,
  content: z.string().min(1, 'Message content cannot be empty.'),
  createdAt: isoDateSchema.default(() => new Date().toISOString()),
  annotations: z
    .array(
      z.object({
        type: z.string(),
        data: z.record(z.any()),
      })
    )
    .default([]),
});

export const chatRequestConfigSchema = z
  .object({
    temperature: z.number().min(0).max(2).optional(),
    topP: z.number().min(0).max(1).optional(),
    topK: z.number().min(1).max(512).optional(),
    maxOutputTokens: z.number().int().min(128).max(8192).optional(),
    systemInstruction: z.union([z.string(), z.array(z.string())]).optional(),
    tools: z
      .array(
        z.object({
          name: z.string(),
          description: z.string().optional(),
          parameters: z.record(z.any()).optional(),
        })
      )
      .optional(),
  })
  .default({});

export const chatRequestSchema = z.object({
  messages: z.array(chatMessageSchema).min(1, 'At least one message is required.'),
  config: chatRequestConfigSchema,
});

export type MessageRole = z.infer<typeof messageRoleSchema>;
export type ChatMessage = z.infer<typeof chatMessageSchema>;
export type ChatRequestConfig = z.infer<typeof chatRequestConfigSchema>;
export type ChatRequest = z.infer<typeof chatRequestSchema>;

export const createMessage = ({
  id,
  role,
  content,
  createdAt = new Date().toISOString(),
}: {
  id: string;
  role: MessageRole;
  content: string;
  createdAt?: string;
}): ChatMessage => ({
  id,
  role,
  content,
  createdAt,
  annotations: [],
});

export const sanitizeMessages = (messages: ChatMessage[]): ChatMessage[] =>
  messages.map((message) => ({
    ...message,
    content: message.content.trim(),
  }));
