import React, { useState } from 'react';
import styled from 'styled-components';
import Button from '../common/Button';

interface LearningStyleAssessmentProps {
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

// Question container
const QuestionContainer = styled.div`
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  
  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }
`;

// Question text
const QuestionText = styled.h4`
  font-size: 1.1rem;
  margin-bottom: 1rem;
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
`;

// Option container
const OptionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
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

// Results container
const ResultsContainer = styled.div`
  margin-top: 2rem;
`;

// Results title
const ResultsTitle = styled.h3`
  font-size: 1.25rem;
  margin-bottom: 1rem;
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
`;

// Results description
const ResultsDescription = styled.p`
  margin-bottom: 1.5rem;
  line-height: 1.5;
`;

// Results item
const ResultItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  
  &:last-child {
    border-bottom: none;
  }
`;

// Results label
const ResultLabel = styled.span`
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
`;

// Results value
const ResultValue = styled.span`
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
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

// Save button container
const ButtonContainer = styled.div`
  margin-top: 2rem;
  display: flex;
  justify-content: flex-end;
`;

// Helper text
const HelperText = styled.p`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.text.hint};
  margin-top: 0.5rem;
  font-style: italic;
`;

// Learning style questions
const learningStyleQuestions = [
  {
    id: 'information-processing',
    text: 'How do you prefer to process new information?',
    options: [
      {
        id: 'visual',
        text: 'Visually',
        description: 'Through diagrams, charts, videos, or other visual formats'
      },
      {
        id: 'auditory',
        text: 'Auditorily',
        description: 'By listening to explanations, discussions, or audio content'
      },
      {
        id: 'reading',
        text: 'Through reading',
        description: 'By reading text-based materials at my own pace'
      },
      {
        id: 'kinesthetic',
        text: 'Hands-on',
        description: 'By doing practical exercises or interactive activities'
      }
    ]
  },
  {
    id: 'learning-pace',
    text: 'What pace of learning works best for you?',
    options: [
      {
        id: 'self-paced',
        text: 'Self-paced',
        description: 'I prefer to work through material at my own speed'
      },
      {
        id: 'structured',
        text: 'Structured schedule',
        description: 'I prefer a clear timeline with specific deadlines'
      },
      {
        id: 'mixed',
        text: 'Mixed approach',
        description: 'I like some structure but with flexibility for self-pacing'
      }
    ]
  },
  {
    id: 'content-depth',
    text: 'How do you prefer content to be presented?',
    options: [
      {
        id: 'comprehensive',
        text: 'Comprehensive and detailed',
        description: 'I want to understand all aspects thoroughly before moving on'
      },
      {
        id: 'concise',
        text: 'Concise and focused',
        description: 'I prefer just the essential information without extra details'
      },
      {
        id: 'layered',
        text: 'Layered approach',
        description: 'Start with basics and progressively add more complexity'
      }
    ]
  },
  {
    id: 'problem-solving',
    text: 'How do you approach problem-solving?',
    options: [
      {
        id: 'systematic',
        text: 'Systematically',
        description: 'I follow a step-by-step process to reach a solution'
      },
      {
        id: 'intuitive',
        text: 'Intuitively',
        description: 'I often see patterns and solutions without following explicit steps'
      },
      {
        id: 'collaborative',
        text: 'Collaboratively',
        description: 'I prefer to discuss problems with others to find solutions'
      },
      {
        id: 'experimental',
        text: 'Experimentally',
        description: 'I try different approaches to see what works best'
      }
    ]
  },
  {
    id: 'focus-duration',
    text: 'How long can you typically maintain focus on learning activities?',
    options: [
      {
        id: 'short',
        text: 'Short sessions',
        description: '15-30 minutes before needing a break'
      },
      {
        id: 'medium',
        text: 'Medium sessions',
        description: '30-60 minutes before needing a break'
      },
      {
        id: 'long',
        text: 'Long sessions',
        description: '1-2 hours or more when engaged in interesting content'
      },
      {
        id: 'variable',
        text: 'It varies significantly',
        description: 'Depends on the topic, my energy level, and other factors'
      }
    ]
  },
  {
    id: 'feedback-preference',
    text: 'What type of feedback helps you learn best?',
    options: [
      {
        id: 'immediate',
        text: 'Immediate feedback',
        description: 'I want to know right away if I'm on the right track'
      },
      {
        id: 'detailed',
        text: 'Detailed explanations',
        description: 'I prefer thorough explanations of what I did right or wrong'
      },
      {
        id: 'gentle',
        text: 'Gentle guidance',
        description: 'I prefer supportive feedback that focuses on improvement'
      },
      {
        id: 'self-assessment',
        text: 'Self-assessment tools',
        description: 'I prefer to evaluate my own progress with the right tools'
      }
    ]
  },
  {
    id: 'environment-preference',
    text: 'What learning environment works best for you?',
    options: [
      {
        id: 'quiet',
        text: 'Quiet and distraction-free',
        description: 'I need minimal sensory input to focus effectively'
      },
      {
        id: 'background',
        text: 'With background stimulation',
        description: 'I focus better with some background noise or activity'
      },
      {
        id: 'movement',
        text: 'With freedom to move',
        description: 'I learn better when I can move around or fidget'
      },
      {
        id: 'varied',
        text: 'Varied environments',
        description: 'I prefer to change my learning environment periodically'
      }
    ]
  }
];

const LearningStyleAssessment: React.FC<LearningStyleAssessmentProps> = ({ initialData, onSave }) => {
  // Initialize state with provided data or defaults
  const [answers, setAnswers] = useState<Record<string, string>>(
    initialData.answers || {}
  );
  
  // Calculate completion percentage
  const calculateCompletion = () => {
    const answeredQuestions = Object.keys(answers).length;
    return (answeredQuestions / learningStyleQuestions.length) * 100;
  };
  
  // Handle answer selection
  const handleAnswerChange = (questionId: string, optionId: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }));
  };
  
  // Calculate learning style results
  const calculateResults = () => {
    // Initialize counters for different learning styles
    const results = {
      visual: 0,
      auditory: 0,
      reading: 0,
      kinesthetic: 0,
      selfPaced: 0,
      structured: 0,
      comprehensive: 0,
      concise: 0,
      systematic: 0,
      intuitive: 0,
      shortFocus: 0,
      longFocus: 0
    };
    
    // Map answers to learning style dimensions
    if (answers['information-processing'] === 'visual') results.visual++;
    if (answers['information-processing'] === 'auditory') results.auditory++;
    if (answers['information-processing'] === 'reading') results.reading++;
    if (answers['information-processing'] === 'kinesthetic') results.kinesthetic++;
    
    if (answers['learning-pace'] === 'self-paced') results.selfPaced++;
    if (answers['learning-pace'] === 'structured') results.structured++;
    
    if (answers['content-depth'] === 'comprehensive') results.comprehensive++;
    if (answers['content-depth'] === 'concise') results.concise++;
    
    if (answers['problem-solving'] === 'systematic') results.systematic++;
    if (answers['problem-solving'] === 'intuitive') results.intuitive++;
    
    if (answers['focus-duration'] === 'short') results.shortFocus++;
    if (answers['focus-duration'] === 'medium') results.shortFocus += 0.5;
    if (answers['focus-duration'] === 'long') results.longFocus++;
    
    // Determine primary and secondary learning styles
    const informationProcessing = ['visual', 'auditory', 'reading', 'kinesthetic']
      .reduce((max, style) => results[style as keyof typeof results] > results[max as keyof typeof results] ? style : max, 'visual');
    
    const pacePreference = results.selfPaced >= results.structured ? 'self-paced' : 'structured';
    
    const contentPreference = results.comprehensive >= results.concise ? 'comprehensive' : 'concise';
    
    const problemSolvingApproach = results.systematic >= results.intuitive ? 'systematic' : 'intuitive';
    
    const focusCapacity = results.longFocus >= results.shortFocus ? 'sustained' : 'intermittent';
    
    return {
      informationProcessing,
      pacePreference,
      contentPreference,
      problemSolvingApproach,
      focusCapacity,
      rawScores: results
    };
  };
  
  // Handle save
  const handleSave = () => {
    const results = calculateResults();
    onSave({
      answers,
      results,
      completionPercentage: calculateCompletion()
    });
  };
  
  // Determine if all questions are answered
  const isComplete = Object.keys(answers).length === learningStyleQuestions.length;
  
  return (
    <Container>
      <h2>Learning Style Assessment</h2>
      <p>
        This assessment helps us understand how you prefer to learn and process information.
        Your responses will help us tailor the learning experience to match your preferences.
      </p>
      
      <ProgressBarContainer aria-label="Assessment completion progress">
        <ProgressBarFill width={calculateCompletion()} />
      </ProgressBarContainer>
      <HelperText>
        {Math.round(calculateCompletion())}% complete - {learningStyleQuestions.length - Object.keys(answers).length} questions remaining
      </HelperText>
      
      <Section>
        <SectionTitle>Learning Preferences Questionnaire</SectionTitle>
        <SectionDescription>
          Please select the option that best describes your preferences for each question.
          There are no right or wrong answers - we're interested in your personal learning style.
        </SectionDescription>
        
        {learningStyleQuestions.map((question, index) => (
          <QuestionContainer key={question.id}>
            <QuestionText>
              {index + 1}. {question.text}
            </QuestionText>
            <OptionContainer>
              {question.options.map(option => (
                <RadioOption key={option.id}>
                  <RadioInput
                    type="radio"
                    name={question.id}
                    value={option.id}
                    checked={answers[question.id] === option.id}
                    onChange={() => handleAnswerChange(question.id, option.id)}
                    aria-label={option.text}
                  />
                  <OptionTextContainer>
                    <OptionText>{option.text}</OptionText>
                    <OptionDescription>{option.description}</OptionDescription>
                  </OptionTextContainer>
                </RadioOption>
              ))}
            </OptionContainer>
          </QuestionContainer>
        ))}
      </Section>
      
      {isComplete && (
        <Section>
          <ResultsTitle>Your Learning Style Profile</ResultsTitle>
          <ResultsDescription>
            Based on your responses, here's a summary of your learning preferences.
            This information will help us customize your learning experience.
          </ResultsDescription>
          
          {(() => {
            const results = calculateResults();
            return (
              <div>
                <ResultItem>
                  <ResultLabel>Information Processing Preference:</ResultLabel>
                  <ResultValue>
                    {results.informationProcessing === 'visual' && 'Visual Learner'}
                    {results.informationProcessing === 'auditory' && 'Auditory Learner'}
                    {results.informationProcessing === 'reading' && 'Reading/Writing Learner'}
                    {results.informationProcessing === 'kinesthetic' && 'Hands-on Learner'}
                  </ResultValue>
                </ResultItem>
                
                <ResultItem>
                  <ResultLabel>Learning Pace:</ResultLabel>
                  <ResultValue>
                    {results.pacePreference === 'self-paced' ? 'Self-paced' : 'Structured'}
                  </ResultValue>
                </ResultItem>
                
                <ResultItem>
                  <ResultLabel>Content Depth Preference:</ResultLabel>
                  <ResultValue>
                    {results.contentPreference === 'comprehensive' ? 'Comprehensive' : 'Concise'}
                  </ResultValue>
                </ResultItem>
                
                <ResultItem>
                  <ResultLabel>Problem-Solving Approach:</ResultLabel>
                  <ResultValue>
                    {results.problemSolvingApproach === 'systematic' ? 'Systematic' : 'Intuitive'}
                  </ResultValue>
                </ResultItem>
                
                <ResultItem>
                  <ResultLabel>Focus Capacity:</ResultLabel>
                  <ResultValue>
                    {results.focusCapacity === 'sustained' ? 'Sustained Focus' : 'Intermittent Focus'}
                  </ResultValue>
                </ResultItem>
              </div>
            );
          })()}
          
          <HelperText>
            This profile will be used to customize your learning experience, but you can always
            adjust your preferences later in your profile settings.
          </HelperText>
        </Section>
      )}
      
      <ButtonContainer>
        <Button
          variant="primary"
          onClick={handleSave}
          ariaLabel="Save learning style assessment"
          disabled={Object.keys(answers).length === 0}
        >
          {isComplete ? 'Save and Continue' : 'Save Progress'}
        </Button>
      </ButtonContainer>
    </Container>
  );
};

export default LearningStyleAssessment; 