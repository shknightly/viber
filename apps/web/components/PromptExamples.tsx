'use client';

import { Card, Grid, Text } from '@geist-ui/core';
import type { FC, KeyboardEvent } from 'react';

const examples = [
  {
    title: 'API Architecture Review',
    description: 'Ask Gemini to critique an API surface for latency, error handling, and monitoring coverage.',
    prompt:
      'Review the following REST API design for a payments microservice. Identify performance bottlenecks, missing monitoring hooks, and propose schema improvements.',
  },
  {
    title: 'Prompt Engineering Audit',
    description: 'Request structured feedback on an existing prompt with two improvement strategies.',
    prompt:
      'Evaluate this prompt for a customer-support triage agent. Explain two failure modes and suggest prompt rewrites that mitigate hallucinations.',
  },
  {
    title: 'Code Explanation',
    description: 'Summarize imported code, identify risks, and provide two refactoring options.',
    prompt:
      'Given the TypeScript function below, describe what it does, list potential edge cases, and outline two refactoring strategies that reduce cognitive complexity.',
  },
];

const PromptExamples: FC<{ onSelect: (prompt: string) => void }> = ({ onSelect }) => {
  const handleKey = (event: KeyboardEvent<HTMLDivElement>, prompt: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSelect(prompt);
    }
  };

  return (
    <Grid.Container gap={1.5}>
      {examples.map((example) => (
        <Grid xs={24} md={8} key={example.title}>
          <Card
            hoverable
            onClick={() => onSelect(example.prompt)}
            onKeyDown={(event) => handleKey(event, example.prompt)}
            role="button"
            tabIndex={0}
            aria-pressed="false"
          >
            <Text h4>{example.title}</Text>
            <Text type="secondary">{example.description}</Text>
          </Card>
        </Grid>
      ))}
    </Grid.Container>
  );
};

export default PromptExamples;
