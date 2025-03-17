import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../store';
import { selectUser } from '../store/slices/authSlice';
import { completeOnboarding } from '../store/slices/userSlice';
import { addAlert } from '../store/slices/uiSlice';
import Button from '../components/common/Button';

// Onboarding steps
import Welcome from '../components/onboarding/Welcome';
import SensoryPreferences from '../components/onboarding/SensoryPreferences';
import LearningStyleAssessment from '../components/onboarding/LearningStyleAssessment';
import TechnicalSkillsAssessment from '../components/onboarding/TechnicalSkillsAssessment';
import CommunicationPreferences from '../components/onboarding/CommunicationPreferences';
import LearningGoals from '../components/onboarding/LearningGoals';
import PersonalizationSummary from '../components/onboarding/PersonalizationSummary';

// Onboarding step type
export type OnboardingStep = 
  | 'welcome'
  | 'sensory-preferences'
  | 'learning-style'
  | 'technical-skills'
  | 'communication-preferences'
  | 'learning-goals'
  | 'summary';

// Container styling
const OnboardingContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const Header = styled.header`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  margin-bottom: 0.5rem;
  font-size: 2rem;
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 1.1rem;
`;

const StepIndicatorContainer = styled.div`
  display: flex;
  margin: 2rem 0;
  position: relative;
  align-items: center;
  justify-content: space-between;
`;

const StepLine = styled.div<{ progress: number }>`
  position: absolute;
  top: 50%;
  left: 0;
  height: 3px;
  background-color: ${({ theme }) => theme.colors.primary};
  width: ${({ progress }) => `${progress}%`};
  transition: width 0.3s ease-out;
  z-index: 1;
  
  .reduced-motion & {
    transition: none;
  }
`;

const StepBackgroundLine = styled.div`
  position: absolute;
  top: 50%;
  left: 0;
  height: 3px;
  background-color: ${({ theme }) => theme.colors.border};
  width: 100%;
  z-index: 0;
`;

const StepIndicator = styled.div<{ active: boolean; completed: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: ${({ theme, active, completed }) => 
    active || completed ? theme.colors.primary : theme.colors.surface};
  border: 2px solid ${({ theme, active, completed }) => 
    active || completed ? theme.colors.primary : theme.colors.border};
  color: ${({ theme, active, completed }) => 
    active || completed ? theme.colors.buttonText : theme.colors.text.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  z-index: 2;
`;

const StepLabel = styled.span<{ active: boolean }>`
  font-size: 0.85rem;
  text-align: center;
  position: absolute;
  bottom: -25px;
  transform: translateX(-50%);
  left: 50%;
  width: 100px;
  color: ${({ theme, active }) => 
    active ? theme.colors.text.primary : theme.colors.text.secondary};
  font-weight: ${({ theme, active }) => 
    active ? theme.typography.fontWeights.medium : theme.typography.fontWeights.regular};

  /* High contrast mode */
  .high-contrast & {
    color: ${({ theme, active }) => 
      active ? theme.colors.text.primary : theme.colors.text.secondary};
    font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  }
`;

const NavigationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const StepContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const SkipButton = styled(Button)`
  margin-bottom: 1rem;
  align-self: flex-end;
`;

// Estimated time requirements for each step
const stepTimeEstimates: Record<OnboardingStep, string> = {
  'welcome': '1 minute',
  'sensory-preferences': '2-3 minutes',
  'learning-style': '3-5 minutes',
  'technical-skills': '3-5 minutes',
  'communication-preferences': '2-3 minutes',
  'learning-goals': '2-3 minutes',
  'summary': '1 minute'
};

// Step order definition
const steps: OnboardingStep[] = [
  'welcome',
  'sensory-preferences',
  'learning-style',
  'technical-skills',
  'communication-preferences',
  'learning-goals',
  'summary'
];

// Human-readable step names
const stepLabels: Record<OnboardingStep, string> = {
  'welcome': 'Welcome',
  'sensory-preferences': 'Sensory',
  'learning-style': 'Learning Style',
  'technical-skills': 'Skills',
  'communication-preferences': 'Communication',
  'learning-goals': 'Goals',
  'summary': 'Summary'
};

// Main Onboarding component
const Onboarding: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);
  
  // State for current step and assessment data
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  // Assessment data state
  const [assessmentData, setAssessmentData] = useState({
    sensoryPreferences: {},
    learningStyleResults: {},
    technicalSkillsResults: {},
    communicationPreferences: {},
    learningGoals: {},
    accessibilityNeeds: {}
  });

  // Update step index when currentStep changes
  useEffect(() => {
    const index = steps.indexOf(currentStep);
    setCurrentStepIndex(index);
  }, [currentStep]);
  
  // Calculate progress percentage for the step indicator
  const calculateProgress = () => {
    return (currentStepIndex / (steps.length - 1)) * 100;
  };
  
  // Handle next step navigation
  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStep(steps[currentStepIndex + 1]);
      window.scrollTo(0, 0); // Scroll to top for new step
    }
  };
  
  // Handle previous step navigation
  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(steps[currentStepIndex - 1]);
      window.scrollTo(0, 0); // Scroll to top for new step
    }
  };
  
  // Update assessment data from a specific step
  const updateAssessmentData = (
    stepName: keyof typeof assessmentData,
    data: Record<string, any>
  ) => {
    setAssessmentData(prev => ({
      ...prev,
      [stepName]: data
    }));
  };
  
  // Handle skip step
  const handleSkipStep = () => {
    // Mark the current step as skipped in the assessment data
    updateAssessmentData(
      currentStep.replace(/-/g, '') as keyof typeof assessmentData,
      { skipped: true }
    );
    handleNext();
  };
  
  // Complete onboarding and save data
  const handleComplete = async () => {
    if (!user) {
      dispatch(addAlert({
        type: 'error',
        message: 'You must be logged in to complete onboarding.',
      }));
      navigate('/login');
      return;
    }
    
    try {
      await dispatch(completeOnboarding({
        userId: user.id,
        onboardingData: {
          profileData: {
            languagePreference: 'en',
          },
          preferencesData: {
            theme: 'light',
            fontSize: 16,
            fontFamily: 'system',
            lineSpacing: 1.5,
            reducedMotion: assessmentData.sensoryPreferences.reducedMotion || false,
            highContrast: assessmentData.sensoryPreferences.highContrast || false,
          },
          assessmentData: {
            learningStyleResults: assessmentData.learningStyleResults,
            sensoryPreferences: assessmentData.sensoryPreferences,
            technicalSkillsResults: assessmentData.technicalSkillsResults,
            communicationPreferences: assessmentData.communicationPreferences,
            learningGoals: assessmentData.learningGoals,
            accessibilityNeeds: assessmentData.sensoryPreferences,
          }
        }
      })).unwrap();
      
      dispatch(addAlert({
        type: 'success',
        message: 'Onboarding completed! Your learning experience has been personalized.',
      }));
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
      dispatch(addAlert({
        type: 'error',
        message: 'Failed to save your preferences. Please try again.',
      }));
    }
  };
  
  // Render current step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 'welcome':
        return <Welcome onContinue={handleNext} />;
        
      case 'sensory-preferences':
        return (
          <SensoryPreferences
            initialData={assessmentData.sensoryPreferences}
            onSave={(data) => updateAssessmentData('sensoryPreferences', data)}
          />
        );
        
      case 'learning-style':
        return (
          <LearningStyleAssessment
            initialData={assessmentData.learningStyleResults}
            onSave={(data) => updateAssessmentData('learningStyleResults', data)}
          />
        );
        
      case 'technical-skills':
        return (
          <TechnicalSkillsAssessment
            initialData={assessmentData.technicalSkillsResults}
            onSave={(data) => updateAssessmentData('technicalSkillsResults', data)}
          />
        );
        
      case 'communication-preferences':
        return (
          <CommunicationPreferences
            initialData={assessmentData.communicationPreferences}
            onSave={(data) => updateAssessmentData('communicationPreferences', data)}
          />
        );
        
      case 'learning-goals':
        return (
          <LearningGoals
            initialData={assessmentData.learningGoals}
            onSave={(data) => updateAssessmentData('learningGoals', data)}
          />
        );
        
      case 'summary':
        return (
          <PersonalizationSummary
            assessmentData={assessmentData}
            onComplete={handleComplete}
          />
        );
        
      default:
        return <div>Unknown step</div>;
    }
  };

  // Render step indicators
  const renderStepIndicators = () => {
    return steps.map((step, index) => {
      const isActive = index === currentStepIndex;
      const isCompleted = index < currentStepIndex;
      
      return (
        <div key={step} style={{ position: 'relative' }}>
          <StepIndicator active={isActive} completed={isCompleted}>
            {isCompleted ? '✓' : index + 1}
          </StepIndicator>
          <StepLabel active={isActive}>{stepLabels[step]}</StepLabel>
        </div>
      );
    });
  };

  return (
    <OnboardingContainer>
      <Header>
        <Title>Personalize Your Learning Experience</Title>
        <Subtitle>
          Help us understand your preferences so we can tailor the learning experience to your needs.
        </Subtitle>
      </Header>
      
      <StepIndicatorContainer aria-label="Onboarding progress">
        <StepBackgroundLine />
        <StepLine progress={calculateProgress()} />
        {renderStepIndicators()}
      </StepIndicatorContainer>
      
      <StepContainer>
        {currentStep !== 'welcome' && currentStep !== 'summary' && (
          <SkipButton
            variant="text"
            size="small"
            onClick={handleSkipStep}
            ariaLabel={`Skip ${stepLabels[currentStep]} step`}
          >
            Skip this step
          </SkipButton>
        )}
        
        {renderStepContent()}
        
        <div aria-live="polite" className="sr-only">
          Step {currentStepIndex + 1} of {steps.length}: {stepLabels[currentStep]}. 
          Estimated time: {stepTimeEstimates[currentStep]}.
        </div>
      </StepContainer>
      
      <NavigationContainer>
        {currentStepIndex > 0 && currentStep !== 'summary' && (
          <Button
            variant="tertiary"
            onClick={handlePrevious}
            ariaLabel="Go back to previous step"
          >
            Previous
          </Button>
        )}
        
        {currentStepIndex < steps.length - 1 && currentStep !== 'welcome' && (
          <Button
            variant="primary"
            onClick={handleNext}
            style={{ marginLeft: 'auto' }}
            ariaLabel="Continue to next step"
          >
            Continue
          </Button>
        )}
      </NavigationContainer>
    </OnboardingContainer>
  );
};

export default Onboarding; 