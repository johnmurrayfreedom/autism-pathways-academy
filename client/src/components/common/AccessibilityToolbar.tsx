import React, { useState } from 'react';
import styled from 'styled-components';
import { useTheme, ThemeName, FontSize, FontFamily, LineSpacing } from '../../styles/ThemeContext';
import { useAppDispatch, useAppSelector } from '../../store';
import { selectUserPreferences, updateUserPreferences } from '../../store/slices/userSlice';
import { selectUser } from '../../store/slices/authSlice';
import { toggleAccessibilityToolbar } from '../../store/slices/uiSlice';
import Button from './Button';

// Styled components
const ToolbarContainer = styled.aside<{ isOpen: boolean }>`
  position: fixed;
  right: ${({ isOpen }) => (isOpen ? '0' : '-320px')};
  top: 0;
  width: 320px;
  height: 100vh;
  background-color: ${({ theme }) => theme.colors.cardBackground};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  z-index: ${({ theme }) => theme.zIndices.modal - 1};
  transition: right 0.3s ease-in-out;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  
  /* Reduced motion styles */
  .reduced-motion & {
    transition: none;
  }
`;

const ToolbarHeader = styled.div`
  padding: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ToolbarTitle = styled.h2`
  margin: 0;
  font-size: 1.25rem;
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
`;

const ToolbarContent = styled.div`
  padding: 1rem;
  flex: 1;
  overflow-y: auto;
`;

const ToolbarSection = styled.div`
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h3`
  margin: 0 0 0.75rem;
  font-size: 1rem;
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const ToggleButton = styled.button<{ isOpen: boolean }>`
  position: fixed;
  right: ${({ isOpen }) => (isOpen ? '330px' : '10px')};
  bottom: 10px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.buttonText};
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.shadows.md};
  z-index: ${({ theme }) => theme.zIndices.modal - 2};
  transition: right 0.3s ease-in-out;
  
  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.focus};
    outline-offset: 2px;
  }
  
  /* Reduced motion styles */
  .reduced-motion & {
    transition: none;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
`;

const OptionButton = styled.button<{ isActive: boolean }>`
  padding: 0.5rem 0.75rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme, isActive }) =>
    isActive ? theme.colors.primary : theme.colors.surface};
  color: ${({ theme, isActive }) =>
    isActive ? theme.colors.buttonText : theme.colors.text.primary};
  border: 1px solid ${({ theme, isActive }) =>
    isActive ? theme.colors.primary : theme.colors.border};
  cursor: pointer;
  font-size: 0.875rem;
  
  &:hover {
    background-color: ${({ theme, isActive }) =>
      isActive ? theme.colors.primary + 'dd' : theme.colors.primary + '11'};
  }
  
  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.focus};
    outline-offset: 2px;
  }
`;

const ToggleSwitch = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-bottom: 1rem;
`;

const ToggleInput = styled.input`
  height: 0;
  width: 0;
  opacity: 0;
  position: absolute;
`;

const ToggleSlider = styled.span<{ isChecked: boolean }>`
  position: relative;
  display: inline-block;
  width: 40px;
  height: 24px;
  background-color: ${({ theme, isChecked }) =>
    isChecked ? theme.colors.primary : theme.colors.border};
  border-radius: 12px;
  margin-right: 0.75rem;
  transition: background-color 0.2s;
  
  &:before {
    content: '';
    position: absolute;
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    border-radius: 50%;
    transition: transform 0.2s;
    transform: ${({ isChecked }) => (isChecked ? 'translateX(16px)' : 'translateX(0)')};
  }
  
  /* Reduced motion styles */
  .reduced-motion & {
    transition: none;
    
    &:before {
      transition: none;
    }
  }
`;

const ToggleLabel = styled.span`
  font-size: 0.9rem;
`;

// Accessibility Toolbar Component
const AccessibilityToolbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const userPreferences = useAppSelector(selectUserPreferences);
  
  // Theme context for controlling app appearance
  const {
    theme,
    setTheme,
    fontSize,
    setFontSize,
    fontFamily,
    setFontFamily,
    lineSpacing,
    setLineSpacing,
    reducedMotion,
    setReducedMotion,
    highContrast,
    setHighContrast,
  } = useTheme();
  
  // Toggle toolbar visibility
  const toggleToolbar = () => {
    setIsOpen(!isOpen);
    dispatch(toggleAccessibilityToolbar());
  };

  // Save preferences to user account if logged in
  const savePreferences = () => {
    if (user && userPreferences) {
      dispatch(
        updateUserPreferences({
          userId: user.id,
          preferencesData: {
            theme,
            fontSize,
            fontFamily,
            lineSpacing,
            reducedMotion,
            highContrast,
          },
        })
      );
    }
  };

  return (
    <>
      <ToolbarContainer isOpen={isOpen} aria-hidden={!isOpen}>
        <ToolbarHeader>
          <ToolbarTitle>Accessibility Options</ToolbarTitle>
          <Button
            variant="text"
            size="small"
            onClick={toggleToolbar}
            ariaLabel="Close accessibility toolbar"
          >
            Close
          </Button>
        </ToolbarHeader>
        
        <ToolbarContent>
          <ToolbarSection>
            <SectionTitle>Theme</SectionTitle>
            <ButtonGroup>
              <OptionButton
                isActive={theme === 'light'}
                onClick={() => setTheme('light')}
              >
                Light
              </OptionButton>
              <OptionButton
                isActive={theme === 'dark'}
                onClick={() => setTheme('dark')}
              >
                Dark
              </OptionButton>
              <OptionButton
                isActive={theme === 'high-contrast'}
                onClick={() => setTheme('high-contrast')}
              >
                High Contrast
              </OptionButton>
              <OptionButton
                isActive={theme === 'low-blue'}
                onClick={() => setTheme('low-blue')}
              >
                Low Blue Light
              </OptionButton>
              <OptionButton
                isActive={theme === 'neutral'}
                onClick={() => setTheme('neutral')}
              >
                Neutral
              </OptionButton>
            </ButtonGroup>
          </ToolbarSection>
          
          <ToolbarSection>
            <SectionTitle>Font Size</SectionTitle>
            <ButtonGroup>
              <OptionButton
                isActive={fontSize === 14}
                onClick={() => setFontSize(14)}
              >
                Small
              </OptionButton>
              <OptionButton
                isActive={fontSize === 16}
                onClick={() => setFontSize(16)}
              >
                Medium
              </OptionButton>
              <OptionButton
                isActive={fontSize === 18}
                onClick={() => setFontSize(18)}
              >
                Large
              </OptionButton>
              <OptionButton
                isActive={fontSize === 20}
                onClick={() => setFontSize(20)}
              >
                X-Large
              </OptionButton>
              <OptionButton
                isActive={fontSize === 22}
                onClick={() => setFontSize(22)}
              >
                XX-Large
              </OptionButton>
            </ButtonGroup>
          </ToolbarSection>
          
          <ToolbarSection>
            <SectionTitle>Font Family</SectionTitle>
            <ButtonGroup>
              <OptionButton
                isActive={fontFamily === 'system'}
                onClick={() => setFontFamily('system')}
              >
                System
              </OptionButton>
              <OptionButton
                isActive={fontFamily === 'sans-serif'}
                onClick={() => setFontFamily('sans-serif')}
              >
                Sans-serif
              </OptionButton>
              <OptionButton
                isActive={fontFamily === 'serif'}
                onClick={() => setFontFamily('serif')}
              >
                Serif
              </OptionButton>
              <OptionButton
                isActive={fontFamily === 'dyslexic'}
                onClick={() => setFontFamily('dyslexic')}
              >
                OpenDyslexic
              </OptionButton>
            </ButtonGroup>
          </ToolbarSection>
          
          <ToolbarSection>
            <SectionTitle>Line Spacing</SectionTitle>
            <ButtonGroup>
              <OptionButton
                isActive={lineSpacing === 1}
                onClick={() => setLineSpacing(1)}
              >
                Tight
              </OptionButton>
              <OptionButton
                isActive={lineSpacing === 1.5}
                onClick={() => setLineSpacing(1.5)}
              >
                Normal
              </OptionButton>
              <OptionButton
                isActive={lineSpacing === 2}
                onClick={() => setLineSpacing(2)}
              >
                Relaxed
              </OptionButton>
              <OptionButton
                isActive={lineSpacing === 2.5}
                onClick={() => setLineSpacing(2.5)}
              >
                Loose
              </OptionButton>
            </ButtonGroup>
          </ToolbarSection>
          
          <ToolbarSection>
            <SectionTitle>Display Options</SectionTitle>
            
            <ToggleSwitch>
              <ToggleInput
                type="checkbox"
                checked={reducedMotion}
                onChange={() => setReducedMotion(!reducedMotion)}
                aria-label="Reduce motion"
              />
              <ToggleSlider isChecked={reducedMotion} />
              <ToggleLabel>Reduce animations and motion</ToggleLabel>
            </ToggleSwitch>
            
            <ToggleSwitch>
              <ToggleInput
                type="checkbox"
                checked={highContrast}
                onChange={() => setHighContrast(!highContrast)}
                aria-label="High contrast mode"
              />
              <ToggleSlider isChecked={highContrast} />
              <ToggleLabel>High contrast mode</ToggleLabel>
            </ToggleSwitch>
          </ToolbarSection>
          
          {user && (
            <Button
              variant="primary"
              size="medium"
              isFullWidth
              onClick={savePreferences}
            >
              Save as My Default Settings
            </Button>
          )}
        </ToolbarContent>
      </ToolbarContainer>
      
      <ToggleButton
        isOpen={isOpen}
        onClick={toggleToolbar}
        aria-label="Toggle accessibility toolbar"
        aria-expanded={isOpen}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-5h10v2H7v-2zm0-4h10v2H7v-2z" />
        </svg>
      </ToggleButton>
    </>
  );
};

export default AccessibilityToolbar; 