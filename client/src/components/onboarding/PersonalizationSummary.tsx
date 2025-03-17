import React from 'react';
import styled from 'styled-components';
import Button from '../common/Button';

interface PersonalizationSummaryProps {
  assessmentData: {
    sensoryPreferences: Record<string, any>;
    learningStyleResults: Record<string, any>;
    technicalSkillsResults: Record<string, any>;
    communicationPreferences: Record<string, any>;
    learningGoals: Record<string, any>;
    accessibilityNeeds: Record<string, any>;
  };
  onComplete: () => void;
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

// Summary item container
const SummaryItem = styled.div`
  margin-bottom: 1.25rem;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  
  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }
`;

// Summary item title
const SummaryItemTitle = styled.h4`
  font-size: 1.1rem;
  margin-bottom: 0.75rem;
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
`;

// Summary content
const SummaryContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

// Summary row
const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  
  @media (max-width: 600px) {
    flex-direction: column;
    gap: 0.25rem;
  }
`;

// Summary label
const SummaryLabel = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  flex: 1;
`;

// Summary value
const SummaryValue = styled.span`
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  flex: 2;
  text-align: right;
  
  @media (max-width: 600px) {
    text-align: left;
  }
`;

// Tag container
const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

// Tag
const Tag = styled.span`
  background-color: ${({ theme }) => theme.colors.primary + '22'};
  color: ${({ theme }) => theme.colors.primary};
  padding: 0.25rem 0.75rem;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: 0.9rem;
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
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
  justify-content: center;
`;

// Skipped section notice
const SkippedSection = styled.div`
  font-style: italic;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

// Progress indicator
const ProgressIndicator = styled.div<{ percentage: number }>`
  width: ${({ percentage }) => `${percentage}%`};
  height: 8px;
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: 4px;
  margin-bottom: 0.5rem;
`;

// Progress container
const ProgressContainer = styled.div`
  width: 100%;
  height: 8px;
  background-color: ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  overflow: hidden;
  margin-top: 0.5rem;
`;

const PersonalizationSummary: React.FC<PersonalizationSummaryProps> = ({ 
  assessmentData, 
  onComplete 
}) => {
  // Helper function to check if a section was skipped
  const isSectionSkipped = (sectionData: Record<string, any>) => {
    return !sectionData || Object.keys(sectionData).length === 0 || sectionData.skipped;
  };
  
  // Format sensory preferences for display
  const formatSensoryPreferences = () => {
    const prefs = assessmentData.sensoryPreferences;
    if (isSectionSkipped(prefs)) return null;
    
    return (
      <SummaryContent>
        <SummaryRow>
          <SummaryLabel>Theme Preference:</SummaryLabel>
          <SummaryValue>
            {prefs.theme === 'light' && 'Light'}
            {prefs.theme === 'dark' && 'Dark'}
            {prefs.theme === 'high-contrast' && 'High Contrast'}
            {prefs.theme === 'low-blue' && 'Low Blue Light'}
            {prefs.theme === 'neutral' && 'Neutral'}
          </SummaryValue>
        </SummaryRow>
        
        <SummaryRow>
          <SummaryLabel>Font Size:</SummaryLabel>
          <SummaryValue>{prefs.fontSize}</SummaryValue>
        </SummaryRow>
        
        <SummaryRow>
          <SummaryLabel>Font Family:</SummaryLabel>
          <SummaryValue>
            {prefs.fontFamily === 'system' && 'System Default'}
            {prefs.fontFamily === 'sans-serif' && 'Sans-serif'}
            {prefs.fontFamily === 'serif' && 'Serif'}
            {prefs.fontFamily === 'dyslexic' && 'OpenDyslexic'}
          </SummaryValue>
        </SummaryRow>
        
        <SummaryRow>
          <SummaryLabel>Motion Preferences:</SummaryLabel>
          <SummaryValue>
            {prefs.reducedMotion ? 'Reduced animations' : 'Standard animations'}
          </SummaryValue>
        </SummaryRow>
        
        <SummaryRow>
          <SummaryLabel>Sound Sensitivity:</SummaryLabel>
          <SummaryValue>
            {prefs.soundSensitivity === 'low' && 'Low (Regular volume)'}
            {prefs.soundSensitivity === 'medium' && 'Medium (Reduced volume)'}
            {prefs.soundSensitivity === 'high' && 'High (Minimal audio)'}
          </SummaryValue>
        </SummaryRow>
        
        <SummaryRow>
          <SummaryLabel>Video Preferences:</SummaryLabel>
          <SummaryValue>
            {prefs.videoAutoplay ? 'Autoplay enabled' : 'Autoplay disabled'}, 
            {prefs.captionsEnabled ? ' Captions enabled' : ' Captions disabled'}
          </SummaryValue>
        </SummaryRow>
        
        {prefs.colorSensitivity && prefs.colorSensitivity.length > 0 && (
          <SummaryRow>
            <SummaryLabel>Color Sensitivities:</SummaryLabel>
            <SummaryValue>
              <TagContainer>
                {prefs.colorSensitivity.map((sensitivity: string) => (
                  <Tag key={sensitivity}>{sensitivity.replace('-', ' ')}</Tag>
                ))}
              </TagContainer>
            </SummaryValue>
          </SummaryRow>
        )}
      </SummaryContent>
    );
  };
  
  // Format learning style results for display
  const formatLearningStyleResults = () => {
    const results = assessmentData.learningStyleResults;
    if (isSectionSkipped(results) || !results.results) return null;
    
    return (
      <SummaryContent>
        <SummaryRow>
          <SummaryLabel>Information Processing:</SummaryLabel>
          <SummaryValue>
            {results.results.informationProcessing === 'visual' && 'Visual Learner'}
            {results.results.informationProcessing === 'auditory' && 'Auditory Learner'}
            {results.results.informationProcessing === 'reading' && 'Reading/Writing Learner'}
            {results.results.informationProcessing === 'kinesthetic' && 'Hands-on Learner'}
          </SummaryValue>
        </SummaryRow>
        
        <SummaryRow>
          <SummaryLabel>Learning Pace:</SummaryLabel>
          <SummaryValue>
            {results.results.pacePreference === 'self-paced' ? 'Self-paced' : 'Structured'}
          </SummaryValue>
        </SummaryRow>
        
        <SummaryRow>
          <SummaryLabel>Content Depth:</SummaryLabel>
          <SummaryValue>
            {results.results.contentPreference === 'comprehensive' ? 'Comprehensive' : 'Concise'}
          </SummaryValue>
        </SummaryRow>
        
        <SummaryRow>
          <SummaryLabel>Problem-Solving Approach:</SummaryLabel>
          <SummaryValue>
            {results.results.problemSolvingApproach === 'systematic' ? 'Systematic' : 'Intuitive'}
          </SummaryValue>
        </SummaryRow>
        
        <SummaryRow>
          <SummaryLabel>Focus Capacity:</SummaryLabel>
          <SummaryValue>
            {results.results.focusCapacity === 'sustained' ? 'Sustained Focus' : 'Intermittent Focus'}
          </SummaryValue>
        </SummaryRow>
        
        <SummaryRow>
          <SummaryLabel>Assessment Completion:</SummaryLabel>
          <SummaryValue>
            {Math.round(results.completionPercentage || 0)}%
            <ProgressContainer>
              <ProgressIndicator percentage={results.completionPercentage || 0} />
            </ProgressContainer>
          </SummaryValue>
        </SummaryRow>
      </SummaryContent>
    );
  };
  
  // Format technical skills results for display
  const formatTechnicalSkillsResults = () => {
    const results = assessmentData.technicalSkillsResults;
    if (isSectionSkipped(results)) return null;
    
    return (
      <SummaryContent>
        <SummaryRow>
          <SummaryLabel>Overall Proficiency:</SummaryLabel>
          <SummaryValue>
            {results.proficiencyLevel || 'Not assessed'}
            {results.overallProficiency !== undefined && (
              <ProgressContainer>
                <ProgressIndicator percentage={(results.overallProficiency / 4) * 100} />
              </ProgressContainer>
            )}
          </SummaryValue>
        </SummaryRow>
        
        {results.categoryAverages && Object.entries(results.categoryAverages).map(([categoryId, average]) => {
          const category = categoryId === 'computer-basics' ? 'Computer Basics' :
                          categoryId === 'internet' ? 'Internet Skills' :
                          categoryId === 'software' ? 'Software Applications' :
                          categoryId === 'programming' ? 'Programming & Technical Skills' : categoryId;
          
          return (
            <SummaryRow key={categoryId}>
              <SummaryLabel>{category}:</SummaryLabel>
              <SummaryValue>
                {average < 1 ? 'Beginner' : 
                 average < 2 ? 'Basic' : 
                 average < 3 ? 'Intermediate' : 
                 average < 4 ? 'Advanced' : 'Expert'}
                <ProgressContainer>
                  <ProgressIndicator percentage={(average as number / 4) * 100} />
                </ProgressContainer>
              </SummaryValue>
            </SummaryRow>
          );
        })}
        
        <SummaryRow>
          <SummaryLabel>Assessment Completion:</SummaryLabel>
          <SummaryValue>
            {Math.round(results.completionPercentage || 0)}%
            <ProgressContainer>
              <ProgressIndicator percentage={results.completionPercentage || 0} />
            </ProgressContainer>
          </SummaryValue>
        </SummaryRow>
      </SummaryContent>
    );
  };
  
  // Format communication preferences for display
  const formatCommunicationPreferences = () => {
    const prefs = assessmentData.communicationPreferences;
    if (isSectionSkipped(prefs)) return null;
    
    return (
      <SummaryContent>
        {prefs.communicationStyle && (
          <SummaryRow>
            <SummaryLabel>Communication Style:</SummaryLabel>
            <SummaryValue>{prefs.communicationStyle}</SummaryValue>
          </SummaryRow>
        )}
        
        {prefs.feedbackPreference && (
          <SummaryRow>
            <SummaryLabel>Feedback Preference:</SummaryLabel>
            <SummaryValue>{prefs.feedbackPreference}</SummaryValue>
          </SummaryRow>
        )}
        
        {prefs.interactionMode && (
          <SummaryRow>
            <SummaryLabel>Interaction Mode:</SummaryLabel>
            <SummaryValue>{prefs.interactionMode}</SummaryValue>
          </SummaryRow>
        )}
        
        {prefs.socialPreference && (
          <SummaryRow>
            <SummaryLabel>Social Learning Preference:</SummaryLabel>
            <SummaryValue>{prefs.socialPreference}</SummaryValue>
          </SummaryRow>
        )}
      </SummaryContent>
    );
  };
  
  // Format learning goals for display
  const formatLearningGoals = () => {
    const goals = assessmentData.learningGoals;
    if (isSectionSkipped(goals)) return null;
    
    return (
      <SummaryContent>
        {goals.primaryGoal && (
          <SummaryRow>
            <SummaryLabel>Primary Learning Goal:</SummaryLabel>
            <SummaryValue>{goals.primaryGoal}</SummaryValue>
          </SummaryRow>
        )}
        
        {goals.topicInterests && goals.topicInterests.length > 0 && (
          <SummaryRow>
            <SummaryLabel>Topic Interests:</SummaryLabel>
            <SummaryValue>
              <TagContainer>
                {goals.topicInterests.map((topic: string) => (
                  <Tag key={topic}>{topic}</Tag>
                ))}
              </TagContainer>
            </SummaryValue>
          </SummaryRow>
        )}
        
        {goals.timeCommitment && (
          <SummaryRow>
            <SummaryLabel>Time Commitment:</SummaryLabel>
            <SummaryValue>{goals.timeCommitment}</SummaryValue>
          </SummaryRow>
        )}
        
        {goals.challengeLevel && (
          <SummaryRow>
            <SummaryLabel>Preferred Challenge Level:</SummaryLabel>
            <SummaryValue>{goals.challengeLevel}</SummaryValue>
          </SummaryRow>
        )}
      </SummaryContent>
    );
  };
  
  return (
    <Container>
      <h2>Your Personalized Learning Profile</h2>
      <p>
        Based on your responses, we've created a personalized learning profile for you.
        This information will help us tailor your learning experience to match your preferences and needs.
      </p>
      
      <Section>
        <SectionTitle>Sensory Preferences</SectionTitle>
        {formatSensoryPreferences() || (
          <SkippedSection>This section was skipped. Default settings will be applied.</SkippedSection>
        )}
      </Section>
      
      <Section>
        <SectionTitle>Learning Style</SectionTitle>
        {formatLearningStyleResults() || (
          <SkippedSection>This section was skipped. We'll adapt as we learn more about your preferences.</SkippedSection>
        )}
      </Section>
      
      <Section>
        <SectionTitle>Technical Skills</SectionTitle>
        {formatTechnicalSkillsResults() || (
          <SkippedSection>This section was skipped. Content will start at an introductory level.</SkippedSection>
        )}
      </Section>
      
      <Section>
        <SectionTitle>Communication Preferences</SectionTitle>
        {formatCommunicationPreferences() || (
          <SkippedSection>This section was skipped. Standard communication options will be available.</SkippedSection>
        )}
      </Section>
      
      <Section>
        <SectionTitle>Learning Goals</SectionTitle>
        {formatLearningGoals() || (
          <SkippedSection>This section was skipped. You can set specific goals later in your profile.</SkippedSection>
        )}
      </Section>
      
      <HelperText>
        You can update any of these preferences later through your profile settings.
        Your learning experience will continue to adapt as you use the platform.
      </HelperText>
      
      <ButtonContainer>
        <Button
          variant="primary"
          size="large"
          onClick={onComplete}
          ariaLabel="Complete onboarding and start learning"
        >
          Complete Setup and Start Learning
        </Button>
      </ButtonContainer>
    </Container>
  );
};

export default PersonalizationSummary; 