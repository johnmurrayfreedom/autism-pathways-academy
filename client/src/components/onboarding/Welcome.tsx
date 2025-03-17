import React from 'react';
import styled from 'styled-components';
import Button from '../common/Button';

interface WelcomeProps {
  onContinue: () => void;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Section = styled.section`
  margin-bottom: 1.5rem;
`;

const WelcomeTitle = styled.h2`
  font-size: 1.75rem;
  margin-bottom: 1rem;
`;

const Paragraph = styled.p`
  line-height: 1.6;
  margin-bottom: 1rem;
  max-width: 650px;
`;

const StepList = styled.ol`
  margin: 1.5rem 0;
  padding-left: 1.5rem;
`;

const StepItem = styled.li`
  margin-bottom: 1rem;
  padding-left: 0.5rem;
`;

const StepTitle = styled.h3`
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
`;

const StepDescription = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const ButtonContainer = styled.div`
  margin-top: 2rem;
`;

const Welcome: React.FC<WelcomeProps> = ({ onContinue }) => {
  return (
    <Container>
      <Section>
        <WelcomeTitle>Welcome to Your Learning Journey</WelcomeTitle>
        <Paragraph>
          We're excited to help you learn in a way that works best for you. Our AI-powered learning
          platform is designed to adapt to your unique needs and preferences as an autistic adult
          learner.
        </Paragraph>
        <Paragraph>
          Before we begin, we'd like to understand more about how you learn best. This will help us
          personalize your experience from the start.
        </Paragraph>
      </Section>

      <Section>
        <StepTitle>What to expect in this onboarding process:</StepTitle>
        <StepList>
          <StepItem>
            <StepTitle>Sensory Preferences</StepTitle>
            <StepDescription>
              Tell us about your preferred visual settings, sound sensitivity, and other sensory
              needs.
            </StepDescription>
          </StepItem>
          <StepItem>
            <StepTitle>Learning Style Assessment</StepTitle>
            <StepDescription>
              Identify how you prefer to process and understand information.
            </StepDescription>
          </StepItem>
          <StepItem>
            <StepTitle>Technical Skills Baseline</StepTitle>
            <StepDescription>
              Share your current technical knowledge so we can match content to your skill level.
            </StepDescription>
          </StepItem>
          <StepItem>
            <StepTitle>Communication Preferences</StepTitle>
            <StepDescription>
              Let us know how you prefer to interact with instructors and other learners.
            </StepDescription>
          </StepItem>
          <StepItem>
            <StepTitle>Learning Goals</StepTitle>
            <StepDescription>
              Tell us what you hope to achieve so we can help you reach your goals.
            </StepDescription>
          </StepItem>
        </StepList>
      </Section>

      <Section>
        <StepTitle>Important notes:</StepTitle>
        <Paragraph>
          • This process will take about 10-15 minutes to complete.
        </Paragraph>
        <Paragraph>
          • You can skip any section you're not comfortable with.
        </Paragraph>
        <Paragraph>
          • All your preferences can be changed later in your profile settings.
        </Paragraph>
        <Paragraph>
          • Your information is kept private and is only used to personalize your learning
          experience.
        </Paragraph>
      </Section>

      <ButtonContainer>
        <Button
          variant="primary"
          size="large"
          onClick={onContinue}
          ariaLabel="Begin personalization assessment"
        >
          Let's Get Started
        </Button>
      </ButtonContainer>
    </Container>
  );
};

export default Welcome; 