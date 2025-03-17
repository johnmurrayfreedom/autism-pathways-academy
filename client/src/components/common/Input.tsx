import React, { forwardRef, InputHTMLAttributes, useState, useRef } from 'react';
import styled, { css } from 'styled-components';
import { useTheme } from '../../styles/ThemeContext';

// Input sizes
export type InputSize = 'small' | 'medium' | 'large';

// Input variants
export type InputVariant = 'outline' | 'filled' | 'flushed';

// Extended props
export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label: string;
  helperText?: string;
  errorMessage?: string;
  isInvalid?: boolean;
  isRequired?: boolean;
  size?: InputSize;
  variant?: InputVariant;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  hideLabel?: boolean;
  fullWidth?: boolean;
  actionButton?: React.ReactNode;
}

// Helper function to get size-specific styles
const getSizeStyles = (size: InputSize) => {
  switch (size) {
    case 'small':
      return css`
        padding: 0.375rem 0.75rem;
        font-size: 0.875rem;
      `;
    case 'large':
      return css`
        padding: 0.75rem 1rem;
        font-size: 1.125rem;
      `;
    case 'medium':
    default:
      return css`
        padding: 0.5rem 0.875rem;
        font-size: 1rem;
      `;
  }
};

// Container for the input component
const InputContainer = styled.div<{ fullWidth: boolean }>`
  display: flex;
  flex-direction: column;
  margin-bottom: 1.25rem;
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};
`;

// Styled label
const StyledLabel = styled.label<{
  isInvalid: boolean;
  isRequired: boolean;
  hideLabel: boolean;
  disabled: boolean;
}>`
  font-size: 0.875rem;
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  margin-bottom: 0.375rem;
  color: ${({ theme, isInvalid, disabled }) =>
    isInvalid
      ? theme.colors.error
      : disabled
      ? theme.colors.text.disabled
      : theme.colors.text.primary};
  display: ${({ hideLabel }) => (hideLabel ? 'none' : 'block')};
  
  &::after {
    content: ${({ isRequired }) => (isRequired ? '"*"' : '""')};
    color: ${({ theme }) => theme.colors.error};
    margin-left: 0.25rem;
  }
  
  /* Accessibility: Always present for screen readers, even if visually hidden */
  ${({ hideLabel }) =>
    hideLabel &&
    css`
      clip: rect(0 0 0 0);
      clip-path: inset(50%);
      height: 1px;
      overflow: hidden;
      position: absolute;
      white-space: nowrap;
      width: 1px;
    `}
`;

// Input wrapper for positioning icons and action buttons
const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

// Styled input element
const StyledInput = styled.input<{
  variant: InputVariant;
  size: InputSize;
  isInvalid: boolean;
  hasLeftIcon: boolean;
  hasRightIcon: boolean;
  hasActionButton: boolean;
}>`
  width: 100%;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-family: inherit;
  transition: border-color 0.2s, box-shadow 0.2s, background-color 0.2s;
  
  /* Base styles for all variants */
  ${({ size }) => getSizeStyles(size)}
  
  /* Icon padding adjustments */
  padding-left: ${({ hasLeftIcon }) => (hasLeftIcon ? '2.5rem' : undefined)};
  padding-right: ${({ hasRightIcon, hasActionButton }) => {
    if (hasActionButton) return '4.5rem';
    if (hasRightIcon) return '2.5rem';
    return undefined;
  }};
  
  /* Variant-specific styles */
  ${({ theme, variant, isInvalid }) => {
    switch (variant) {
      case 'filled':
        return css`
          border: 1px solid transparent;
          background-color: ${theme.colors.inputBackground + 'DD'};
          
          &:hover {
            background-color: ${theme.colors.inputBackground};
          }
          
          &:focus {
            background-color: ${theme.colors.inputBackground};
            border-color: ${isInvalid ? theme.colors.error : theme.colors.focus};
            box-shadow: 0 0 0 1px ${isInvalid ? theme.colors.error : theme.colors.focus};
          }
        `;
      case 'flushed':
        return css`
          border: none;
          border-bottom: 1px solid ${isInvalid ? theme.colors.error : theme.colors.border};
          border-radius: 0;
          padding-left: 0;
          padding-right: 0;
          background-color: transparent;
          
          &:hover {
            border-bottom-color: ${isInvalid 
              ? theme.colors.error 
              : theme.colors.text.secondary};
          }
          
          &:focus {
            border-bottom-color: ${isInvalid ? theme.colors.error : theme.colors.focus};
            box-shadow: 0 1px 0 0 ${isInvalid ? theme.colors.error : theme.colors.focus};
          }
        `;
      case 'outline':
      default:
        return css`
          border: 1px solid ${isInvalid ? theme.colors.error : theme.colors.inputBorder};
          background-color: ${theme.colors.inputBackground};
          
          &:hover {
            border-color: ${isInvalid ? theme.colors.error : theme.colors.text.secondary};
          }
          
          &:focus {
            border-color: ${isInvalid ? theme.colors.error : theme.colors.focus};
            box-shadow: 0 0 0 1px ${isInvalid ? theme.colors.error : theme.colors.focus};
          }
        `;
    }
  }}
  
  /* Disabled state */
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background-color: ${({ theme }) => theme.colors.divider};
  }
  
  /* High contrast mode adjustments */
  .high-contrast & {
    ${({ theme, isInvalid }) => css`
      border-color: ${isInvalid ? theme.colors.error : theme.colors.border};
      border-width: 2px;
      
      &:focus {
        box-shadow: 0 0 0 2px ${isInvalid ? theme.colors.error : theme.colors.focus};
      }
    `}
  }

  /* Placeholder styles */
  &::placeholder {
    color: ${({ theme }) => theme.colors.text.hint};
    opacity: 0.7;
  }
`;

// Left icon container
const LeftIconContainer = styled.div`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.text.secondary};
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
`;

// Right icon container
const RightIconContainer = styled.div`
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.text.secondary};
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
`;

// Action button container
const ActionButtonContainer = styled.div`
  position: absolute;
  right: 0.25rem;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1;
`;

// Helper text
const HelperText = styled.div<{ isInvalid: boolean }>`
  font-size: 0.75rem;
  margin-top: 0.25rem;
  color: ${({ theme, isInvalid }) =>
    isInvalid ? theme.colors.error : theme.colors.text.secondary};
`;

// Input component with forwarded ref
const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      errorMessage,
      isInvalid = false,
      isRequired = false,
      size = 'medium',
      variant = 'outline',
      leftIcon,
      rightIcon,
      hideLabel = false,
      fullWidth = true,
      actionButton,
      id,
      disabled = false,
      ...restProps
    },
    ref
  ) => {
    const [hasFocus, setHasFocus] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const forwardedRef = ref || inputRef;
    const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;
    
    // Use theme for accessibility features
    const { highContrast } = useTheme();

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setHasFocus(true);
      if (restProps.onFocus) {
        restProps.onFocus(e);
      }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setHasFocus(false);
      if (restProps.onBlur) {
        restProps.onBlur(e);
      }
    };

    return (
      <InputContainer fullWidth={fullWidth}>
        <StyledLabel
          htmlFor={inputId}
          isInvalid={isInvalid}
          isRequired={isRequired}
          hideLabel={hideLabel}
          disabled={disabled}
        >
          {label}
        </StyledLabel>
        
        <InputWrapper>
          {leftIcon && <LeftIconContainer>{leftIcon}</LeftIconContainer>}
          
          <StyledInput
            id={inputId}
            ref={forwardedRef}
            variant={variant}
            size={size}
            isInvalid={isInvalid}
            hasLeftIcon={!!leftIcon}
            hasRightIcon={!!rightIcon}
            hasActionButton={!!actionButton}
            aria-invalid={isInvalid}
            aria-required={isRequired}
            aria-describedby={
              helperText || errorMessage ? `${inputId}-helper-text` : undefined
            }
            disabled={disabled}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...restProps}
          />
          
          {rightIcon && <RightIconContainer>{rightIcon}</RightIconContainer>}
          
          {actionButton && <ActionButtonContainer>{actionButton}</ActionButtonContainer>}
        </InputWrapper>
        
        {(helperText || errorMessage) && (
          <HelperText 
            id={`${inputId}-helper-text`} 
            isInvalid={isInvalid}
          >
            {isInvalid ? errorMessage : helperText}
          </HelperText>
        )}
      </InputContainer>
    );
  }
);

Input.displayName = 'Input';

export default Input; 