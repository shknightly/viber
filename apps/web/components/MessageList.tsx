'use client';

import { Avatar, Card, Grid, Spacer, Text } from '@geist-ui/core';
import classNames from 'classnames';
import type { FC } from 'react';
import type { ChatMessage } from '@viber/types';
import { formatTimestamp } from '../lib/dates';

type MessageListProps = {
  messages: ChatMessage[];
  isStreaming: boolean;
};

const roleToColor: Record<ChatMessage['role'], string> = {
  user: 'var(--geist-success)',
  assistant: 'var(--geist-foreground)',
  system: 'var(--geist-warning)',
};

const roleToInitial: Record<ChatMessage['role'], string> = {
  user: 'U',
  assistant: 'A',
  system: 'S',
};

export const MessageList: FC<MessageListProps> = ({ messages, isStreaming }) => (
  <div className="message-list" aria-live="polite">
    <Grid.Container gap={1.5}>
      {messages.map((message) => (
        <Grid xs={24} key={message.id}>
          <Card shadow width="100%" className={classNames('message-card', `message-${message.role}`)}>
            <div className="message-header">
              <div className="message-identification">
                <Avatar text={roleToInitial[message.role]} style={{ backgroundColor: roleToColor[message.role] }} />
                <div>
                  <Text h4 margin={0} className="message-role">
                    {message.role === 'assistant' ? 'Gemini Assistant' : message.role === 'user' ? 'You' : 'System'}
                  </Text>
                  <Text small type="secondary" aria-label={`Sent ${formatTimestamp(message.createdAt)}`}>
                    {formatTimestamp(message.createdAt)}
                  </Text>
                </div>
              </div>
            </div>
            <Spacer h={0.5} />
            <Text className="message-content">{message.content}</Text>
            {message.role === 'assistant' && isStreaming && message.id === messages[messages.length - 1].id ? (
              <Text small type="secondary" aria-live="polite">
                Streaming response…
              </Text>
            ) : null}
          </Card>
        </Grid>
      ))}
    </Grid.Container>
    <style jsx>{`
      .message-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .message-card {
        border: 1px solid var(--geist-border);
        background: var(--geist-background);
      }

      .message-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .message-identification {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }

      .message-content {
        white-space: pre-wrap;
      }
    `}</style>
  </div>
);

export default MessageList;
