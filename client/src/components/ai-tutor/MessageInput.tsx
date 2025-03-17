import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import Button from '../common/Button';
import { TutorSettings } from './AITutorInterface';

interface MessageInputProps {
  onSendMessage: (message: string, attachments?: any[]) => void;
  isLoading: boolean;
  disabled?: boolean;
  tutorSettings: TutorSettings;
}

// Container for the message input
const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

// Main input form
const MessageForm = styled.form`
  display: flex;
  gap: 0.75rem;
  width: 100%;
`;

// Textarea for message input
const MessageTextarea = styled.textarea`
  flex: 1;
  min-height: 48px;
  max-height: 120px;
  padding: 0.75rem 1rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.inputBackground};
  color: ${({ theme }) => theme.colors.text.primary};
  font-family: inherit;
  font-size: 1rem;
  resize: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary + '33'};
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    background-color: ${({ theme }) => theme.colors.disabledBackground};
  }
  
  .reduced-motion & {
    transition: none;
  }
`;

// Button group
const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

// Quick suggestions
const SuggestionsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.75rem;
`;

// Suggestion chip
const SuggestionChip = styled.button`
  background-color: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.primary};
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.hover};
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary + '33'};
  }
  
  .reduced-motion & {
    transition: none;
  }
`;

// Label for attachments or accessibility info
const InputLabel = styled.div`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 0.5rem;
`;

// Helper text for character count or suggestions
const HelperText = styled.div`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.text.hint};
  margin-top: 0.5rem;
  text-align: right;
`;

// Attachment preview container
const AttachmentPreviewContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
`;

// Individual attachment preview
const AttachmentPreview = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
`;

// Remove attachment button
const RemoveAttachmentButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text.secondary};
  cursor: pointer;
  padding: 0.25rem;
  font-size: 1rem;
  line-height: 1;
  border-radius: 50%;
  
  &:hover {
    color: ${({ theme }) => theme.colors.error};
    background-color: ${({ theme }) => theme.colors.error + '11'};
  }
`;

// Default suggestions based on context
const getDefaultSuggestions = (currentTopic: string = 'JavaScript Variables'): string[] => {
  return [
    `Explain ${currentTopic} in simple terms`,
    `Show me examples of ${currentTopic}`,
    `What are the common mistakes with ${currentTopic}?`,
    `How can I practice ${currentTopic}?`,
    `Give me a step-by-step guide to ${currentTopic}`
  ];
};

const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  isLoading,
  disabled = false,
  tutorSettings
}) => {
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<any[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Suggestions based on current context
  const [suggestions] = useState<string[]>(getDefaultSuggestions());
  
  // Focus the textarea when the component mounts
  useEffect(() => {
    if (textareaRef.current && !disabled) {
      textareaRef.current.focus();
    }
  }, [disabled]);
  
  // Auto-resize the textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const newHeight = Math.min(textareaRef.current.scrollHeight, 120);
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, [message]);
  
  // Handle enter key to send message
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Check if user pressed Enter without Shift and the message isn't empty
    if (e.key === 'Enter' && !e.shiftKey && message.trim() && !isLoading && !disabled) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (message.trim() || attachments.length > 0) {
      handleSendMessage();
    }
  };
  
  // Send message and clear input
  const handleSendMessage = () => {
    if (isLoading || disabled) return;
    
    onSendMessage(message, attachments.length > 0 ? attachments : undefined);
    setMessage('');
    setAttachments([]);
    
    // Re-focus the textarea after sending
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };
  
  // Add an attachment (this would be expanded in a real application)
  const handleAddAttachment = () => {
    // In a real application, this would open a file picker or code input dialog
    // For demonstration, we'll just add a placeholder code attachment
    
    const newAttachment = {
      type: 'code',
      content: '// Your code here',
      language: 'javascript',
      title: 'My Code'
    };
    
    setAttachments([...attachments, newAttachment]);
  };
  
  // Remove an attachment
  const handleRemoveAttachment = (index: number) => {
    const newAttachments = [...attachments];
    newAttachments.splice(index, 1);
    setAttachments(newAttachments);
  };
  
  // Apply a suggestion to the input
  const handleApplySuggestion = (suggestion: string) => {
    setMessage(suggestion);
    
    // Focus the textarea after applying suggestion
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };
  
  return (
    <InputContainer>
      {/* Attachment previews */}
      {attachments.length > 0 && (
        <>
          <InputLabel>Attachments:</InputLabel>
          <AttachmentPreviewContainer>
            {attachments.map((attachment, index) => (
              <AttachmentPreview key={index}>
                <span>{attachment.title || 'Attachment'}</span>
                <RemoveAttachmentButton 
                  onClick={() => handleRemoveAttachment(index)}
                  aria-label="Remove attachment"
                >
                  ×
                </RemoveAttachmentButton>
              </AttachmentPreview>
            ))}
          </AttachmentPreviewContainer>
        </>
      )}
      
      {/* Main input form */}
      <MessageForm onSubmit={handleSubmit}>
        <MessageTextarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message or question here..."
          disabled={isLoading || disabled}
          aria-label="Message input"
        />
        
        <ButtonGroup>
          <Button
            variant="icon"
            onClick={handleAddAttachment}
            disabled={isLoading || disabled}
            ariaLabel="Add code or file attachment"
            icon="code"
            type="button"
          />
          
          <Button
            variant="primary"
            onClick={handleSendMessage}
            disabled={(!message.trim() && attachments.length === 0) || isLoading || disabled}
            ariaLabel="Send message"
            icon="send"
            type="submit"
          >
            Send
          </Button>
        </ButtonGroup>
      </MessageForm>
      
      {/* Helper text for keyboard shortcut */}
      <HelperText>
        Press Enter to send, Shift+Enter for a new line
      </HelperText>
      
      {/* Quick suggestions */}
      {suggestions.length > 0 && !message && !isLoading && !disabled && (
        <>
          <InputLabel>Try asking:</InputLabel>
          <SuggestionsContainer>
            {suggestions.map((suggestion, index) => (
              <SuggestionChip
                key={index}
                onClick={() => handleApplySuggestion(suggestion)}
                type="button"
              >
                {suggestion}
              </SuggestionChip>
            ))}
          </SuggestionsContainer>
        </>
      )}
    </InputContainer>
  );
};

export default MessageInput; 