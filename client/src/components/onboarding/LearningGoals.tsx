import React, { useState } from 'react';
import styled from 'styled-components';
import Button from '../common/Button';

interface LearningGoalsProps {
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

// Tag container
const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
`;

// Tag
const Tag = styled.span<{ isSelected: boolean }>`
  background-color: ${({ theme, isSelected }) => 
    isSelected ? theme.colors.primary : theme.colors.surface};
  color: ${({ theme, isSelected }) => 
    isSelected ? theme.colors.buttonText : theme.colors.text.primary};
  padding: 0.5rem 1rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 0.9rem;
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  border: 1px solid ${({ theme, isSelected }) => 
    isSelected ? theme.colors.primary : theme.colors.border};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${({ theme, isSelected }) => 
      isSelected ? theme.colors.primary : theme.colors.hover};
  }
  
  .reduced-motion & {
    transition: none;
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

// Topic categories for interests
const topicCategories = [
  {
    id: 'programming',
    title: 'Programming & Development',
    topics: [
      'Web Development',
      'Mobile App Development',
      'Game Development',
      'Data Science',
      'Machine Learning',
      'Cloud Computing',
      'DevOps',
      'Cybersecurity'
    ]
  },
  {
    id: 'design',
    title: 'Design & Creativity',
    topics: [
      'Graphic Design',
      'UI/UX Design',
      '3D Modeling',
      'Animation',
      'Digital Art',
      'Photography',
      'Video Editing',
      'Music Production'
    ]
  },
  {
    id: 'business',
    title: 'Business & Professional Skills',
    topics: [
      'Project Management',
      'Digital Marketing',
      'Entrepreneurship',
      'Communication Skills',
      'Leadership',
      'Finance',
      'Remote Work',
      'Productivity'
    ]
  },
  {
    id: 'personal',
    title: 'Personal Development',
    topics: [
      'Mindfulness',
      'Stress Management',
      'Time Management',
      'Social Skills',
      'Self-Advocacy',
      'Independent Living',
      'Health & Wellness',
      'Hobbies & Interests'
    ]
  }
];

const LearningGoals: React.FC<LearningGoalsProps> = ({ initialData, onSave }) => {
  // Initialize state with provided data or defaults
  const [goals, setGoals] = useState({
    primaryGoal: initialData.primaryGoal || '',
    topicInterests: initialData.topicInterests || [],
    timeCommitment: initialData.timeCommitment || '',
    challengeLevel: initialData.challengeLevel || '',
    specificGoals: initialData.specificGoals || ''
  });
  
  // Update a single goal
  const updateGoal = (key: string, value: any) => {
    setGoals(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  // Toggle a topic in the interests array
  const toggleTopic = (topic: string) => {
    setGoals(prev => {
      const currentTopics = [...prev.topicInterests];
      
      if (currentTopics.includes(topic)) {
        return {
          ...prev,
          topicInterests: currentTopics.filter(item => item !== topic)
        };
      } else {
        return {
          ...prev,
          topicInterests: [...currentTopics, topic]
        };
      }
    });
  };
  
  // Handle save
  const handleSave = () => {
    onSave(goals);
  };
  
  return (
    <Container>
      <h2>Learning Goals</h2>
      <p>
        Help us understand what you hope to achieve so we can tailor your learning experience
        to your goals and interests.
      </p>
      
      <Section>
        <SectionTitle>Your Learning Objectives</SectionTitle>
        <SectionDescription>
          Let us know what you're hoping to achieve through this learning platform.
        </SectionDescription>
        
        <OptionGroup>
          <OptionGroupTitle>What is your primary learning goal?</OptionGroupTitle>
          <RadioOptionContainer>
            <RadioOption>
              <RadioInput
                type="radio"
                name="primaryGoal"
                value="career-advancement"
                checked={goals.primaryGoal === 'career-advancement'}
                onChange={() => updateGoal('primaryGoal', 'career-advancement')}
                aria-label="Career advancement"
              />
              <OptionTextContainer>
                <OptionText>Career advancement</OptionText>
                <OptionDescription>
                  I want to develop skills to advance in my current career or field
                </OptionDescription>
              </OptionTextContainer>
            </RadioOption>
            
            <RadioOption>
              <RadioInput
                type="radio"
                name="primaryGoal"
                value="career-change"
                checked={goals.primaryGoal === 'career-change'}
                onChange={() => updateGoal('primaryGoal', 'career-change')}
                aria-label="Career change"
              />
              <OptionTextContainer>
                <OptionText>Career change</OptionText>
                <OptionDescription>
                  I want to learn skills for a new career or field
                </OptionDescription>
              </OptionTextContainer>
            </RadioOption>
            
            <RadioOption>
              <RadioInput
                type="radio"
                name="primaryGoal"
                value="personal-interest"
                checked={goals.primaryGoal === 'personal-interest'}
                onChange={() => updateGoal('primaryGoal', 'personal-interest')}
                aria-label="Personal interest"
              />
              <OptionTextContainer>
                <OptionText>Personal interest</OptionText>
                <OptionDescription>
                  I'm learning primarily out of curiosity or for a hobby
                </OptionDescription>
              </OptionTextContainer>
            </RadioOption>
            
            <RadioOption>
              <RadioInput
                type="radio"
                name="primaryGoal"
                value="specific-project"
                checked={goals.primaryGoal === 'specific-project'}
                onChange={() => updateGoal('primaryGoal', 'specific-project')}
                aria-label="Specific project"
              />
              <OptionTextContainer>
                <OptionText>Specific project</OptionText>
                <OptionDescription>
                  I want to learn skills for a specific project or task
                </OptionDescription>
              </OptionTextContainer>
            </RadioOption>
            
            <RadioOption>
              <RadioInput
                type="radio"
                name="primaryGoal"
                value="life-skills"
                checked={goals.primaryGoal === 'life-skills'}
                onChange={() => updateGoal('primaryGoal', 'life-skills')}
                aria-label="Life skills"
              />
              <OptionTextContainer>
                <OptionText>Life skills</OptionText>
                <OptionDescription>
                  I want to develop skills for independent living and personal growth
                </OptionDescription>
              </OptionTextContainer>
            </RadioOption>
          </RadioOptionContainer>
        </OptionGroup>
        
        <OptionGroup>
          <OptionGroupTitle>How much time can you commit to learning each week?</OptionGroupTitle>
          <RadioOptionContainer>
            <RadioOption>
              <RadioInput
                type="radio"
                name="timeCommitment"
                value="minimal"
                checked={goals.timeCommitment === 'minimal'}
                onChange={() => updateGoal('timeCommitment', 'minimal')}
                aria-label="Minimal time commitment"
              />
              <OptionTextContainer>
                <OptionText>Minimal (1-2 hours/week)</OptionText>
                <OptionDescription>
                  I have very limited time available for learning
                </OptionDescription>
              </OptionTextContainer>
            </RadioOption>
            
            <RadioOption>
              <RadioInput
                type="radio"
                name="timeCommitment"
                value="moderate"
                checked={goals.timeCommitment === 'moderate'}
                onChange={() => updateGoal('timeCommitment', 'moderate')}
                aria-label="Moderate time commitment"
              />
              <OptionTextContainer>
                <OptionText>Moderate (3-5 hours/week)</OptionText>
                <OptionDescription>
                  I can dedicate a few hours each week to learning
                </OptionDescription>
              </OptionTextContainer>
            </RadioOption>
            
            <RadioOption>
              <RadioInput
                type="radio"
                name="timeCommitment"
                value="substantial"
                checked={goals.timeCommitment === 'substantial'}
                onChange={() => updateGoal('timeCommitment', 'substantial')}
                aria-label="Substantial time commitment"
              />
              <OptionTextContainer>
                <OptionText>Substantial (6-10 hours/week)</OptionText>
                <OptionDescription>
                  I can commit significant time to learning each week
                </OptionDescription>
              </OptionTextContainer>
            </RadioOption>
            
            <RadioOption>
              <RadioInput
                type="radio"
                name="timeCommitment"
                value="intensive"
                checked={goals.timeCommitment === 'intensive'}
                onChange={() => updateGoal('timeCommitment', 'intensive')}
                aria-label="Intensive time commitment"
              />
              <OptionTextContainer>
                <OptionText>Intensive (10+ hours/week)</OptionText>
                <OptionDescription>
                  I'm able to dedicate substantial time to learning
                </OptionDescription>
              </OptionTextContainer>
            </RadioOption>
          </RadioOptionContainer>
        </OptionGroup>
        
        <OptionGroup>
          <OptionGroupTitle>What level of challenge do you prefer?</OptionGroupTitle>
          <RadioOptionContainer>
            <RadioOption>
              <RadioInput
                type="radio"
                name="challengeLevel"
                value="gentle"
                checked={goals.challengeLevel === 'gentle'}
                onChange={() => updateGoal('challengeLevel', 'gentle')}
                aria-label="Gentle pace"
              />
              <OptionTextContainer>
                <OptionText>Gentle pace</OptionText>
                <OptionDescription>
                  I prefer a relaxed approach with plenty of review and reinforcement
                </OptionDescription>
              </OptionTextContainer>
            </RadioOption>
            
            <RadioOption>
              <RadioInput
                type="radio"
                name="challengeLevel"
                value="moderate"
                checked={goals.challengeLevel === 'moderate'}
                onChange={() => updateGoal('challengeLevel', 'moderate')}
                aria-label="Moderate challenge"
              />
              <OptionTextContainer>
                <OptionText>Moderate challenge</OptionText>
                <OptionDescription>
                  I like to be challenged but with support available when needed
                </OptionDescription>
              </OptionTextContainer>
            </RadioOption>
            
            <RadioOption>
              <RadioInput
                type="radio"
                name="challengeLevel"
                value="ambitious"
                checked={goals.challengeLevel === 'ambitious'}
                onChange={() => updateGoal('challengeLevel', 'ambitious')}
                aria-label="Ambitious pace"
              />
              <OptionTextContainer>
                <OptionText>Ambitious pace</OptionText>
                <OptionDescription>
                  I enjoy being challenged and pushing my limits
                </OptionDescription>
              </OptionTextContainer>
            </RadioOption>
            
            <RadioOption>
              <RadioInput
                type="radio"
                name="challengeLevel"
                value="adaptive"
                checked={goals.challengeLevel === 'adaptive'}
                onChange={() => updateGoal('challengeLevel', 'adaptive')}
                aria-label="Adaptive difficulty"
              />
              <OptionTextContainer>
                <OptionText>Adaptive difficulty</OptionText>
                <OptionDescription>
                  I prefer the system to adjust difficulty based on my performance
                </OptionDescription>
              </OptionTextContainer>
            </RadioOption>
          </RadioOptionContainer>
        </OptionGroup>
      </Section>
      
      <Section>
        <SectionTitle>Topics of Interest</SectionTitle>
        <SectionDescription>
          Select topics you're interested in learning about. This helps us recommend relevant courses and content.
        </SectionDescription>
        
        {topicCategories.map(category => (
          <OptionGroup key={category.id}>
            <OptionGroupTitle>{category.title}</OptionGroupTitle>
            <TagContainer>
              {category.topics.map(topic => (
                <Tag
                  key={topic}
                  isSelected={goals.topicInterests.includes(topic)}
                  onClick={() => toggleTopic(topic)}
                >
                  {topic}
                </Tag>
              ))}
            </TagContainer>
          </OptionGroup>
        ))}
        
        <TextAreaContainer>
          <TextAreaLabel htmlFor="specificGoals">
            Do you have any specific learning goals or topics not listed above?
          </TextAreaLabel>
          <TextArea
            id="specificGoals"
            value={goals.specificGoals}
            onChange={(e) => updateGoal('specificGoals', e.target.value)}
            placeholder="Describe any specific skills, projects, or topics you'd like to learn about..."
          />
          <HelperText>
            This information will help us tailor course recommendations to your interests.
          </HelperText>
        </TextAreaContainer>
      </Section>
      
      <ButtonContainer>
        <Button
          variant="primary"
          onClick={handleSave}
          ariaLabel="Save learning goals"
        >
          Save Goals
        </Button>
      </ButtonContainer>
    </Container>
  );
};

export default LearningGoals; 