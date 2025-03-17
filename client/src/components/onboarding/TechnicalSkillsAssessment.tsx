import React, { useState } from 'react';
import styled from 'styled-components';
import Button from '../common/Button';

interface TechnicalSkillsAssessmentProps {
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

// Skill category container
const SkillCategoryContainer = styled.div`
  margin-bottom: 2rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

// Skill category title
const SkillCategoryTitle = styled.h4`
  font-size: 1.1rem;
  margin-bottom: 1rem;
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  color: ${({ theme }) => theme.colors.text.primary};
`;

// Skill item container
const SkillItemContainer = styled.div`
  margin-bottom: 1.25rem;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  
  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }
`;

// Skill name
const SkillName = styled.div`
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  margin-bottom: 0.5rem;
`;

// Skill description
const SkillDescription = styled.p`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 0.75rem;
  line-height: 1.4;
`;

// Slider container
const SliderContainer = styled.div`
  margin-top: 1rem;
`;

// Slider labels container
const SliderLabelsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
`;

// Slider label
const SliderLabel = styled.span`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

// Custom slider styling
const SliderInput = styled.input`
  width: 100%;
  height: 8px;
  background: ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  outline: none;
  -webkit-appearance: none;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.primary};
    cursor: pointer;
  }
  
  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.primary};
    cursor: pointer;
    border: none;
  }
  
  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.focus};
    outline-offset: 2px;
  }
`;

// Selected value display
const SelectedValue = styled.div`
  text-align: center;
  margin-top: 0.5rem;
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  color: ${({ theme }) => theme.colors.primary};
`;

// Progress bar container
const ProgressBarContainer = styled.div`
  width: 100%;
  height: 8px;
  background-color: ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
`;

// Progress bar fill
const ProgressBarFill = styled.div<{ width: number }>`
  height: 100%;
  width: ${({ width }) => `${width}%`};
  background-color: ${({ theme }) => theme.colors.primary};
  transition: width 0.3s ease-out;
  
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

// Save button container
const ButtonContainer = styled.div`
  margin-top: 2rem;
  display: flex;
  justify-content: flex-end;
`;

// Results summary container
const ResultsSummary = styled.div`
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

// Results title
const ResultsTitle = styled.h4`
  font-size: 1.1rem;
  margin-bottom: 1rem;
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
`;

// Results description
const ResultsDescription = styled.p`
  margin-bottom: 1rem;
  line-height: 1.5;
`;

// Skill level descriptions
const skillLevelDescriptions = [
  'No experience',
  'Beginner',
  'Intermediate',
  'Advanced',
  'Expert'
];

// Technical skills categories and items
const technicalSkillsCategories = [
  {
    id: 'computer-basics',
    title: 'Computer Basics',
    skills: [
      {
        id: 'operating-system',
        name: 'Operating System Usage',
        description: 'Familiarity with navigating and using computer operating systems (Windows, macOS, etc.)'
      },
      {
        id: 'file-management',
        name: 'File Management',
        description: 'Ability to create, organize, find, and manage files and folders'
      },
      {
        id: 'keyboard-shortcuts',
        name: 'Keyboard Shortcuts',
        description: 'Knowledge and use of keyboard shortcuts to navigate and perform tasks efficiently'
      }
    ]
  },
  {
    id: 'internet',
    title: 'Internet Skills',
    skills: [
      {
        id: 'web-browsing',
        name: 'Web Browsing',
        description: 'Ability to navigate websites, use search engines, and manage browser tabs/bookmarks'
      },
      {
        id: 'online-communication',
        name: 'Online Communication',
        description: 'Experience with email, messaging platforms, and video conferencing tools'
      },
      {
        id: 'online-security',
        name: 'Online Security Awareness',
        description: 'Understanding of basic online security practices (passwords, privacy settings, etc.)'
      }
    ]
  },
  {
    id: 'software',
    title: 'Software Applications',
    skills: [
      {
        id: 'productivity-tools',
        name: 'Productivity Tools',
        description: 'Experience with word processors, spreadsheets, and presentation software'
      },
      {
        id: 'media-tools',
        name: 'Media Tools',
        description: 'Familiarity with photo, audio, or video editing applications'
      },
      {
        id: 'learning-platforms',
        name: 'Learning Platforms',
        description: 'Previous experience with online learning platforms or educational software'
      }
    ]
  },
  {
    id: 'programming',
    title: 'Programming & Technical Skills',
    skills: [
      {
        id: 'coding-experience',
        name: 'Coding Experience',
        description: 'Any experience with programming languages or coding concepts'
      },
      {
        id: 'data-analysis',
        name: 'Data Analysis',
        description: 'Experience working with data, statistics, or data visualization'
      },
      {
        id: 'problem-solving',
        name: 'Technical Problem Solving',
        description: 'Ability to troubleshoot and resolve technical issues independently'
      }
    ]
  }
];

const TechnicalSkillsAssessment: React.FC<TechnicalSkillsAssessmentProps> = ({ initialData, onSave }) => {
  // Initialize state with provided data or defaults
  const [skillLevels, setSkillLevels] = useState<Record<string, number>>(
    initialData.skillLevels || {}
  );
  
  // Calculate completion percentage
  const calculateCompletion = () => {
    const totalSkills = technicalSkillsCategories.reduce(
      (total, category) => total + category.skills.length, 
      0
    );
    
    const ratedSkills = Object.keys(skillLevels).length;
    return (ratedSkills / totalSkills) * 100;
  };
  
  // Handle skill level change
  const handleSkillLevelChange = (skillId: string, level: number) => {
    setSkillLevels(prev => ({
      ...prev,
      [skillId]: level
    }));
  };
  
  // Calculate average skill level for a category
  const calculateCategoryAverage = (categoryId: string) => {
    const category = technicalSkillsCategories.find(cat => cat.id === categoryId);
    if (!category) return 0;
    
    let sum = 0;
    let count = 0;
    
    category.skills.forEach(skill => {
      if (skillLevels[skill.id] !== undefined) {
        sum += skillLevels[skill.id];
        count++;
      }
    });
    
    return count > 0 ? sum / count : 0;
  };
  
  // Calculate overall technical proficiency
  const calculateOverallProficiency = () => {
    let sum = 0;
    let count = 0;
    
    Object.values(skillLevels).forEach(level => {
      sum += level;
      count++;
    });
    
    return count > 0 ? sum / count : 0;
  };
  
  // Determine proficiency level text
  const getProficiencyLevelText = (score: number) => {
    if (score < 1) return 'Beginner';
    if (score < 2) return 'Basic';
    if (score < 3) return 'Intermediate';
    if (score < 4) return 'Advanced';
    return 'Expert';
  };
  
  // Handle save
  const handleSave = () => {
    const categoryAverages = technicalSkillsCategories.reduce((acc, category) => {
      acc[category.id] = calculateCategoryAverage(category.id);
      return acc;
    }, {} as Record<string, number>);
    
    const overallProficiency = calculateOverallProficiency();
    
    onSave({
      skillLevels,
      categoryAverages,
      overallProficiency,
      proficiencyLevel: getProficiencyLevelText(overallProficiency),
      completionPercentage: calculateCompletion()
    });
  };
  
  // Check if assessment is complete
  const isComplete = calculateCompletion() === 100;
  
  return (
    <Container>
      <h2>Technical Skills Assessment</h2>
      <p>
        This assessment helps us understand your current technical skills and experience.
        Rate your proficiency in each area to help us tailor the course content to your skill level.
      </p>
      
      <ProgressBarContainer aria-label="Assessment completion progress">
        <ProgressBarFill width={calculateCompletion()} />
      </ProgressBarContainer>
      <HelperText>
        {Math.round(calculateCompletion())}% complete
      </HelperText>
      
      <Section>
        <SectionTitle>Rate Your Technical Skills</SectionTitle>
        <SectionDescription>
          For each skill, move the slider to indicate your current level of proficiency.
          Don't worry if you're a beginner - this helps us provide the right level of support.
        </SectionDescription>
        
        {technicalSkillsCategories.map(category => (
          <SkillCategoryContainer key={category.id}>
            <SkillCategoryTitle>{category.title}</SkillCategoryTitle>
            
            {category.skills.map(skill => (
              <SkillItemContainer key={skill.id}>
                <SkillName>{skill.name}</SkillName>
                <SkillDescription>{skill.description}</SkillDescription>
                
                <SliderContainer>
                  <SliderLabelsContainer>
                    <SliderLabel>No experience</SliderLabel>
                    <SliderLabel>Expert</SliderLabel>
                  </SliderLabelsContainer>
                  
                  <SliderInput
                    type="range"
                    min={0}
                    max={4}
                    step={1}
                    value={skillLevels[skill.id] || 0}
                    onChange={(e) => handleSkillLevelChange(skill.id, parseInt(e.target.value))}
                    aria-label={`Rate your ${skill.name} skill level`}
                  />
                  
                  <SelectedValue>
                    {skillLevelDescriptions[skillLevels[skill.id] || 0]}
                  </SelectedValue>
                </SliderContainer>
              </SkillItemContainer>
            ))}
          </SkillCategoryContainer>
        ))}
        
        {isComplete && (
          <ResultsSummary>
            <ResultsTitle>Your Technical Proficiency Summary</ResultsTitle>
            <ResultsDescription>
              Based on your self-assessment, here's a summary of your technical proficiency levels:
            </ResultsDescription>
            
            {technicalSkillsCategories.map(category => {
              const average = calculateCategoryAverage(category.id);
              return (
                <div key={category.id} style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span>{category.title}:</span>
                    <span>{getProficiencyLevelText(average)}</span>
                  </div>
                  <ProgressBarContainer>
                    <ProgressBarFill width={(average / 4) * 100} />
                  </ProgressBarContainer>
                </div>
              );
            })}
            
            <div style={{ marginTop: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <strong>Overall Technical Proficiency:</strong>
                <strong>{getProficiencyLevelText(calculateOverallProficiency())}</strong>
              </div>
              <ProgressBarContainer>
                <ProgressBarFill width={(calculateOverallProficiency() / 4) * 100} />
              </ProgressBarContainer>
            </div>
            
            <HelperText>
              This assessment will help us customize your learning path, but you can always
              adjust the difficulty level of content later.
            </HelperText>
          </ResultsSummary>
        )}
      </Section>
      
      <ButtonContainer>
        <Button
          variant="primary"
          onClick={handleSave}
          ariaLabel="Save technical skills assessment"
          disabled={Object.keys(skillLevels).length === 0}
        >
          {isComplete ? 'Save and Continue' : 'Save Progress'}
        </Button>
      </ButtonContainer>
    </Container>
  );
};

export default TechnicalSkillsAssessment; 