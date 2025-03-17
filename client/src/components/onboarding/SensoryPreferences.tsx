import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useTheme } from '../../styles/ThemeContext';
import Button from '../common/Button';

interface SensoryPreferencesProps {
  initialData: Record<string, any>;
  onSave: (data: Record<string, any>) => void;
}

// Container for the entire component
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

// Section container with a subtle background and rounded corners
const Section = styled.section`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: 1.5rem;
  margin-bottom: 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

// Section title
const SectionTitle = styled.h3`
  font-size: 1.25rem;
  margin-bottom: 1rem;
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
`;

// Section description
const SectionDescription = styled.p`
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.5;
`;

// Option group container for related preferences
const OptionGroup = styled.div`
  margin-bottom: 1.5rem;
`;

// Option group label
const OptionGroupLabel = styled.h4`
  font-size: 1rem;
  margin-bottom: 0.75rem;
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
`;

// Container for option buttons
const OptionsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

// Toggle switch container
const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

// Toggle switch label
const ToggleLabel = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

// Hidden input for the toggle
const ToggleInput = styled.input`
  height: 0;
  width: 0;
  opacity: 0;
  position: absolute;
`;

// Visual part of the toggle
const ToggleSlider = styled.span<{ isChecked: boolean }>`
  position: relative;
  display: inline-block;
  width: 48px;
  height: 24px;
  background-color: ${({ theme, isChecked }) =>
    isChecked ? theme.colors.primary : theme.colors.border};
  border-radius: 24px;
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
    transform: ${({ isChecked }) => (isChecked ? 'translateX(24px)' : 'translateX(0)')};
  }
  
  .reduced-motion & {
    transition: none;
    
    &:before {
      transition: none;
    }
  }
`;

// Toggle switch text
const ToggleLabelText = styled.span`
  font-size: 1rem;
`;

// Option button
const OptionButton = styled.button<{ isSelected: boolean }>`
  padding: 0.75rem 1rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme, isSelected }) =>
    isSelected ? theme.colors.primary + '22' : theme.colors.surface};
  color: ${({ theme }) => theme.colors.text.primary};
  border: 1px solid ${({ theme, isSelected }) =>
    isSelected ? theme.colors.primary : theme.colors.border};
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
  
  /* Add a visual indicator of selection */
  ${({ isSelected }) =>
    isSelected &&
    `
    position: relative;
    
    &:after {
      content: '✓';
      position: absolute;
      top: 0.3rem;
      right: 0.4rem;
      font-size: 0.8rem;
    }
  `}
  
  &:hover {
    background-color: ${({ theme, isSelected }) =>
      isSelected ? theme.colors.primary + '33' : theme.colors.primary + '11'};
  }
  
  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.focus};
    outline-offset: 2px;
  }
  
  .reduced-motion & {
    transition: none;
  }
`;

// Checkbox container
const CheckboxContainer = styled.div`
  margin-bottom: 0.75rem;
`;

// Checkbox label
const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

// Checkbox input
const CheckboxInput = styled.input`
  margin-right: 0.75rem;
  width: 18px;
  height: 18px;
  cursor: pointer;
`;

// Helper text
const HelperText = styled.p`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.text.hint};
  margin-top: 0.5rem;
  font-style: italic;
`;

// Save button container
const ButtonContainer = styled.div`
  margin-top: 2rem;
  display: flex;
  justify-content: flex-end;
`;

const SensoryPreferences: React.FC<SensoryPreferencesProps> = ({ initialData, onSave }) => {
  // Initialize state with provided data or defaults
  const [preferences, setPreferences] = useState({
    theme: initialData.theme || 'light',
    fontSize: initialData.fontSize || 'medium',
    fontFamily: initialData.fontFamily || 'system',
    lineSpacing: initialData.lineSpacing || 'normal',
    reducedMotion: initialData.reducedMotion || false,
    highContrast: initialData.highContrast || false,
    soundSensitivity: initialData.soundSensitivity || 'medium',
    videoAutoplay: initialData.videoAutoplay || false,
    captionsEnabled: initialData.captionsEnabled || true,
    animationPreference: initialData.animationPreference || 'minimal',
    pageDensity: initialData.pageDensity || 'balanced',
    notificationSound: initialData.notificationSound || false,
    notificationVisual: initialData.notificationVisual || true,
    soundEffects: initialData.soundEffects || false,
    backgroundSounds: initialData.backgroundSounds || 'none',
    contentTransitionPreference: initialData.contentTransitionPreference || 'fade',
    colorSensitivity: initialData.colorSensitivity || [],
  });

  // Access the ThemeContext to apply preferences immediately
  const themeContext = useTheme();
  
  // Apply some preferences immediately for preview
  useEffect(() => {
    themeContext.setTheme(preferences.theme as any);
    themeContext.setReducedMotion(preferences.reducedMotion);
    themeContext.setHighContrast(preferences.highContrast);
    
    // Map fontSize string values to numeric values
    const fontSizeMap: Record<string, number> = {
      'small': 14,
      'medium': 16,
      'large': 18,
      'x-large': 20,
      'xx-large': 22
    };
    
    if (fontSizeMap[preferences.fontSize]) {
      themeContext.setFontSize(fontSizeMap[preferences.fontSize] as any);
    }
    
    // Map lineSpacing string values to numeric values
    const lineSpacingMap: Record<string, number> = {
      'tight': 1,
      'normal': 1.5,
      'relaxed': 2,
      'loose': 2.5
    };
    
    if (lineSpacingMap[preferences.lineSpacing]) {
      themeContext.setLineSpacing(lineSpacingMap[preferences.lineSpacing] as any);
    }
    
  }, [preferences, themeContext]);

  // Update a single preference
  const updatePreference = (key: string, value: any) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Toggle a boolean preference
  const togglePreference = (key: string) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Toggle a value in an array preference
  const toggleArrayPreference = (key: string, value: string) => {
    setPreferences(prev => {
      const currentArray = Array.isArray(prev[key]) ? [...prev[key]] : [];
      
      if (currentArray.includes(value)) {
        return {
          ...prev,
          [key]: currentArray.filter(item => item !== value)
        };
      } else {
        return {
          ...prev,
          [key]: [...currentArray, value]
        };
      }
    });
  };

  // Handle save
  const handleSave = () => {
    onSave(preferences);
  };

  return (
    <Container>
      <h2>Sensory Preferences</h2>
      <p>
        These settings help us customize how content appears and behaves to match your sensory
        preferences. You'll see some changes applied immediately.
      </p>

      <Section>
        <SectionTitle>Visual Preferences</SectionTitle>
        <SectionDescription>
          Customize how the application looks to suit your visual comfort.
        </SectionDescription>

        <OptionGroup>
          <OptionGroupLabel>Theme</OptionGroupLabel>
          <OptionsContainer>
            <OptionButton
              isSelected={preferences.theme === 'light'}
              onClick={() => updatePreference('theme', 'light')}
            >
              Light
            </OptionButton>
            <OptionButton
              isSelected={preferences.theme === 'dark'}
              onClick={() => updatePreference('theme', 'dark')}
            >
              Dark
            </OptionButton>
            <OptionButton
              isSelected={preferences.theme === 'high-contrast'}
              onClick={() => updatePreference('theme', 'high-contrast')}
            >
              High Contrast
            </OptionButton>
            <OptionButton
              isSelected={preferences.theme === 'low-blue'}
              onClick={() => updatePreference('theme', 'low-blue')}
            >
              Low Blue Light
            </OptionButton>
            <OptionButton
              isSelected={preferences.theme === 'neutral'}
              onClick={() => updatePreference('theme', 'neutral')}
            >
              Neutral
            </OptionButton>
          </OptionsContainer>
        </OptionGroup>

        <OptionGroup>
          <OptionGroupLabel>Font Size</OptionGroupLabel>
          <OptionsContainer>
            <OptionButton
              isSelected={preferences.fontSize === 'small'}
              onClick={() => updatePreference('fontSize', 'small')}
            >
              Small
            </OptionButton>
            <OptionButton
              isSelected={preferences.fontSize === 'medium'}
              onClick={() => updatePreference('fontSize', 'medium')}
            >
              Medium
            </OptionButton>
            <OptionButton
              isSelected={preferences.fontSize === 'large'}
              onClick={() => updatePreference('fontSize', 'large')}
            >
              Large
            </OptionButton>
            <OptionButton
              isSelected={preferences.fontSize === 'x-large'}
              onClick={() => updatePreference('fontSize', 'x-large')}
            >
              X-Large
            </OptionButton>
            <OptionButton
              isSelected={preferences.fontSize === 'xx-large'}
              onClick={() => updatePreference('fontSize', 'xx-large')}
            >
              XX-Large
            </OptionButton>
          </OptionsContainer>
        </OptionGroup>

        <OptionGroup>
          <OptionGroupLabel>Line Spacing</OptionGroupLabel>
          <OptionsContainer>
            <OptionButton
              isSelected={preferences.lineSpacing === 'tight'}
              onClick={() => updatePreference('lineSpacing', 'tight')}
            >
              Tight
            </OptionButton>
            <OptionButton
              isSelected={preferences.lineSpacing === 'normal'}
              onClick={() => updatePreference('lineSpacing', 'normal')}
            >
              Normal
            </OptionButton>
            <OptionButton
              isSelected={preferences.lineSpacing === 'relaxed'}
              onClick={() => updatePreference('lineSpacing', 'relaxed')}
            >
              Relaxed
            </OptionButton>
            <OptionButton
              isSelected={preferences.lineSpacing === 'loose'}
              onClick={() => updatePreference('lineSpacing', 'loose')}
            >
              Loose
            </OptionButton>
          </OptionsContainer>
        </OptionGroup>

        <OptionGroup>
          <OptionGroupLabel>Font Family</OptionGroupLabel>
          <OptionsContainer>
            <OptionButton
              isSelected={preferences.fontFamily === 'system'}
              onClick={() => updatePreference('fontFamily', 'system')}
            >
              System Default
            </OptionButton>
            <OptionButton
              isSelected={preferences.fontFamily === 'sans-serif'}
              onClick={() => updatePreference('fontFamily', 'sans-serif')}
            >
              Sans-serif
            </OptionButton>
            <OptionButton
              isSelected={preferences.fontFamily === 'serif'}
              onClick={() => updatePreference('fontFamily', 'serif')}
            >
              Serif
            </OptionButton>
            <OptionButton
              isSelected={preferences.fontFamily === 'dyslexic'}
              onClick={() => updatePreference('fontFamily', 'dyslexic')}
            >
              OpenDyslexic
            </OptionButton>
          </OptionsContainer>
        </OptionGroup>

        <OptionGroup>
          <OptionGroupLabel>Page Density</OptionGroupLabel>
          <OptionsContainer>
            <OptionButton
              isSelected={preferences.pageDensity === 'compact'}
              onClick={() => updatePreference('pageDensity', 'compact')}
            >
              Compact (More content)
            </OptionButton>
            <OptionButton
              isSelected={preferences.pageDensity === 'balanced'}
              onClick={() => updatePreference('pageDensity', 'balanced')}
            >
              Balanced
            </OptionButton>
            <OptionButton
              isSelected={preferences.pageDensity === 'spacious'}
              onClick={() => updatePreference('pageDensity', 'spacious')}
            >
              Spacious (Less content)
            </OptionButton>
          </OptionsContainer>
        </OptionGroup>

        <ToggleContainer>
          <ToggleLabel>
            <ToggleInput
              type="checkbox"
              checked={preferences.reducedMotion}
              onChange={() => togglePreference('reducedMotion')}
            />
            <ToggleSlider isChecked={preferences.reducedMotion} />
            <ToggleLabelText>Reduce animations and motion</ToggleLabelText>
          </ToggleLabel>
        </ToggleContainer>

        <ToggleContainer>
          <ToggleLabel>
            <ToggleInput
              type="checkbox"
              checked={preferences.highContrast}
              onChange={() => togglePreference('highContrast')}
            />
            <ToggleSlider isChecked={preferences.highContrast} />
            <ToggleLabelText>Enable high contrast mode</ToggleLabelText>
          </ToggleLabel>
        </ToggleContainer>
      </Section>

      <Section>
        <SectionTitle>Audio Preferences</SectionTitle>
        <SectionDescription>
          Control how the application uses sound.
        </SectionDescription>

        <OptionGroup>
          <OptionGroupLabel>Sound Sensitivity</OptionGroupLabel>
          <OptionsContainer>
            <OptionButton
              isSelected={preferences.soundSensitivity === 'low'}
              onClick={() => updatePreference('soundSensitivity', 'low')}
            >
              Low (Regular volume)
            </OptionButton>
            <OptionButton
              isSelected={preferences.soundSensitivity === 'medium'}
              onClick={() => updatePreference('soundSensitivity', 'medium')}
            >
              Medium (Reduced volume)
            </OptionButton>
            <OptionButton
              isSelected={preferences.soundSensitivity === 'high'}
              onClick={() => updatePreference('soundSensitivity', 'high')}
            >
              High (Minimal audio)
            </OptionButton>
          </OptionsContainer>
        </OptionGroup>

        <ToggleContainer>
          <ToggleLabel>
            <ToggleInput
              type="checkbox"
              checked={preferences.notificationSound}
              onChange={() => togglePreference('notificationSound')}
            />
            <ToggleSlider isChecked={preferences.notificationSound} />
            <ToggleLabelText>Enable notification sounds</ToggleLabelText>
          </ToggleLabel>
        </ToggleContainer>

        <ToggleContainer>
          <ToggleLabel>
            <ToggleInput
              type="checkbox"
              checked={preferences.soundEffects}
              onChange={() => togglePreference('soundEffects')}
            />
            <ToggleSlider isChecked={preferences.soundEffects} />
            <ToggleLabelText>Enable UI sound effects</ToggleLabelText>
          </ToggleLabel>
        </ToggleContainer>

        <OptionGroup>
          <OptionGroupLabel>Background Sounds</OptionGroupLabel>
          <OptionsContainer>
            <OptionButton
              isSelected={preferences.backgroundSounds === 'none'}
              onClick={() => updatePreference('backgroundSounds', 'none')}
            >
              None
            </OptionButton>
            <OptionButton
              isSelected={preferences.backgroundSounds === 'white-noise'}
              onClick={() => updatePreference('backgroundSounds', 'white-noise')}
            >
              White Noise
            </OptionButton>
            <OptionButton
              isSelected={preferences.backgroundSounds === 'nature'}
              onClick={() => updatePreference('backgroundSounds', 'nature')}
            >
              Nature Sounds
            </OptionButton>
            <OptionButton
              isSelected={preferences.backgroundSounds === 'ambient'}
              onClick={() => updatePreference('backgroundSounds', 'ambient')}
            >
              Ambient Music
            </OptionButton>
          </OptionsContainer>
          <HelperText>
            Background sounds can be toggled on/off at any time.
          </HelperText>
        </OptionGroup>
      </Section>

      <Section>
        <SectionTitle>Video and Media Preferences</SectionTitle>
        <SectionDescription>
          Customize how videos and other media content behave.
        </SectionDescription>

        <ToggleContainer>
          <ToggleLabel>
            <ToggleInput
              type="checkbox"
              checked={preferences.videoAutoplay}
              onChange={() => togglePreference('videoAutoplay')}
            />
            <ToggleSlider isChecked={preferences.videoAutoplay} />
            <ToggleLabelText>Allow videos to autoplay</ToggleLabelText>
          </ToggleLabel>
        </ToggleContainer>

        <ToggleContainer>
          <ToggleLabel>
            <ToggleInput
              type="checkbox"
              checked={preferences.captionsEnabled}
              onChange={() => togglePreference('captionsEnabled')}
            />
            <ToggleSlider isChecked={preferences.captionsEnabled} />
            <ToggleLabelText>Enable captions by default</ToggleLabelText>
          </ToggleLabel>
        </ToggleContainer>

        <OptionGroup>
          <OptionGroupLabel>Animation Preference</OptionGroupLabel>
          <OptionsContainer>
            <OptionButton
              isSelected={preferences.animationPreference === 'standard'}
              onClick={() => updatePreference('animationPreference', 'standard')}
            >
              Standard
            </OptionButton>
            <OptionButton
              isSelected={preferences.animationPreference === 'minimal'}
              onClick={() => updatePreference('animationPreference', 'minimal')}
            >
              Minimal
            </OptionButton>
            <OptionButton
              isSelected={preferences.animationPreference === 'none'}
              onClick={() => updatePreference('animationPreference', 'none')}
            >
              None
            </OptionButton>
          </OptionsContainer>
        </OptionGroup>

        <OptionGroup>
          <OptionGroupLabel>Content Transition Style</OptionGroupLabel>
          <OptionsContainer>
            <OptionButton
              isSelected={preferences.contentTransitionPreference === 'none'}
              onClick={() => updatePreference('contentTransitionPreference', 'none')}
            >
              Instant
            </OptionButton>
            <OptionButton
              isSelected={preferences.contentTransitionPreference === 'fade'}
              onClick={() => updatePreference('contentTransitionPreference', 'fade')}
            >
              Fade
            </OptionButton>
            <OptionButton
              isSelected={preferences.contentTransitionPreference === 'slide'}
              onClick={() => updatePreference('contentTransitionPreference', 'slide')}
            >
              Slide
            </OptionButton>
          </OptionsContainer>
        </OptionGroup>
      </Section>

      <Section>
        <SectionTitle>Other Sensitivities</SectionTitle>
        <SectionDescription>
          Help us understand any other sensory needs you may have.
        </SectionDescription>

        <OptionGroup>
          <OptionGroupLabel>Color Sensitivities</OptionGroupLabel>
          <HelperText>
            Select any colors that you find visually uncomfortable:
          </HelperText>
          
          <CheckboxContainer>
            <CheckboxLabel>
              <CheckboxInput
                type="checkbox"
                checked={preferences.colorSensitivity.includes('bright-red')}
                onChange={() => toggleArrayPreference('colorSensitivity', 'bright-red')}
              />
              Bright Red
            </CheckboxLabel>
          </CheckboxContainer>
          
          <CheckboxContainer>
            <CheckboxLabel>
              <CheckboxInput
                type="checkbox"
                checked={preferences.colorSensitivity.includes('bright-blue')}
                onChange={() => toggleArrayPreference('colorSensitivity', 'bright-blue')}
              />
              Bright Blue
            </CheckboxLabel>
          </CheckboxContainer>
          
          <CheckboxContainer>
            <CheckboxLabel>
              <CheckboxInput
                type="checkbox"
                checked={preferences.colorSensitivity.includes('bright-yellow')}
                onChange={() => toggleArrayPreference('colorSensitivity', 'bright-yellow')}
              />
              Bright Yellow
            </CheckboxLabel>
          </CheckboxContainer>
          
          <CheckboxContainer>
            <CheckboxLabel>
              <CheckboxInput
                type="checkbox"
                checked={preferences.colorSensitivity.includes('fluorescent')}
                onChange={() => toggleArrayPreference('colorSensitivity', 'fluorescent')}
              />
              Fluorescent Colors
            </CheckboxLabel>
          </CheckboxContainer>
          
          <CheckboxContainer>
            <CheckboxLabel>
              <CheckboxInput
                type="checkbox"
                checked={preferences.colorSensitivity.includes('high-saturation')}
                onChange={() => toggleArrayPreference('colorSensitivity', 'high-saturation')}
              />
              Highly Saturated Colors
            </CheckboxLabel>
          </CheckboxContainer>
        </OptionGroup>

        <ToggleContainer>
          <ToggleLabel>
            <ToggleInput
              type="checkbox"
              checked={preferences.notificationVisual}
              onChange={() => togglePreference('notificationVisual')}
            />
            <ToggleSlider isChecked={preferences.notificationVisual} />
            <ToggleLabelText>Enable visual notifications</ToggleLabelText>
          </ToggleLabel>
        </ToggleContainer>
      </Section>

      <ButtonContainer>
        <Button
          variant="primary"
          onClick={handleSave}
          ariaLabel="Save sensory preferences"
        >
          Save Preferences
        </Button>
      </ButtonContainer>
    </Container>
  );
};

export default SensoryPreferences; 