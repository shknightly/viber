import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
  type Content,
  type GenerateContentRequest,
} from '@google/generative-ai';
import { chatRequestConfigSchema, type ChatMessage } from '@viber/types';
import { z } from 'zod';

const DEFAULT_MODEL = 'gemini-1.5-flash-latest';
const textEncoder = new TextEncoder();

const envSchema = z.object({
  GOOGLE_GENAI_API_KEY: z.string().min(1, 'GOOGLE_GENAI_API_KEY must be set in the environment.'),
});

type InternalConfig = z.infer<typeof chatRequestConfigSchema>;

export interface GoogleClientOptions extends InternalConfig {
  apiKey?: string;
  model?: string;
}

export interface StreamOptions {
  messages: ChatMessage[];
  config?: InternalConfig;
  model?: string;
}

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SELF_HARM,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUAL,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

const toContent = (messages: ChatMessage[]): Content[] =>
  messages.map((message) => ({
    role: message.role === 'assistant' ? 'model' : message.role,
    parts: [{ text: message.content }],
  }));

const buildSystemInstruction = (instruction?: InternalConfig['systemInstruction']): Content | undefined => {
  if (!instruction) {
    return undefined;
  }

  if (typeof instruction === 'string') {
    return {
      role: 'system',
      parts: [{ text: instruction }],
    } satisfies Content;
  }

  return {
    role: 'system',
    parts: instruction.map((entry) => ({ text: entry })),
  } satisfies Content;
};

const resolveClient = ({ apiKey }: GoogleClientOptions) => {
  const parsed = envSchema.parse({
    GOOGLE_GENAI_API_KEY: apiKey ?? process.env.GOOGLE_GENAI_API_KEY,
  });

  return new GoogleGenerativeAI(parsed.GOOGLE_GENAI_API_KEY);
};

export const createGenerativeModel = (options: GoogleClientOptions = {}) => {
  const client = resolveClient(options);

  const model = client.getGenerativeModel({
    model: options.model ?? DEFAULT_MODEL,
    systemInstruction: buildSystemInstruction(options.systemInstruction),
    safetySettings,
    generationConfig: {
      temperature: options.temperature ?? 0.4,
      topP: options.topP ?? 0.9,
      topK: options.topK ?? 32,
      maxOutputTokens: options.maxOutputTokens ?? 2048,
    },
  });

  return model;
};

export const streamGenerativeContent = async ({
  messages,
  config,
  model,
}: StreamOptions): Promise<ReadableStream<Uint8Array>> => {
  const parsedConfig = chatRequestConfigSchema.parse(config ?? {});
  const generativeModel = createGenerativeModel({
    ...parsedConfig,
    model,
  });

  const request: GenerateContentRequest = {
    contents: toContent(messages),
  };

  const result = await generativeModel.generateContentStream(request);

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const chunk of result.stream) {
          const text = chunk.text();

          if (text) {
            controller.enqueue(textEncoder.encode(text));
          }
        }

        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });
};
