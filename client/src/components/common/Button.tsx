import React, { forwardRef, ButtonHTMLAttributes } from 'react';
import styled, { css } from 'styled-components';
import { useTheme } from '../../styles/ThemeContext';

// Button variants
export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'danger' | 'success' | 'text';

// Button sizes
export type ButtonSize = 'small' | 'medium' | 'large';

// Extended prop types
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  isFullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  ariaLabel?: string;
  focusIndicatorDisabled?: boolean;
}

// Helper function to get size-specific styles
const getSizeStyles = (size: ButtonSize) => {
  switch (size) {
    case 'small':
      return css`
        padding: 0.25rem 0.75rem;
        font-size: 0.875rem;
      `;
    case 'large':
      return css`
        padding: 0.75rem 1.5rem;
        font-size: 1.125rem;
      `;
    case 'medium':
    default:
      return css`
        padding: 0.5rem 1rem;
        font-size: 1rem;
      `;
  }
};

// Styled button component
const StyledButton = styled.button<{
  variant: ButtonVariant;
  size: ButtonSize;
  isFullWidth: boolean;
  isLoading: boolean;
  focusIndicatorDisabled: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  transition: background-color 0.2s, color 0.2s, border-color 0.2s, box-shadow 0.2s;
  cursor: ${({ isLoading }) => (isLoading ? 'wait' : 'pointer')};
  width: ${({ isFullWidth }) => (isFullWidth ? '100%' : 'auto')};
  border: 2px solid transparent;
  position: relative;
  text-decoration: none;
  line-height: 1.4;
  
  ${({ size }) => getSizeStyles(size)}
  
  // Disable pointer events when loading
  pointer-events: ${({ isLoading }) => (isLoading ? 'none' : 'auto')};
  
  // Variant-specific styles
  ${({ theme, variant }) => {
    switch (variant) {
      case 'primary':
        return css`
          background-color: ${theme.colors.primary};
          color: ${theme.colors.buttonText};
          
          &:hover, &:focus {
            background-color: ${theme.colors.primary}ee;
          }
          
          &:active {
            background-color: ${theme.colors.primary}dd;
          }
        `;
      case 'secondary':
        return css`
          background-color: ${theme.colors.secondary};
          color: ${theme.colors.buttonText};
          
          &:hover, &:focus {
            background-color: ${theme.colors.secondary}ee;
          }
          
          &:active {
            background-color: ${theme.colors.secondary}dd;
          }
        `;
      case 'tertiary':
        return css`
          background-color: transparent;
          color: ${theme.colors.primary};
          border-color: ${theme.colors.primary};
          
          &:hover, &:focus {
            background-color: ${theme.colors.primary}11;
          }
          
          &:active {
            background-color: ${theme.colors.primary}22;
          }
        `;
      case 'danger':
        return css`
          background-color: ${theme.colors.error};
          color: ${theme.colors.buttonText};
          
          &:hover, &:focus {
            background-color: ${theme.colors.error}ee;
          }
          
          &:active {
            background-color: ${theme.colors.error}dd;
          }
        `;
      case 'success':
        return css`
          background-color: ${theme.colors.success};
          color: ${theme.colors.buttonText};
          
          &:hover, &:focus {
            background-color: ${theme.colors.success}ee;
          }
          
          &:active {
            background-color: ${theme.colors.success}dd;
          }
        `;
      case 'text':
        return css`
          background-color: transparent;
          color: ${theme.colors.primary};
          padding-left: 0.5rem;
          padding-right: 0.5rem;
          
          &:hover, &:focus {
            background-color: ${theme.colors.primary}11;
          }
          
          &:active {
            background-color: ${theme.colors.primary}22;
          }
        `;
      default:
        return '';
    }
  }}
  
  // Disabled state
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    pointer-events: none;
  }
  
  // Focus styles
  &:focus {
    outline: ${({ focusIndicatorDisabled, theme }) => 
      focusIndicatorDisabled ? 'none' : `2px solid ${theme.colors.focus}`};
    outline-offset: 2px;
  }
  
  // High contrast focus styles
  .high-contrast &:focus {
    outline: ${({ focusIndicatorDisabled, theme }) => 
      focusIndicatorDisabled ? 'none' : `3px solid ${theme.colors.focus}`};
  }
  
  // Space between icon and text
  & > svg + span,
  & > span + svg {
    margin-left: 0.5rem;
  }
`;

// Loading spinner component
const Spinner = styled.div`
  width: 1em;
  height: 1em;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 0.8s linear infinite;
  margin-right: 0.5rem;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

// Button component with ref forwarding
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'medium',
      isLoading = false,
      isFullWidth = false,
      leftIcon,
      rightIcon,
      children,
      ariaLabel,
      focusIndicatorDisabled = false,
      ...restProps
    },
    ref
  ) => {
    const { reducedMotion } = useTheme();

    return (
      <StyledButton
        ref={ref}
        variant={variant}
        size={size}
        isFullWidth={isFullWidth}
        isLoading={isLoading}
        focusIndicatorDisabled={focusIndicatorDisabled}
        aria-busy={isLoading}
        aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
        {...restProps}
      >
        {isLoading && <Spinner className={reducedMotion ? 'reduced-motion' : ''} />}
        {!isLoading && leftIcon}
        {children && <span>{children}</span>}
        {!isLoading && rightIcon}
      </StyledButton>
    );
  }
);

Button.displayName = 'Button';

export default Button; 