import React from 'react';
import styled, { keyframes } from 'styled-components';
import { useTheme } from '../../styles/ThemeContext';

interface LoadingScreenProps {
  message?: string;
  fullScreen?: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = 'Loading content...',
  fullScreen = true
}) => {
  const { reduceMotion } = useTheme();

  return (
    <LoadingContainer 
      fullScreen={fullScreen}
      aria-busy="true"
      aria-live="polite"
    >
      <LoadingIndicator reduceMotion={reduceMotion}>
        <LoadingCircle delay={0} />
        <LoadingCircle delay={0.2} />
        <LoadingCircle delay={0.4} />
      </LoadingIndicator>
      <LoadingMessage>{message}</LoadingMessage>
      {/* Hidden text for screen readers for more descriptive status */}
      <ScreenReaderText>
        Please wait while the content is loading. This may take a few moments.
      </ScreenReaderText>
    </LoadingContainer>
  );
};

// Styled components
interface LoadingContainerProps {
  fullScreen: boolean;
}

const LoadingContainer = styled.div<LoadingContainerProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${props => props.theme.spacing.spaceLg}px;
  ${props => props.fullScreen && `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1000;
    background-color: ${props.theme.colors.background};
  `}
`;

const pulseAnimation = keyframes`
  0% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.2);
    opacity: 1;
  }
  100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
`;

const staticPulse = keyframes`
  0% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.6;
  }
`;

interface LoadingIndicatorProps {
  reduceMotion: boolean;
}

const LoadingIndicator = styled.div<LoadingIndicatorProps>`
  display: flex;
  gap: ${props => props.theme.spacing.spaceSm}px;
  margin-bottom: ${props => props.theme.spacing.spaceMd}px;
  
  /* Use reduced motion animation if user prefers */
  animation: ${props => props.reduceMotion ? staticPulse : 'none'} 2s ease-in-out infinite;
`;

interface LoadingCircleProps {
  delay: number;
}

const LoadingCircle = styled.div<LoadingCircleProps>`
  width: 16px;
  height: 16px;
  background-color: ${props => props.theme.colors.primary};
  border-radius: 50%;
  animation: ${pulseAnimation} 1.5s ease-in-out infinite;
  animation-delay: ${props => props.delay}s;
`;

const LoadingMessage = styled.p`
  font-size: ${props => props.theme.typography.fontSizeMd}px;
  color: ${props => props.theme.colors.textPrimary};
  margin: 0;
  text-align: center;
`;

const ScreenReaderText = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

export default LoadingScreen; 