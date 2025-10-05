'use client';

import { Dot, Text } from '@geist-ui/core';
import type { FC } from 'react';

const colors = {
  idle: 'secondary' as const,
  streaming: 'success' as const,
  error: 'error' as const,
};

type Status = keyof typeof colors;

type StatusIndicatorProps = {
  status: Status;
};

export const StatusIndicator: FC<StatusIndicatorProps> = ({ status }) => (
  <div className="status-indicator" role="status" aria-live="polite">
    <Dot type={colors[status]} />
    <Text small type="secondary">
      {status === 'streaming' ? 'Gemini is generating a response' : status === 'error' ? 'Generation failed' : 'Awaiting prompt'}
    </Text>
    <style jsx>{`
      .status-indicator {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
    `}</style>
  </div>
);

export default StatusIndicator;
