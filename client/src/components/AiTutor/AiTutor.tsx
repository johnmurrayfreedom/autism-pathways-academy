import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  Fab,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Tooltip,
  CircularProgress,
  Collapse,
  Button,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Chat as ChatIcon,
  Send as SendIcon,
  Close as CloseIcon,
  Settings as SettingsIcon,
  Psychology as PsychologyIcon,
  AccessibilityNew as AccessibilityIcon,
} from '@mui/icons-material';
import AiTutorService, {
  Message,
  TutorPreferences,
  TutorResponse,
} from '../../services/aiTutor';

interface AiTutorProps {
  courseId?: number;
  lessonId?: number;
  moduleName?: string;
  lessonTitle?: string;
}

export const AiTutor: React.FC<AiTutorProps> = ({
  courseId,
  lessonId,
  moduleName,
  lessonTitle,
}) => {
  const theme = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [preferences, setPreferences] = useState<TutorPreferences>({
    communicationStyle: 'direct',
    responseLength: 'concise',
    useEmoji: true,
    useVisualAids: true,
  });
  const [showPreferences, setShowPreferences] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const userPreferences = await AiTutorService.getPreferences();
        setPreferences(userPreferences);
      } catch (error) {
        console.error('Failed to load tutor preferences:', error);
      }
    };
    loadPreferences();
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await AiTutorService.sendMessage(inputValue, {
        courseId,
        lessonId,
        moduleName,
        lessonTitle,
      });

      const tutorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.message,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, tutorMessage]);

      if (response.suggestions) {
        // Add suggestion chips here if needed
      }
    } catch (error) {
      console.error('Failed to get tutor response:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'I apologize, but I encountered an error. Please try again.',
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const updatePreferences = async (newPreferences: Partial<TutorPreferences>) => {
    try {
      await AiTutorService.updatePreferences(newPreferences);
      setPreferences((prev) => ({ ...prev, ...newPreferences }));
    } catch (error) {
      console.error('Failed to update preferences:', error);
    }
  };

  return (
    <>
      <Tooltip title="Open AI Tutor" placement="left">
        <Fab
          color="primary"
          aria-label="open ai tutor"
          onClick={() => setIsOpen(true)}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: theme.zIndex.drawer - 1,
          }}
        >
          <PsychologyIcon />
        </Fab>
      </Tooltip>

      <Drawer
        anchor="right"
        open={isOpen}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: {
            width: '400px',
            maxWidth: '100%',
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            bgcolor: 'background.default',
          }}
        >
          {/* Header */}
          <Paper
            elevation={2}
            sx={{
              p: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderRadius: 0,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PsychologyIcon color="primary" />
              <Typography variant="h6">AI Tutor</Typography>
            </Box>
            <Box>
              <IconButton
                onClick={() => setShowPreferences(!showPreferences)}
                aria-label="tutor preferences"
              >
                <SettingsIcon />
              </IconButton>
              <IconButton
                onClick={() => setIsOpen(false)}
                aria-label="close tutor"
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </Paper>

          {/* Preferences Panel */}
          <Collapse in={showPreferences}>
            <Paper sx={{ p: 2, borderRadius: 0 }}>
              <Typography variant="subtitle1" gutterBottom>
                Communication Preferences
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button
                  variant={preferences.communicationStyle === 'direct' ? 'contained' : 'outlined'}
                  onClick={() => updatePreferences({ communicationStyle: 'direct' })}
                  startIcon={<AccessibilityIcon />}
                  fullWidth
                >
                  Direct & Clear
                </Button>
                <Button
                  variant={preferences.communicationStyle === 'step-by-step' ? 'contained' : 'outlined'}
                  onClick={() => updatePreferences({ communicationStyle: 'step-by-step' })}
                  startIcon={<AccessibilityIcon />}
                  fullWidth
                >
                  Step by Step
                </Button>
                <Button
                  variant={preferences.responseLength === 'concise' ? 'contained' : 'outlined'}
                  onClick={() => updatePreferences({ responseLength: 'concise' })}
                  startIcon={<AccessibilityIcon />}
                  fullWidth
                >
                  Concise Responses
                </Button>
              </Box>
            </Paper>
          </Collapse>

          {/* Messages */}
          <Box
            sx={{
              flex: 1,
              overflowY: 'auto',
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            {messages.map((message) => (
              <Box
                key={message.id}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: message.role === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <Paper
                  sx={{
                    p: 2,
                    maxWidth: '80%',
                    bgcolor:
                      message.role === 'user'
                        ? alpha(theme.palette.primary.main, 0.1)
                        : alpha(theme.palette.secondary.main, 0.1),
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="body1">{message.content}</Typography>
                </Paper>
                <Typography
                  variant="caption"
                  sx={{ mt: 0.5, color: 'text.secondary' }}
                >
                  {new Date(message.timestamp).toLocaleTimeString()}
                </Typography>
              </Box>
            ))}
            <div ref={messagesEndRef} />
          </Box>

          {/* Input Area */}
          <Paper
            elevation={2}
            sx={{
              p: 2,
              borderRadius: 0,
              borderTop: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                multiline
                maxRows={4}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                disabled={isLoading}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
              <IconButton
                color="primary"
                onClick={handleSendMessage}
                disabled={isLoading || !inputValue.trim()}
                aria-label="send message"
              >
                {isLoading ? <CircularProgress size={24} /> : <SendIcon />}
              </IconButton>
            </Box>
          </Paper>
        </Box>
      </Drawer>
    </>
  );
};

export default AiTutor; 