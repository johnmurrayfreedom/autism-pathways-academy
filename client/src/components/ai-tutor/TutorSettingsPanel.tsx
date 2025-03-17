import React from 'react';
import styled from 'styled-components';
import { TutorSettings, InteractionStyle, VisualSupport, PacePreference, NextStepsType } from './AITutorInterface';

interface TutorSettingsPanelProps {
  settings: TutorSettings;
  onUpdateSettings: (newSettings: Partial<TutorSettings>) => void;
}

// Container for the settings panel
const SettingsContainer = styled.div`
  padding: 1rem;
  height: 100%;
  overflow-y: auto;
  background-color: ${({ theme }) => theme.colors.surface};
  border-left: 1px solid ${({ theme }) => theme.colors.border};
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.surface};
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.colors.border};
    border-radius: 4px;
  }
`;

// Settings title
const SettingsTitle = styled.h3`
  font-size: 1.25rem;
  margin-top: 0;
  margin-bottom: 1.5rem;
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
`;

// Settings section
const SettingsSection = styled.div`
  margin-bottom: 2rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

// Section label
const SectionLabel = styled.h4`
  font-size: 1rem;
  margin-top: 0;
  margin-bottom: 0.75rem;
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  color: ${({ theme }) => theme.colors.text.primary};
`;

// Section description
const SectionDescription = styled.p`
  font-size: 0.9rem;
  margin-top: 0;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.4;
`;

// Option group
const OptionGroup = styled.div`
  margin-bottom: 1.5rem;
`;

// Radio group
const RadioGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

// Radio option label
const RadioLabel = styled.label`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.hover};
  }
  
  input:checked + & {
    border-color: ${({ theme }) => theme.colors.primary};
    background-color: ${({ theme }) => theme.colors.primary + '11'};
  }
  
  .reduced-motion & {
    transition: none;
  }
`;

// Radio input (hidden visually but accessible)
const RadioInput = styled.input`
  &:focus + label {
    outline: 2px solid ${({ theme }) => theme.colors.focus};
    outline-offset: 2px;
  }
`;

// Radio text content
const RadioTextContent = styled.div`
  display: flex;
  flex-direction: column;
`;

// Option title
const OptionTitle = styled.span`
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  color: ${({ theme }) => theme.colors.text.primary};
`;

// Option description
const OptionDescription = styled.span`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-top: 0.25rem;
`;

// Checkbox container
const CheckboxContainer = styled.div`
  margin-bottom: 0.75rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

// Checkbox label
const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
`;

// Checkbox input
const CheckboxInput = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
  
  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.focus};
    outline-offset: 2px;
  }
`;

// Divider
const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  margin: 1.5rem 0;
`;

// Reset button
const ResetButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.primary};
  padding: 0.5rem;
  font-size: 0.9rem;
  cursor: pointer;
  text-decoration: underline;
  width: 100%;
  text-align: center;
  
  &:hover {
    color: ${({ theme }) => theme.colors.primaryHover};
  }
  
  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.focus};
    outline-offset: 2px;
  }
`;

// Helper text
const HelperText = styled.p`
  font-size: 0.85rem;
  font-style: italic;
  color: ${({ theme }) => theme.colors.text.hint};
  margin-top: 1.5rem;
  margin-bottom: 0;
`;

const TutorSettingsPanel: React.FC<TutorSettingsPanelProps> = ({ settings, onUpdateSettings }) => {
  // Handle interaction style change
  const handleInteractionStyleChange = (style: InteractionStyle) => {
    onUpdateSettings({ interactionStyle: style });
  };
  
  // Handle visual support change
  const handleVisualSupportChange = (level: VisualSupport) => {
    onUpdateSettings({ visualSupport: level });
  };
  
  // Handle pace preference change
  const handlePacePreferenceChange = (pace: PacePreference) => {
    onUpdateSettings({ pacePreference: pace });
  };
  
  // Handle toggle settings change
  const handleToggleChange = (setting: keyof TutorSettings, value: boolean) => {
    onUpdateSettings({ [setting]: value });
  };
  
  // Handle next steps preference toggle
  const handleNextStepToggle = (type: NextStepsType) => {
    const currentPreferences = [...settings.preferredNextSteps];
    
    if (currentPreferences.includes(type)) {
      onUpdateSettings({
        preferredNextSteps: currentPreferences.filter(item => item !== type)
      });
    } else {
      onUpdateSettings({
        preferredNextSteps: [...currentPreferences, type]
      });
    }
  };
  
  // Reset all settings to defaults
  const handleResetSettings = () => {
    onUpdateSettings({
      interactionStyle: 'direct',
      visualSupport: 'moderate',
      pacePreference: 'balanced',
      codeSupport: true,
      showNextSteps: true,
      preferredNextSteps: ['practice', 'related-concepts'],
      useSimpleLanguage: false
    });
  };
  
  return (
    <SettingsContainer>
      <SettingsTitle>Tutor Settings</SettingsTitle>
      
      {/* Interaction Style Section */}
      <SettingsSection>
        <SectionLabel>Interaction Style</SectionLabel>
        <SectionDescription>
          Choose how the AI tutor explains concepts to you
        </SectionDescription>
        
        <RadioGroup role="radiogroup" aria-label="Interaction style">
          <div>
            <RadioInput
              type="radio"
              id="interaction-direct"
              name="interactionStyle"
              value="direct"
              checked={settings.interactionStyle === 'direct'}
              onChange={() => handleInteractionStyleChange('direct')}
              className="visually-hidden"
            />
            <RadioLabel htmlFor="interaction-direct">
              <RadioTextContent>
                <OptionTitle>Direct and Literal</OptionTitle>
                <OptionDescription>
                  Straightforward explanations with clear, concrete examples
                </OptionDescription>
              </RadioTextContent>
            </RadioLabel>
          </div>
          
          <div>
            <RadioInput
              type="radio"
              id="interaction-conceptual"
              name="interactionStyle"
              value="conceptual"
              checked={settings.interactionStyle === 'conceptual'}
              onChange={() => handleInteractionStyleChange('conceptual')}
              className="visually-hidden"
            />
            <RadioLabel htmlFor="interaction-conceptual">
              <RadioTextContent>
                <OptionTitle>Conceptual with Visuals</OptionTitle>
                <OptionDescription>
                  Explanations using analogies, metaphors, and visual examples
                </OptionDescription>
              </RadioTextContent>
            </RadioLabel>
          </div>
          
          <div>
            <RadioInput
              type="radio"
              id="interaction-example"
              name="interactionStyle"
              value="example-based"
              checked={settings.interactionStyle === 'example-based'}
              onChange={() => handleInteractionStyleChange('example-based')}
              className="visually-hidden"
            />
            <RadioLabel htmlFor="interaction-example">
              <RadioTextContent>
                <OptionTitle>Example-based</OptionTitle>
                <OptionDescription>
                  Learning through concrete, practical examples and sample code
                </OptionDescription>
              </RadioTextContent>
            </RadioLabel>
          </div>
          
          <div>
            <RadioInput
              type="radio"
              id="interaction-stepbystep"
              name="interactionStyle"
              value="step-by-step"
              checked={settings.interactionStyle === 'step-by-step'}
              onChange={() => handleInteractionStyleChange('step-by-step')}
              className="visually-hidden"
            />
            <RadioLabel htmlFor="interaction-stepbystep">
              <RadioTextContent>
                <OptionTitle>Step-by-Step Instructions</OptionTitle>
                <OptionDescription>
                  Detailed, sequential explanations with clear progression
                </OptionDescription>
              </RadioTextContent>
            </RadioLabel>
          </div>
        </RadioGroup>
      </SettingsSection>
      
      <Divider />
      
      {/* Detail Level Section */}
      <SettingsSection>
        <SectionLabel>Detail Level</SectionLabel>
        <SectionDescription>
          Choose how detailed you want the AI tutor's responses to be
        </SectionDescription>
        
        <RadioGroup role="radiogroup" aria-label="Detail level">
          <div>
            <RadioInput
              type="radio"
              id="pace-concise"
              name="pacePreference"
              value="concise"
              checked={settings.pacePreference === 'concise'}
              onChange={() => handlePacePreferenceChange('concise')}
              className="visually-hidden"
            />
            <RadioLabel htmlFor="pace-concise">
              <RadioTextContent>
                <OptionTitle>Concise</OptionTitle>
                <OptionDescription>
                  Brief responses focused on key points
                </OptionDescription>
              </RadioTextContent>
            </RadioLabel>
          </div>
          
          <div>
            <RadioInput
              type="radio"
              id="pace-balanced"
              name="pacePreference"
              value="balanced"
              checked={settings.pacePreference === 'balanced'}
              onChange={() => handlePacePreferenceChange('balanced')}
              className="visually-hidden"
            />
            <RadioLabel htmlFor="pace-balanced">
              <RadioTextContent>
                <OptionTitle>Balanced</OptionTitle>
                <OptionDescription>
                  Moderate detail with examples when helpful
                </OptionDescription>
              </RadioTextContent>
            </RadioLabel>
          </div>
          
          <div>
            <RadioInput
              type="radio"
              id="pace-detailed"
              name="pacePreference"
              value="detailed"
              checked={settings.pacePreference === 'detailed'}
              onChange={() => handlePacePreferenceChange('detailed')}
              className="visually-hidden"
            />
            <RadioLabel htmlFor="pace-detailed">
              <RadioTextContent>
                <OptionTitle>Detailed</OptionTitle>
                <OptionDescription>
                  Comprehensive explanations with multiple examples
                </OptionDescription>
              </RadioTextContent>
            </RadioLabel>
          </div>
        </RadioGroup>
      </SettingsSection>
      
      <Divider />
      
      {/* Visual Support Section */}
      <SettingsSection>
        <SectionLabel>Visual Support</SectionLabel>
        <SectionDescription>
          Choose how much visual support you want in explanations
        </SectionDescription>
        
        <RadioGroup role="radiogroup" aria-label="Visual support level">
          <div>
            <RadioInput
              type="radio"
              id="visual-minimal"
              name="visualSupport"
              value="minimal"
              checked={settings.visualSupport === 'minimal'}
              onChange={() => handleVisualSupportChange('minimal')}
              className="visually-hidden"
            />
            <RadioLabel htmlFor="visual-minimal">
              <RadioTextContent>
                <OptionTitle>Minimal</OptionTitle>
                <OptionDescription>
                  Text-focused with few visuals
                </OptionDescription>
              </RadioTextContent>
            </RadioLabel>
          </div>
          
          <div>
            <RadioInput
              type="radio"
              id="visual-moderate"
              name="visualSupport"
              value="moderate"
              checked={settings.visualSupport === 'moderate'}
              onChange={() => handleVisualSupportChange('moderate')}
              className="visually-hidden"
            />
            <RadioLabel htmlFor="visual-moderate">
              <RadioTextContent>
                <OptionTitle>Moderate</OptionTitle>
                <OptionDescription>
                  Balance of text with helpful diagrams and visuals
                </OptionDescription>
              </RadioTextContent>
            </RadioLabel>
          </div>
          
          <div>
            <RadioInput
              type="radio"
              id="visual-extensive"
              name="visualSupport"
              value="extensive"
              checked={settings.visualSupport === 'extensive'}
              onChange={() => handleVisualSupportChange('extensive')}
              className="visually-hidden"
            />
            <RadioLabel htmlFor="visual-extensive">
              <RadioTextContent>
                <OptionTitle>Extensive</OptionTitle>
                <OptionDescription>
                  Heavy use of visuals, diagrams, and visual explanations
                </OptionDescription>
              </RadioTextContent>
            </RadioLabel>
          </div>
        </RadioGroup>
      </SettingsSection>
      
      <Divider />
      
      {/* Additional Options Section */}
      <SettingsSection>
        <SectionLabel>Additional Options</SectionLabel>
        
        <CheckboxContainer>
          <CheckboxLabel htmlFor="code-support">
            <CheckboxInput
              type="checkbox"
              id="code-support"
              checked={settings.codeSupport}
              onChange={(e) => handleToggleChange('codeSupport', e.target.checked)}
            />
            <span>Code explanations and examples</span>
          </CheckboxLabel>
        </CheckboxContainer>
        
        <CheckboxContainer>
          <CheckboxLabel htmlFor="show-next-steps">
            <CheckboxInput
              type="checkbox"
              id="show-next-steps"
              checked={settings.showNextSteps}
              onChange={(e) => handleToggleChange('showNextSteps', e.target.checked)}
            />
            <span>Show suggested next steps</span>
          </CheckboxLabel>
        </CheckboxContainer>
        
        <CheckboxContainer>
          <CheckboxLabel htmlFor="simple-language">
            <CheckboxInput
              type="checkbox"
              id="simple-language"
              checked={settings.useSimpleLanguage}
              onChange={(e) => handleToggleChange('useSimpleLanguage', e.target.checked)}
            />
            <span>Use simple language (avoid idioms and figures of speech)</span>
          </CheckboxLabel>
        </CheckboxContainer>
      </SettingsSection>
      
      {/* Next Steps Preferences - only shown if showNextSteps is true */}
      {settings.showNextSteps && (
        <SettingsSection>
          <SectionLabel>Next Steps Preferences</SectionLabel>
          <SectionDescription>
            Choose which types of next steps you'd like to see
          </SectionDescription>
          
          <CheckboxContainer>
            <CheckboxLabel htmlFor="next-step-practice">
              <CheckboxInput
                type="checkbox"
                id="next-step-practice"
                checked={settings.preferredNextSteps.includes('practice')}
                onChange={() => handleNextStepToggle('practice')}
              />
              <span>Practice exercises</span>
            </CheckboxLabel>
          </CheckboxContainer>
          
          <CheckboxContainer>
            <CheckboxLabel htmlFor="next-step-related">
              <CheckboxInput
                type="checkbox"
                id="next-step-related"
                checked={settings.preferredNextSteps.includes('related-concepts')}
                onChange={() => handleNextStepToggle('related-concepts')}
              />
              <span>Related concepts</span>
            </CheckboxLabel>
          </CheckboxContainer>
          
          <CheckboxContainer>
            <CheckboxLabel htmlFor="next-step-assessment">
              <CheckboxInput
                type="checkbox"
                id="next-step-assessment"
                checked={settings.preferredNextSteps.includes('assessment')}
                onChange={() => handleNextStepToggle('assessment')}
              />
              <span>Knowledge checks and quizzes</span>
            </CheckboxLabel>
          </CheckboxContainer>
          
          <CheckboxContainer>
            <CheckboxLabel htmlFor="next-step-review">
              <CheckboxInput
                type="checkbox"
                id="next-step-review"
                checked={settings.preferredNextSteps.includes('review')}
                onChange={() => handleNextStepToggle('review')}
              />
              <span>Review materials</span>
            </CheckboxLabel>
          </CheckboxContainer>
          
          <CheckboxContainer>
            <CheckboxLabel htmlFor="next-step-apply">
              <CheckboxInput
                type="checkbox"
                id="next-step-apply"
                checked={settings.preferredNextSteps.includes('apply')}
                onChange={() => handleNextStepToggle('apply')}
              />
              <span>Real-world applications</span>
            </CheckboxLabel>
          </CheckboxContainer>
        </SettingsSection>
      )}
      
      <Divider />
      
      {/* Reset button */}
      <ResetButton 
        onClick={handleResetSettings}
        aria-label="Reset all tutor settings to default values"
      >
        Reset to Default Settings
      </ResetButton>
      
      <HelperText>
        Your settings are automatically saved and will be remembered the next time you use the AI Tutor.
      </HelperText>
    </SettingsContainer>
  );
};

export default TutorSettingsPanel; 