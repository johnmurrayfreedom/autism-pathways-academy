import React, { useState, useEffect, useRef } from 'react';
import styled, { useTheme } from 'styled-components';
import { useAppSelector, useAppDispatch } from '../../store';
import { selectUser } from '../../store/slices/authSlice';
import { selectUserPreferences } from '../../store/slices/userSlice';
import { addAlert } from '../../store/slices/uiSlice';
import Button from '../common/Button';
import ChatWindow from './ChatWindow';
import MessageInput from './MessageInput';
import TutorSettingsPanel from './TutorSettingsPanel';
import CodeExplainPanel from './CodeExplainPanel';
import VisualSupportPanel from './VisualSupportPanel';
import LoadingIndicator from '../common/LoadingIndicator';

// Types for AI Tutor interaction
export type InteractionStyle = 'direct' | 'conceptual' | 'example-based' | 'step-by-step';
export type VisualSupport = 'minimal' | 'moderate' | 'extensive';
export type PacePreference = 'concise' | 'balanced' | 'detailed';
export type NextStepsType = 'practice' | 'related-concepts' | 'assessment' | 'review' | 'apply';

export interface TutorSettings {
  interactionStyle: InteractionStyle;
  visualSupport: VisualSupport;
  pacePreference: PacePreference;
  codeSupport: boolean;
  showNextSteps: boolean;
  preferredNextSteps: NextStepsType[];
  useSimpleLanguage: boolean;
}

export interface TutorMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  isProcessing?: boolean;
  attachments?: {
    type: 'code' | 'image' | 'link' | 'file';
    content: string;
    language?: string;
    title?: string;
  }[];
  nextSteps?: {
    type: NextStepsType;
    description: string;
    actionUrl?: string;
  }[];
  metadata?: {
    courseId?: string;
    lessonId?: string;
    conceptId?: string;
    relatedConcepts?: string[];
  };
}

export interface TutorContext {
  courseId?: string;
  lessonId?: string;
  currentTopic?: string;
  userProgress?: {
    completedLessons: string[];
    strugglingConcepts: string[];
    strengths: string[];
  };
  learningStyle?: {
    informationProcessing: string;
    pacePreference: string;
    contentPreference: string;
    problemSolvingApproach: string;
    focusCapacity: string;
  };
}

// Main container
const TutorContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: calc(100vh - 64px);
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

// Header with title and settings toggle
const TutorHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  background-color: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

// Title with status indicator
const TutorTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const TutorName = styled.h2`
  font-size: 1.25rem;
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  margin: 0;
`;

const StatusIndicator = styled.div<{ isActive: boolean }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${({ isActive, theme }) => 
    isActive ? theme.colors.success : theme.colors.text.hint};
`;

// Controls container
const TutorControls = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: center;
`;

// Main content area - flexible to accommodate different panels
const TutorContent = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
  position: relative;
`;

// Primary column (chat)
const PrimaryColumn = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

// Secondary column (settings, code explain, etc.)
const SecondaryColumn = styled.div<{ isOpen: boolean }>`
  width: ${({ isOpen }) => (isOpen ? '320px' : '0')};
  border-left: ${({ isOpen, theme }) => 
    isOpen ? `1px solid ${theme.colors.border}` : 'none'};
  overflow: hidden;
  transition: width 0.3s ease-out;
  
  .reduced-motion & {
    transition: none;
  }
`;

// Input container at the bottom
const InputContainer = styled.div`
  padding: 1rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.surface};
`;

// Context panel showing current course/lesson
const ContextPanel = styled.div`
  padding: 0.75rem 1rem;
  background-color: ${({ theme }) => theme.colors.background};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ContextInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ContextDivider = styled.span`
  margin: 0 0.25rem;
`;

const AITutorInterface: React.FC = () => {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const user = useAppSelector(selectUser);
  const preferences = useAppSelector(selectUserPreferences);
  
  const [isConnected, setIsConnected] = useState(true);
  const [messages, setMessages] = useState<TutorMessage[]>([]);
  const [isSettingsPanelOpen, setIsSettingsPanelOpen] = useState(false);
  const [isCodePanelOpen, setIsCodePanelOpen] = useState(false);
  const [isVisualPanelOpen, setIsVisualPanelOpen] = useState(false);
  const [activeSecondaryPanel, setActiveSecondaryPanel] = useState<'settings' | 'code' | 'visual' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Default tutor settings based on user preferences
  const [tutorSettings, setTutorSettings] = useState<TutorSettings>({
    interactionStyle: 'direct',
    visualSupport: 'moderate',
    pacePreference: 'balanced',
    codeSupport: true,
    showNextSteps: true,
    preferredNextSteps: ['practice', 'related-concepts'],
    useSimpleLanguage: false
  });
  
  // Example context - this would be populated from the current course/lesson
  const [tutorContext, setTutorContext] = useState<TutorContext>({
    courseId: 'course-123',
    lessonId: 'lesson-456',
    currentTopic: 'Introduction to JavaScript Variables',
    userProgress: {
      completedLessons: ['lesson-123', 'lesson-234', 'lesson-345'],
      strugglingConcepts: ['closures', 'promises'],
      strengths: ['syntax', 'loops', 'conditionals']
    }
  });
  
  // Ref for scrolling to bottom
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  // Load initial messages and settings
  useEffect(() => {
    // This would be fetched from an API in a real implementation
    const initialSystemMessage: TutorMessage = {
      id: 'system-welcome',
      role: 'system',
      content: 'Welcome to your AI Tutor! I\'m here to help with your learning journey. You can ask me questions about the current topic, request explanations, or get help with exercises.',
      timestamp: new Date(),
      nextSteps: [
        { 
          type: 'related-concepts', 
          description: 'Explore the fundamentals of JavaScript', 
          actionUrl: '/courses/js-fundamentals'
        },
        {
          type: 'practice',
          description: 'Try a coding exercise on variables',
          actionUrl: '/exercises/js-variables'
        }
      ]
    };
    
    setMessages([initialSystemMessage]);
    
    // Load user preferences
    if (preferences) {
      // Map user learning style to tutor settings
      const learningStyle = preferences.assessmentData?.learningStyleResults?.results;
      if (learningStyle) {
        setTutorSettings(prev => ({
          ...prev,
          interactionStyle: learningStyle.informationProcessing === 'visual' ? 'conceptual' :
                          learningStyle.informationProcessing === 'kinesthetic' ? 'example-based' : 
                          learningStyle.problemSolvingApproach === 'systematic' ? 'step-by-step' : 'direct',
          pacePreference: learningStyle.contentPreference === 'comprehensive' ? 'detailed' : 
                        learningStyle.contentPreference === 'concise' ? 'concise' : 'balanced',
          visualSupport: learningStyle.informationProcessing === 'visual' ? 'extensive' : 'moderate',
        }));
      }
      
      // Also set context for learning style
      if (learningStyle) {
        setTutorContext(prev => ({
          ...prev,
          learningStyle: {
            informationProcessing: learningStyle.informationProcessing,
            pacePreference: learningStyle.pacePreference,
            contentPreference: learningStyle.contentPreference,
            problemSolvingApproach: learningStyle.problemSolvingApproach,
            focusCapacity: learningStyle.focusCapacity
          }
        }));
      }
    }
    
    // Simulated connection to the AI service
    const connectionTimeout = setTimeout(() => {
      setIsConnected(true);
    }, 1000);
    
    return () => {
      clearTimeout(connectionTimeout);
    };
  }, [preferences]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: preferences?.preferencesData?.reducedMotion ? 'auto' : 'smooth' });
    }
  }, [messages, preferences]);
  
  // Toggle secondary panels (settings, code, visual)
  const togglePanel = (panel: 'settings' | 'code' | 'visual') => {
    if (activeSecondaryPanel === panel) {
      setActiveSecondaryPanel(null);
      setIsSettingsPanelOpen(false);
      setIsCodePanelOpen(false);
      setIsVisualPanelOpen(false);
    } else {
      setActiveSecondaryPanel(panel);
      setIsSettingsPanelOpen(panel === 'settings');
      setIsCodePanelOpen(panel === 'code');
      setIsVisualPanelOpen(panel === 'visual');
    }
  };
  
  // Handle sending a message
  const handleSendMessage = async (content: string, attachments?: any[]) => {
    if (!content.trim() && (!attachments || attachments.length === 0)) return;
    
    // Create the user message
    const userMessage: TutorMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date(),
      attachments
    };
    
    // Add user message to list
    setMessages(prev => [...prev, userMessage]);
    
    // Show loading state
    setIsLoading(true);
    
    try {
      // This would be a real API call in production
      // Simulating API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Example response based on tutor settings
      let responseContent = '';
      
      // Adjust response based on interaction style
      switch (tutorSettings.interactionStyle) {
        case 'direct':
          responseContent = `Here's a direct explanation: Variables in JavaScript are containers for storing data values. You declare them using \`var\`, \`let\`, or \`const\`.`;
          break;
        case 'conceptual':
          responseContent = `Think of variables as labeled boxes where you can store things. Each box (variable) has a name, and you can put different items (values) inside. In JavaScript, you create these boxes using \`let\`, \`const\`, or \`var\`.`;
          break;
        case 'example-based':
          responseContent = `Let me show you through examples:\n\n\`\`\`javascript\n// Creating a variable with let\nlet score = 10;\n\n// Creating a constant\nconst playerName = "Alex";\n\n// Changing a variable's value\nscore = score + 5; // score is now 15\n\`\`\``;
          break;
        case 'step-by-step':
          responseContent = `Let's break down JavaScript variables step by step:\n\n1. Variables are used to store data in memory\n2. To create a variable, use one of three keywords: \`var\`, \`let\`, or \`const\`\n3. The \`let\` keyword creates a variable that can be reassigned\n4. The \`const\` keyword creates a constant that cannot be reassigned\n5. Variables have a name (identifier) that follows certain rules`;
          break;
      }
      
      // Add next steps based on preferences
      const nextSteps = tutorSettings.showNextSteps ? [
        { 
          type: 'practice' as NextStepsType, 
          description: 'Practice creating variables in the code playground',
          actionUrl: '/playground/js-variables'
        },
        {
          type: 'related-concepts' as NextStepsType,
          description: 'Learn about data types in JavaScript',
          actionUrl: '/courses/js-fundamentals/data-types'
        }
      ] : undefined;
      
      // Create AI response message
      const aiResponse: TutorMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: responseContent,
        timestamp: new Date(),
        nextSteps,
        // Example attachment for code or visual based on settings
        attachments: tutorSettings.codeSupport ? [
          {
            type: 'code',
            content: 'let message = "Hello";\nconsole.log(message);',
            language: 'javascript',
            title: 'Simple Variable Example'
          }
        ] : undefined
      };
      
      // Add AI response to messages
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error sending message:', error);
      dispatch(addAlert({
        type: 'error',
        message: 'Failed to get a response from the AI Tutor. Please try again.',
      }));
    } finally {
      setIsLoading(false);
    }
  };
  
  // Update tutor settings
  const handleUpdateSettings = (newSettings: Partial<TutorSettings>) => {
    setTutorSettings(prev => ({
      ...prev,
      ...newSettings
    }));
  };
  
  // Clear conversation history
  const handleClearConversation = () => {
    // Confirm before clearing
    if (window.confirm('Are you sure you want to clear the conversation history?')) {
      // Keep only the initial system message
      const initialSystemMessage = messages.find(msg => msg.role === 'system' && msg.id === 'system-welcome');
      setMessages(initialSystemMessage ? [initialSystemMessage] : []);
    }
  };
  
  return (
    <TutorContainer>
      <TutorHeader>
        <TutorTitle>
          <StatusIndicator isActive={isConnected} aria-hidden="true" />
          <TutorName>AI Learning Assistant</TutorName>
          {!isConnected && <span>(Connecting...)</span>}
        </TutorTitle>
        
        <TutorControls>
          <Button
            variant="icon"
            onClick={() => togglePanel('visual')}
            ariaLabel="Toggle visual support panel"
            isActive={isVisualPanelOpen}
            icon="image"
          >
            Visual Support
          </Button>
          
          <Button
            variant="icon"
            onClick={() => togglePanel('code')}
            ariaLabel="Toggle code explanation panel"
            isActive={isCodePanelOpen}
            icon="code"
          >
            Code Support
          </Button>
          
          <Button
            variant="icon"
            onClick={() => togglePanel('settings')}
            ariaLabel="Toggle AI tutor settings"
            isActive={isSettingsPanelOpen}
            icon="settings"
          >
            Tutor Settings
          </Button>
          
          <Button
            variant="icon"
            onClick={handleClearConversation}
            ariaLabel="Clear conversation history"
            icon="delete"
          >
            Clear Chat
          </Button>
        </TutorControls>
      </TutorHeader>
      
      <ContextPanel>
        <ContextInfo>
          <span>Current Topic:</span>
          <strong>{tutorContext.currentTopic}</strong>
          {tutorContext.courseId && tutorContext.lessonId && (
            <>
              <ContextDivider>•</ContextDivider>
              <a href={`/courses/${tutorContext.courseId}/lessons/${tutorContext.lessonId}`}>
                Return to Lesson
              </a>
            </>
          )}
        </ContextInfo>
        
        <div>
          <Button
            variant="text"
            size="small"
            ariaLabel="View learning history"
            href="/learning-history"
          >
            View Learning History
          </Button>
        </div>
      </ContextPanel>
      
      <TutorContent>
        <PrimaryColumn>
          <ChatWindow 
            messages={messages} 
            isLoading={isLoading}
            tutorSettings={tutorSettings}
            chatEndRef={chatEndRef}
          />
          
          <InputContainer>
            <MessageInput 
              onSendMessage={handleSendMessage} 
              isLoading={isLoading}
              disabled={!isConnected}
              tutorSettings={tutorSettings}
            />
          </InputContainer>
        </PrimaryColumn>
        
        <SecondaryColumn isOpen={activeSecondaryPanel !== null}>
          {isSettingsPanelOpen && (
            <TutorSettingsPanel
              settings={tutorSettings}
              onUpdateSettings={handleUpdateSettings}
            />
          )}
          
          {isCodePanelOpen && (
            <CodeExplainPanel
              messages={messages}
            />
          )}
          
          {isVisualPanelOpen && (
            <VisualSupportPanel
              currentTopic={tutorContext.currentTopic || ''}
            />
          )}
        </SecondaryColumn>
      </TutorContent>
    </TutorContainer>
  );
};

export default AITutorInterface; 