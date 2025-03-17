import React, { useState } from 'react';
import styled from 'styled-components';
import Button from '../common/Button';

interface CommunicationPreferencesProps {
  initialData: Record<string, any>;
  onSave: (data: Record<string, any>) => void;
}

// Container for the entire component
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

// Section container
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

// Option group container
const OptionGroup = styled.div`
  margin-bottom: 2rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

// Option group title
const OptionGroupTitle = styled.h4`
  font-size: 1.1rem;
  margin-bottom: 1rem;
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
`;

// Radio option container
const RadioOptionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
`;

// Radio option
const RadioOption = styled.label`
  display: flex;
  align-items: flex-start;
  cursor: pointer;
  padding: 0.75rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.hover};
  }
  
  .reduced-motion & {
    transition: none;
  }
`;

// Radio input
const RadioInput = styled.input`
  margin-right: 0.75rem;
  margin-top: 0.25rem;
  min-width: 18px;
  height: 18px;
`;

// Option text container
const OptionTextContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

// Option text
const OptionText = styled.span`
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
`;

// Option description
const OptionDescription = styled.span`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-top: 0.25rem;
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

// Text area container
const TextAreaContainer = styled.div`
  margin-top: 1rem;
`;

// Text area label
const TextAreaLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
`;

// Text area
const TextArea = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: 0.75rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.inputBackground};
  color: ${({ theme }) => theme.colors.text.primary};
  font-family: inherit;
  font-size: 1rem;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary + '33'};
  }
`;

// Helper text
const HelperText = styled.p`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.text.hint};
  margin-top: 0.5rem;
  font-style: italic;
`;

// Button container
const ButtonContainer = styled.div`
  margin-top: 2rem;
  display: flex;
  justify-content: flex-end;
`;

const CommunicationPreferences: React.FC<CommunicationPreferencesProps> = ({ initialData, onSave }) => {
  // Initialize state with provided data or defaults
  const [preferences, setPreferences] = useState({
    communicationStyle: initialData.communicationStyle || '',
    feedbackPreference: initialData.feedbackPreference || '',
    interactionMode: initialData.interactionMode || '',
    socialPreference: initialData.socialPreference || '',
    accommodations: initialData.accommodations || [],
    additionalNotes: initialData.additionalNotes || ''
  });
  
  // Update a single preference
  const updatePreference = (key: string, value: any) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
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
      <h2>Communication Preferences</h2>
      <p>
        Help us understand how you prefer to communicate and interact during your learning journey.
        This information will help us provide the right level of support and interaction.
      </p>
      
      <Section>
        <SectionTitle>Communication Style</SectionTitle>
        <SectionDescription>
          Let us know how you prefer to communicate and receive information.
        </SectionDescription>
        
        <OptionGroup>
          <OptionGroupTitle>How do you prefer to communicate with instructors?</OptionGroupTitle>
          <RadioOptionContainer>
            <RadioOption>
              <RadioInput
                type="radio"
                name="communicationStyle"
                value="direct"
                checked={preferences.communicationStyle === 'direct'}
                onChange={() => updatePreference('communicationStyle', 'direct')}
                aria-label="Direct and explicit communication"
              />
              <OptionTextContainer>
                <OptionText>Direct and explicit</OptionText>
                <OptionDescription>
                  I prefer clear, straightforward communication with specific instructions
                </OptionDescription>
              </OptionTextContainer>
            </RadioOption>
            
            <RadioOption>
              <RadioInput
                type="radio"
                name="communicationStyle"
                value="supportive"
                checked={preferences.communicationStyle === 'supportive'}
                onChange={() => updatePreference('communicationStyle', 'supportive')}
                aria-label="Supportive and encouraging communication"
              />
              <OptionTextContainer>
                <OptionText>Supportive and encouraging</OptionText>
                <OptionDescription>
                  I prefer communication that includes positive reinforcement and encouragement
                </OptionDescription>
              </OptionTextContainer>
            </RadioOption>
            
            <RadioOption>
              <RadioInput
                type="radio"
                name="communicationStyle"
                value="minimal"
                checked={preferences.communicationStyle === 'minimal'}
                onChange={() => updatePreference('communicationStyle', 'minimal')}
                aria-label="Minimal communication"
              />
              <OptionTextContainer>
                <OptionText>Minimal</OptionText>
                <OptionDescription>
                  I prefer less frequent communication, focused only on essential information
                </OptionDescription>
              </OptionTextContainer>
            </RadioOption>
            
            <RadioOption>
              <RadioInput
                type="radio"
                name="communicationStyle"
                value="visual"
                checked={preferences.communicationStyle === 'visual'}
                onChange={() => updatePreference('communicationStyle', 'visual')}
                aria-label="Visual communication"
              />
              <OptionTextContainer>
                <OptionText>Visual</OptionText>
                <OptionDescription>
                  I prefer communication that includes visual aids, diagrams, or demonstrations
                </OptionDescription>
              </OptionTextContainer>
            </RadioOption>
          </RadioOptionContainer>
        </OptionGroup>
        
        <OptionGroup>
          <OptionGroupTitle>What type of feedback helps you learn best?</OptionGroupTitle>
          <RadioOptionContainer>
            <RadioOption>
              <RadioInput
                type="radio"
                name="feedbackPreference"
                value="immediate"
                checked={preferences.feedbackPreference === 'immediate'}
                onChange={() => updatePreference('feedbackPreference', 'immediate')}
                aria-label="Immediate feedback"
              />
              <OptionTextContainer>
                <OptionText>Immediate feedback</OptionText>
                <OptionDescription>
                  I prefer to know right away if I'm on the right track
                </OptionDescription>
              </OptionTextContainer>
            </RadioOption>
            
            <RadioOption>
              <RadioInput
                type="radio"
                name="feedbackPreference"
                value="detailed"
                checked={preferences.feedbackPreference === 'detailed'}
                onChange={() => updatePreference('feedbackPreference', 'detailed')}
                aria-label="Detailed explanations"
              />
              <OptionTextContainer>
                <OptionText>Detailed explanations</OptionText>
                <OptionDescription>
                  I prefer thorough explanations of what I did right or wrong
                </OptionDescription>
              </OptionTextContainer>
            </RadioOption>
            
            <RadioOption>
              <RadioInput
                type="radio"
                name="feedbackPreference"
                value="gentle"
                checked={preferences.feedbackPreference === 'gentle'}
                onChange={() => updatePreference('feedbackPreference', 'gentle')}
                aria-label="Gentle guidance"
              />
              <OptionTextContainer>
                <OptionText>Gentle guidance</OptionText>
                <OptionDescription>
                  I prefer supportive feedback that focuses on improvement
                </OptionDescription>
              </OptionTextContainer>
            </RadioOption>
            
            <RadioOption>
              <RadioInput
                type="radio"
                name="feedbackPreference"
                value="self-assessment"
                checked={preferences.feedbackPreference === 'self-assessment'}
                onChange={() => updatePreference('feedbackPreference', 'self-assessment')}
                aria-label="Self-assessment tools"
              />
              <OptionTextContainer>
                <OptionText>Self-assessment tools</OptionText>
                <OptionDescription>
                  I prefer to evaluate my own progress with the right tools
                </OptionDescription>
              </OptionTextContainer>
            </RadioOption>
          </RadioOptionContainer>
        </OptionGroup>
      </Section>
      
      <Section>
        <SectionTitle>Interaction Preferences</SectionTitle>
        <SectionDescription>
          Let us know how you prefer to interact with the platform and other learners.
        </SectionDescription>
        
        <OptionGroup>
          <OptionGroupTitle>How do you prefer to interact with the learning platform?</OptionGroupTitle>
          <RadioOptionContainer>
            <RadioOption>
              <RadioInput
                type="radio"
                name="interactionMode"
                value="text-based"
                checked={preferences.interactionMode === 'text-based'}
                onChange={() => updatePreference('interactionMode', 'text-based')}
                aria-label="Text-based interaction"
              />
              <OptionTextContainer>
                <OptionText>Text-based</OptionText>
                <OptionDescription>
                  I prefer reading and writing text for communication
                </OptionDescription>
              </OptionTextContainer>
            </RadioOption>
            
            <RadioOption>
              <RadioInput
                type="radio"
                name="interactionMode"
                value="visual"
                checked={preferences.interactionMode === 'visual'}
                onChange={() => updatePreference('interactionMode', 'visual')}
                aria-label="Visual interaction"
              />
              <OptionTextContainer>
                <OptionText>Visual</OptionText>
                <OptionDescription>
                  I prefer visual interfaces with diagrams, charts, and images
                </OptionDescription>
              </OptionTextContainer>
            </RadioOption>
            
            <RadioOption>
              <RadioInput
                type="radio"
                name="interactionMode"
                value="audio"
                checked={preferences.interactionMode === 'audio'}
                onChange={() => updatePreference('interactionMode', 'audio')}
                aria-label="Audio interaction"
              />
              <OptionTextContainer>
                <OptionText>Audio</OptionText>
                <OptionDescription>
                  I prefer listening and speaking for communication
                </OptionDescription>
              </OptionTextContainer>
            </RadioOption>
            
            <RadioOption>
              <RadioInput
                type="radio"
                name="interactionMode"
                value="mixed"
                checked={preferences.interactionMode === 'mixed'}
                onChange={() => updatePreference('interactionMode', 'mixed')}
                aria-label="Mixed interaction modes"
              />
              <OptionTextContainer>
                <OptionText>Mixed</OptionText>
                <OptionDescription>
                  I prefer a combination of text, visual, and audio communication
                </OptionDescription>
              </OptionTextContainer>
            </RadioOption>
          </RadioOptionContainer>
        </OptionGroup>
        
        <OptionGroup>
          <OptionGroupTitle>What is your preference for social learning?</OptionGroupTitle>
          <RadioOptionContainer>
            <RadioOption>
              <RadioInput
                type="radio"
                name="socialPreference"
                value="independent"
                checked={preferences.socialPreference === 'independent'}
                onChange={() => updatePreference('socialPreference', 'independent')}
                aria-label="Independent learning"
              />
              <OptionTextContainer>
                <OptionText>Independent learning</OptionText>
                <OptionDescription>
                  I prefer to learn on my own without group activities
                </OptionDescription>
              </OptionTextContainer>
            </RadioOption>
            
            <RadioOption>
              <RadioInput
                type="radio"
                name="socialPreference"
                value="one-on-one"
                checked={preferences.socialPreference === 'one-on-one'}
                onChange={() => updatePreference('socialPreference', 'one-on-one')}
                aria-label="One-on-one support"
              />
              <OptionTextContainer>
                <OptionText>One-on-one support</OptionText>
                <OptionDescription>
                  I prefer individual interaction with an instructor or tutor
                </OptionDescription>
              </OptionTextContainer>
            </RadioOption>
            
            <RadioOption>
              <RadioInput
                type="radio"
                name="socialPreference"
                value="small-group"
                checked={preferences.socialPreference === 'small-group'}
                onChange={() => updatePreference('socialPreference', 'small-group')}
                aria-label="Small group learning"
              />
              <OptionTextContainer>
                <OptionText>Small group learning</OptionText>
                <OptionDescription>
                  I prefer learning in small groups (2-5 people)
                </OptionDescription>
              </OptionTextContainer>
            </RadioOption>
            
            <RadioOption>
              <RadioInput
                type="radio"
                name="socialPreference"
                value="community"
                checked={preferences.socialPreference === 'community'}
                onChange={() => updatePreference('socialPreference', 'community')}
                aria-label="Community learning"
              />
              <OptionTextContainer>
                <OptionText>Community learning</OptionText>
                <OptionDescription>
                  I enjoy being part of a larger learning community with forums and discussions
                </OptionDescription>
              </OptionTextContainer>
            </RadioOption>
          </RadioOptionContainer>
        </OptionGroup>
      </Section>
      
      <Section>
        <SectionTitle>Additional Accommodations</SectionTitle>
        <SectionDescription>
          Let us know if you need any specific accommodations for communication.
        </SectionDescription>
        
        <OptionGroup>
          <OptionGroupTitle>Select any accommodations that would help you:</OptionGroupTitle>
          
          <CheckboxContainer>
            <CheckboxLabel>
              <CheckboxInput
                type="checkbox"
                checked={preferences.accommodations.includes('extra-time')}
                onChange={() => toggleArrayPreference('accommodations', 'extra-time')}
              />
              Extra time to process information and respond
            </CheckboxLabel>
          </CheckboxContainer>
          
          <CheckboxContainer>
            <CheckboxLabel>
              <CheckboxInput
                type="checkbox"
                checked={preferences.accommodations.includes('written-instructions')}
                onChange={() => toggleArrayPreference('accommodations', 'written-instructions')}
              />
              Written instructions to accompany verbal explanations
            </CheckboxLabel>
          </CheckboxContainer>
          
          <CheckboxContainer>
            <CheckboxLabel>
              <CheckboxInput
                type="checkbox"
                checked={preferences.accommodations.includes('visual-supports')}
                onChange={() => toggleArrayPreference('accommodations', 'visual-supports')}
              />
              Visual supports (diagrams, charts, etc.)
            </CheckboxLabel>
          </CheckboxContainer>
          
          <CheckboxContainer>
            <CheckboxLabel>
              <CheckboxInput
                type="checkbox"
                checked={preferences.accommodations.includes('simplified-language')}
                onChange={() => toggleArrayPreference('accommodations', 'simplified-language')}
              />
              Simplified language without idioms or figurative speech
            </CheckboxLabel>
          </CheckboxContainer>
          
          <CheckboxContainer>
            <CheckboxLabel>
              <CheckboxInput
                type="checkbox"
                checked={preferences.accommodations.includes('text-to-speech')}
                onChange={() => toggleArrayPreference('accommodations', 'text-to-speech')}
              />
              Text-to-speech functionality
            </CheckboxLabel>
          </CheckboxContainer>
          
          <CheckboxContainer>
            <CheckboxLabel>
              <CheckboxInput
                type="checkbox"
                checked={preferences.accommodations.includes('speech-to-text')}
                onChange={() => toggleArrayPreference('accommodations', 'speech-to-text')}
              />
              Speech-to-text functionality
            </CheckboxLabel>
          </CheckboxContainer>
          
          <TextAreaContainer>
            <TextAreaLabel htmlFor="additionalNotes">
              Is there anything else we should know about your communication preferences?
            </TextAreaLabel>
            <TextArea
              id="additionalNotes"
              value={preferences.additionalNotes}
              onChange={(e) => updatePreference('additionalNotes', e.target.value)}
              placeholder="Share any additional information that would help us communicate effectively with you..."
            />
            <HelperText>
              This information will only be used to improve your learning experience.
            </HelperText>
          </TextAreaContainer>
        </OptionGroup>
      </Section>
      
      <ButtonContainer>
        <Button
          variant="primary"
          onClick={handleSave}
          ariaLabel="Save communication preferences"
        >
          Save Preferences
        </Button>
      </ButtonContainer>
    </Container>
  );
};

export default CommunicationPreferences; 