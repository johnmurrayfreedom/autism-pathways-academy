import React from 'react';
import styled from 'styled-components';
import { TutorMessage, TutorSettings } from './AITutorInterface';
import LoadingIndicator from '../common/LoadingIndicator';
import CodeBlock from '../common/CodeBlock';

interface ChatWindowProps {
  messages: TutorMessage[];
  isLoading: boolean;
  tutorSettings: TutorSettings;
  chatEndRef: React.RefObject<HTMLDivElement>;
}

// Container for the chat window
const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  background-color: ${({ theme }) => theme.colors.background};
  scrollbar-width: thin;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.background};
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.colors.border};
    border-radius: 4px;
  }
`;

// Message group - consecutive messages from same sender
const MessageGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1.5rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

// Message sender indicator
const MessageSender = styled.div`
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

// Avatar for the sender
const SenderAvatar = styled.div<{ role: 'user' | 'assistant' | 'system' }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme, role }) => 
    role === 'user' 
      ? theme.colors.secondary + '22' 
      : role === 'assistant' 
        ? theme.colors.primary + '22'
        : theme.colors.border};
  color: ${({ theme, role }) => 
    role === 'user' 
      ? theme.colors.secondary 
      : role === 'assistant' 
        ? theme.colors.primary
        : theme.colors.text.secondary};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  font-size: 1rem;
`;

// Message bubble
const MessageBubble = styled.div<{ role: 'user' | 'assistant' | 'system' }>`
  padding: 0.75rem 1rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  max-width: 90%;
  width: fit-content;
  background-color: ${({ theme, role }) => 
    role === 'user' 
      ? theme.colors.secondary + '11' 
      : role === 'assistant' 
        ? theme.colors.surface
        : theme.colors.border + '33'};
  border: 1px solid ${({ theme, role }) => 
    role === 'user' 
      ? theme.colors.secondary + '22' 
      : role === 'assistant' 
        ? theme.colors.border
        : theme.colors.border + '66'};
  margin-bottom: 0.5rem;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.text.primary};
  
  &:last-child {
    margin-bottom: 0;
  }
  
  @media (prefers-reduced-motion: no-preference) {
    animation: fadeIn 0.3s ease-out;
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

// Message content with proper formatting for code and markdown
const MessageContent = styled.div`
  white-space: pre-wrap;
  word-break: break-word;
  
  p {
    margin: 0.5rem 0;
    
    &:first-child {
      margin-top: 0;
    }
    
    &:last-child {
      margin-bottom: 0;
    }
  }
  
  code {
    font-family: 'Fira Code', monospace;
    background-color: ${({ theme }) => theme.colors.codeBackground};
    padding: 0.1rem 0.3rem;
    border-radius: ${({ theme }) => theme.borderRadius.sm};
    font-size: 0.9em;
  }
  
  ul, ol {
    margin: 0.5rem 0;
    padding-left: 1.5rem;
    
    li {
      margin: 0.25rem 0;
    }
  }
`;

// Timestamp display
const MessageTimestamp = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.hint};
  margin-top: 0.25rem;
  align-self: flex-end;
`;

// System message styling
const SystemMessage = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text.secondary};
  padding: 0.75rem 1rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px dashed ${({ theme }) => theme.colors.border};
  margin: 1rem 0;
  font-size: 0.95rem;
  text-align: center;
`;

// Loading indicator container
const LoadingContainer = styled.div`
  display: flex;
  padding: 1rem;
  justify-content: center;
`;

// Attachments container
const AttachmentsContainer = styled.div`
  margin-top: 0.75rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  padding-top: 0.75rem;
`;

// Individual attachment
const Attachment = styled.div`
  margin-bottom: 0.75rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

// Attachment title
const AttachmentTitle = styled.div`
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

// Next steps container
const NextStepsContainer = styled.div`
  margin-top: 1rem;
  padding-top: 0.75rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

// Next steps title
const NextStepsTitle = styled.div`
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 0.9rem;
`;

// Next step item
const NextStepItem = styled.a`
  display: flex;
  padding: 0.5rem 0.75rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  margin-bottom: 0.5rem;
  text-decoration: none;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 0.95rem;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.hover};
    text-decoration: none;
  }
  
  &:last-child {
    margin-bottom: 0;
  }
  
  .reduced-motion & {
    transition: none;
  }
`;

// NextStep icon
const NextStepIcon = styled.span`
  margin-right: 0.75rem;
  color: ${({ theme }) => theme.colors.primary};
`;

// Format timestamp
const formatMessageTime = (date: Date) => {
  return date.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Function to format code blocks in content
const formatMessageContent = (content: string) => {
  // Very basic markdown-like formatting for demonstration
  // In a real implementation, use a proper markdown parser
  const formattedContent = content
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\n/g, '<br />');
  
  return formattedContent;
};

// Get icon for next step type
const getNextStepIcon = (type: string) => {
  switch (type) {
    case 'practice':
      return '👨‍💻';
    case 'related-concepts':
      return '🔄';
    case 'assessment':
      return '📝';
    case 'review':
      return '📚';
    case 'apply':
      return '🚀';
    default:
      return '▶️';
  }
};

// Get sender display name
const getSenderName = (role: 'user' | 'assistant' | 'system') => {
  switch (role) {
    case 'user':
      return 'You';
    case 'assistant':
      return 'AI Learning Assistant';
    case 'system':
      return 'System';
    default:
      return 'Unknown';
  }
};

// Get sender avatar text
const getAvatarText = (role: 'user' | 'assistant' | 'system') => {
  switch (role) {
    case 'user':
      return 'Y';
    case 'assistant':
      return 'AI';
    case 'system':
      return 'S';
    default:
      return '?';
  }
};

const ChatWindow: React.FC<ChatWindowProps> = ({ 
  messages, 
  isLoading, 
  tutorSettings,
  chatEndRef
}) => {
  return (
    <ChatContainer>
      {/* Welcome message - typically shown when chat is empty */}
      {messages.length === 0 && (
        <SystemMessage>
          Welcome to the AI Tutor! Ask a question to start learning.
        </SystemMessage>
      )}
      
      {/* Display messages */}
      {messages.map((message, index) => (
        <MessageGroup key={message.id}>
          <MessageSender>
            <SenderAvatar role={message.role}>
              {getAvatarText(message.role)}
            </SenderAvatar>
            <span>{getSenderName(message.role)}</span>
          </MessageSender>
          
          <div>
            <MessageBubble role={message.role}>
              {/* Main message content */}
              <MessageContent
                dangerouslySetInnerHTML={{ __html: formatMessageContent(message.content) }}
              />
              
              {/* Display message attachments */}
              {message.attachments && message.attachments.length > 0 && (
                <AttachmentsContainer>
                  {message.attachments.map((attachment, i) => (
                    <Attachment key={`${message.id}-attachment-${i}`}>
                      {attachment.title && (
                        <AttachmentTitle>{attachment.title}</AttachmentTitle>
                      )}
                      
                      {attachment.type === 'code' && (
                        <CodeBlock
                          code={attachment.content}
                          language={attachment.language || 'javascript'}
                        />
                      )}
                      
                      {attachment.type === 'image' && (
                        <img 
                          src={attachment.content} 
                          alt={attachment.title || 'Attached image'} 
                          style={{ maxWidth: '100%', borderRadius: '4px' }}
                        />
                      )}
                      
                      {attachment.type === 'link' && (
                        <a 
                          href={attachment.content}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {attachment.title || attachment.content}
                        </a>
                      )}
                    </Attachment>
                  ))}
                </AttachmentsContainer>
              )}
              
              {/* Display next steps */}
              {message.nextSteps && message.nextSteps.length > 0 && tutorSettings.showNextSteps && (
                <NextStepsContainer>
                  <NextStepsTitle>Next Steps:</NextStepsTitle>
                  
                  {message.nextSteps.map((step, i) => (
                    <NextStepItem 
                      key={`${message.id}-nextstep-${i}`}
                      href={step.actionUrl || '#'}
                    >
                      <NextStepIcon>{getNextStepIcon(step.type)}</NextStepIcon>
                      {step.description}
                    </NextStepItem>
                  ))}
                </NextStepsContainer>
              )}
            </MessageBubble>
            
            {/* Timestamp */}
            <MessageTimestamp>
              {formatMessageTime(message.timestamp)}
            </MessageTimestamp>
          </div>
        </MessageGroup>
      ))}
      
      {/* Loading indicator for when AI is "thinking" */}
      {isLoading && (
        <LoadingContainer>
          <LoadingIndicator size="small" label="AI Assistant is thinking..." />
        </LoadingContainer>
      )}
      
      {/* Invisible div for scrolling to bottom of chat */}
      <div ref={chatEndRef} />
    </ChatContainer>
  );
};

export default ChatWindow; 