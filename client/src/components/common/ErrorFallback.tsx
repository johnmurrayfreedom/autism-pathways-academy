import React from 'react';
import styled from 'styled-components';
import { FallbackProps } from 'react-error-boundary';
import { Button } from './Button';

const ErrorFallback: React.FC<FallbackProps> = ({ 
  error, 
  resetErrorBoundary 
}) => {
  const handleReportIssue = () => {
    // Open form to report issue or send error to monitoring service
    const subject = encodeURIComponent('Error Report: AI Tutor LMS');
    const body = encodeURIComponent(`
      Error message: ${error.message}
      Stack trace: ${error.stack}
      
      Please describe what you were doing when the error occurred:
      
    `);
    window.open(`mailto:support@ai-tutor-lms.example.com?subject=${subject}&body=${body}`);
  };

  return (
    <ErrorContainer role="alert">
      <ErrorIcon>
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" 
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </ErrorIcon>
      
      <ErrorTitle>Something went wrong</ErrorTitle>
      
      <ErrorDescription>
        {error.message || "We're sorry, but an unexpected error has occurred. The team has been notified."}
      </ErrorDescription>
      
      <ErrorStack>
        <details>
          <summary>Technical details</summary>
          <pre>{error.stack}</pre>
        </details>
      </ErrorStack>
      
      <ActionContainer>
        <Button 
          onClick={resetErrorBoundary} 
          variant="primary"
        >
          Try again
        </Button>
        
        <Button 
          onClick={handleReportIssue} 
          variant="secondary"
        >
          Report this issue
        </Button>
      </ActionContainer>
      
      <TroubleshootingTips>
        <h3>Troubleshooting tips:</h3>
        <ul>
          <li>Refresh your browser window</li>
          <li>Clear your browser cache and cookies</li>
          <li>Check your internet connection</li>
          <li>If you keep seeing this error, please contact support</li>
        </ul>
      </TroubleshootingTips>
    </ErrorContainer>
  );
};

// Styled components
const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: ${props => props.theme.spacing.spaceLg}px;
  background-color: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.textPrimary};
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
`;

const ErrorIcon = styled.div`
  color: ${props => props.theme.colors.error};
  margin-bottom: ${props => props.theme.spacing.spaceMd}px;
  
  svg {
    width: 64px;
    height: 64px;
  }
`;

const ErrorTitle = styled.h1`
  font-size: ${props => props.theme.typography.fontSizeXl}px;
  margin-bottom: ${props => props.theme.spacing.spaceMd}px;
  color: ${props => props.theme.colors.textPrimary};
`;

const ErrorDescription = styled.p`
  font-size: ${props => props.theme.typography.fontSizeLg}px;
  margin-bottom: ${props => props.theme.spacing.spaceLg}px;
  color: ${props => props.theme.colors.textSecondary};
  max-width: 600px;
`;

const ErrorStack = styled.div`
  width: 100%;
  margin-bottom: ${props => props.theme.spacing.spaceLg}px;
  
  summary {
    cursor: pointer;
    color: ${props => props.theme.colors.textSecondary};
    font-size: ${props => props.theme.typography.fontSizeSm}px;
    margin-bottom: ${props => props.theme.spacing.spaceSm}px;
    
    &:focus {
      outline: 2px solid ${props => props.theme.colors.borderFocus};
      outline-offset: 2px;
    }
  }
  
  pre {
    background-color: ${props => props.theme.colors.surface};
    padding: ${props => props.theme.spacing.spaceMd}px;
    border-radius: ${props => props.theme.borders.borderRadius}px;
    border: 1px solid ${props => props.theme.colors.border};
    overflow-x: auto;
    text-align: left;
    font-size: ${props => props.theme.typography.fontSizeSm}px;
    max-height: 200px;
    color: ${props => props.theme.colors.textPrimary};
  }
`;

const ActionContainer = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.spaceMd}px;
  margin-bottom: ${props => props.theme.spacing.spaceLg}px;
  
  @media (max-width: 600px) {
    flex-direction: column;
    width: 100%;
    max-width: 300px;
  }
`;

const TroubleshootingTips = styled.div`
  text-align: left;
  padding: ${props => props.theme.spacing.spaceMd}px;
  background-color: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borders.borderRadius}px;
  border: 1px solid ${props => props.theme.colors.border};
  width: 100%;
  max-width: 600px;
  
  h3 {
    font-size: ${props => props.theme.typography.fontSizeMd}px;
    margin-bottom: ${props => props.theme.spacing.spaceSm}px;
    color: ${props => props.theme.colors.textPrimary};
  }
  
  ul {
    padding-left: ${props => props.theme.spacing.spaceLg}px;
    margin-bottom: 0;
  }
  
  li {
    margin-bottom: ${props => props.theme.spacing.spaceXs}px;
    color: ${props => props.theme.colors.textSecondary};
  }
`;

export default ErrorFallback; 