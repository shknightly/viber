'use client';

import { Button, Card, Grid, Spacer, Text, Textarea, Toggle, useToasts } from '@geist-ui/core';
import type { FC, FormEvent } from 'react';
import { useEffect, useState } from 'react';
import CodeEditor from '@viber/codemirror';

export type ComposerPayload = {
  prompt: string;
  code?: string | null;
};

type MessageComposerProps = {
  isStreaming: boolean;
  onSubmit: (payload: ComposerPayload) => Promise<void>;
  initialPrompt: string;
};

export const MessageComposer: FC<MessageComposerProps> = ({ isStreaming, onSubmit, initialPrompt }) => {
  const [, setToast] = useToasts();
  const [prompt, setPrompt] = useState(initialPrompt);
  const [code, setCode] = useState<string>('console.log("Hello from the sandbox!")');
  const [includeCode, setIncludeCode] = useState<boolean>(false);

  useEffect(() => {
    setPrompt(initialPrompt);
  }, [initialPrompt]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!prompt.trim()) {
      setToast({ text: 'Please provide a prompt before submitting.', type: 'warning' });
      return;
    }

    try {
      await onSubmit({ prompt, code: includeCode ? code : null });
    } catch (error) {
      setToast({
        text: error instanceof Error ? error.message : 'Unexpected error while sending prompt.',
        type: 'error',
      });
    }
  };

  return (
    <Card shadow width="100%" role="form" aria-label="Compose a new prompt" as="section">
      <form onSubmit={handleSubmit} className="composer-form">
        <Grid.Container gap={1.5}>
          <Grid xs={24}>
            <Text h3>Prompt</Text>
            <Textarea
              aria-label="Prompt"
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              placeholder="Describe what you would like Gemini to accomplish..."
              minHeight={140}
              disabled={isStreaming}
            />
          </Grid>
          <Grid xs={24}>
            <div className="code-toggle">
              <Toggle checked={includeCode} onChange={(event) => setIncludeCode(event.target.checked)} aria-label="Include code context" />
              <Text small type="secondary">Attach code context</Text>
            </div>
          </Grid>
          {includeCode ? (
            <Grid xs={24}>
              <Text h3>Code Context</Text>
              <CodeEditor ariaLabel="Code context" value={code} onChange={setCode} />
            </Grid>
          ) : null}
          <Grid xs={24}>
            <Spacer h={0.5} />
            <Button type="secondary" htmlType="submit" loading={isStreaming} disabled={isStreaming} aria-disabled={isStreaming}>
              {isStreaming ? 'Generating…' : 'Send to Gemini'}
            </Button>
          </Grid>
        </Grid.Container>
      </form>
      <style jsx>{`
        .composer-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .code-toggle {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
      `}</style>
    </Card>
  );
};

export default MessageComposer;
