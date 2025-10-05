'use client';

import { Card, Grid, Spacer, Text } from '@geist-ui/core';
import { useCallback, useMemo, useState } from 'react';
import { createMessage, type ChatMessage } from '@viber/types';
import MessageComposer from './MessageComposer';
import type { ComposerPayload } from './MessageComposer';
import MessageList from './MessageList';
import PromptExamples from './PromptExamples';
import StatusIndicator from './StatusIndicator';
import { createId } from '../lib/id';

type GenerationStatus = 'idle' | 'streaming' | 'error';

const SYSTEM_PROMPT = `You are x0, an AI assistant created by Vercel to be helpful, harmless, and honest. Provide detailed yet concise answers with clear callouts for risks and follow-up steps.`;

const INITIAL_PROMPT = 'Explain the concept of serverless computing in simple terms, highlighting its benefits for developers.';

const ChatInterface = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    createMessage({ id: createId(), role: 'system', content: SYSTEM_PROMPT }),
  ]);
  const [status, setStatus] = useState<GenerationStatus>('idle');
  const [selectedPrompt, setSelectedPrompt] = useState<string>(INITIAL_PROMPT);

  const onSubmit = useCallback(
    async ({ prompt, code }: ComposerPayload) => {
      const timestamp = new Date().toISOString();
      const userContent = code ? `${prompt}\n\n\`\`\`ts\n${code}\n\`\`\`` : prompt;
      const userMessage = createMessage({ id: createId(), role: 'user', content: userContent, createdAt: timestamp });
      const assistantMessage = createMessage({ id: createId(), role: 'assistant', content: '', createdAt: new Date().toISOString() });

      setMessages((current) => [...current, userMessage, assistantMessage]);
      setStatus('streaming');

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: [...messages, userMessage],
          }),
        });

        if (!response.ok) {
          throw new Error(`Gemini request failed with status ${response.status}`);
        }

        if (!response.body) {
          throw new Error('Gemini returned an empty response body.');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let assistantText = '';

        // eslint-disable-next-line no-constant-condition
        while (true) {
          const { value, done } = await reader.read();
          if (done) {
            break;
          }

          assistantText += decoder.decode(value, { stream: true });

          setMessages((current) =>
            current.map((message) =>
              message.role === 'assistant' && message.id === assistantMessage.id
                ? { ...message, content: assistantText }
                : message
            )
          );
        }

        setMessages((current) =>
          current.map((message) =>
            message.role === 'assistant' && message.id === assistantMessage.id
              ? { ...message, content: assistantText.trim(), createdAt: new Date().toISOString() }
              : message
          )
        );

        setStatus('idle');
      } catch (error) {
        setStatus('error');
        setMessages((current) =>
          current.map((message) =>
            message.role === 'assistant' && message.id === assistantMessage.id
              ? {
                  ...message,
                  content:
                    error instanceof Error
                      ? `Gemini generation failed: ${error.message}`
                      : 'Gemini generation failed unexpectedly.',
                }
              : message
          )
        );
        throw error;
      }
    },
    [messages]
  );

  const streaming = status === 'streaming';

  const conversation = useMemo(() => messages.slice(1), [messages]);

  return (
    <div className="chat-interface">
      <Grid.Container gap={2}>
        <Grid xs={24}>
          <Card shadow>
            <Text h2>Gemini-Powered Prompt Workbench</Text>
            <Text type="secondary">
              Craft prompts, attach optional code context, and stream answers from Google Gemini using the Vercel-style agent architecture.
            </Text>
            <Spacer h={1} />
            <StatusIndicator status={status} />
          </Card>
        </Grid>
        <Grid xs={24} md={14}>
          <MessageList messages={conversation} isStreaming={streaming} />
        </Grid>
        <Grid xs={24} md={10}>
          <Card shadow>
            <Text h3>Prompt Starters</Text>
            <Text type="secondary">
              Select a use case to seed the composer with a strong baseline prompt.
            </Text>
            <Spacer h={0.5} />
            <PromptExamples onSelect={(prompt) => setSelectedPrompt(prompt)} />
          </Card>
        </Grid>
        <Grid xs={24}>
          <MessageComposer isStreaming={streaming} onSubmit={onSubmit} initialPrompt={selectedPrompt} />
        </Grid>
      </Grid.Container>
      <style jsx>{`
        .chat-interface {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
      `}</style>
    </div>
  );
};

export default ChatInterface;
