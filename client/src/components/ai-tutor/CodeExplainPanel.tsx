import React, { useState } from 'react';
import styled from 'styled-components';
import Button from '../common/Button';

interface CodeSegment {
  id: string;
  code: string;
  language: string;
  explanation: string;
  importance: 'critical' | 'important' | 'context';
  lineNumbers?: [number, number];
}

interface StepByStepExplanation {
  id: string;
  title: string;
  steps: {
    stepNumber: number;
    content: string;
    codeReference?: string;
  }[];
}

interface RelatedConcept {
  id: string;
  title: string;
  description: string;
  link?: string;
}

interface CodeExplainPanelProps {
  codeSegments?: CodeSegment[];
  fullCodeExample?: string;
  language?: string;
  fileName?: string;
  stepByStepExplanation?: StepByStepExplanation;
  relatedConcepts?: RelatedConcept[];
  onRequestMoreDetail?: (segmentId: string) => void;
}

// Main container
const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  overflow: hidden;
`;

// Panel header
const Header = styled.div`
  padding: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

// Panel title
const Title = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  color: ${({ theme }) => theme.colors.text.primary};
`;

// File info
const FileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

// Content container
const ContentContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-bottom: 1rem;
  
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

// Code container
const CodeContainer = styled.div`
  padding: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

// Code header
const CodeHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

// View options
const ViewOptions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

// Code block
const CodeBlock = styled.pre`
  margin: 0;
  padding: 1rem;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  background-color: ${({ theme }) => theme.colors.codeBackground};
  color: ${({ theme }) => theme.colors.code};
  font-family: monospace;
  font-size: 0.9rem;
  line-height: 1.5;
  overflow-x: auto;
  white-space: pre-wrap;
  
  &::-webkit-scrollbar {
    height: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.codeBackground};
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.colors.border};
    border-radius: 3px;
  }
`;

// Code segment
const CodeSegmentBlock = styled.div<{ importance: string }>`
  margin: 1rem 0;
  padding: 1rem;
  border-left: 4px solid ${({ theme, importance }) => 
    importance === 'critical' ? theme.colors.error :
    importance === 'important' ? theme.colors.warning :
    theme.colors.border
  };
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: 0 ${({ theme }) => theme.borderRadius.sm} ${({ theme }) => theme.borderRadius.sm} 0;
`;

// Code segment title
const CodeSegmentTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

// Code segment importance label
const ImportanceLabel = styled.span<{ importance: string }>`
  font-size: 0.8rem;
  padding: 0.1rem 0.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background-color: ${({ theme, importance }) => 
    importance === 'critical' ? `${theme.colors.error}22` :
    importance === 'important' ? `${theme.colors.warning}22` :
    `${theme.colors.secondary}22`
  };
  color: ${({ theme, importance }) => 
    importance === 'critical' ? theme.colors.error :
    importance === 'important' ? theme.colors.warning :
    theme.colors.secondary
  };
`;

// Code explanation
const CodeExplanation = styled.div`
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px dashed ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 0.95rem;
  line-height: 1.5;
`;

// Steps container
const StepsContainer = styled.div`
  padding: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

// Step header
const StepHeader = styled.h4`
  margin: 0 0 1rem 0;
  font-size: 1rem;
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  color: ${({ theme }) => theme.colors.text.primary};
`;

// Step item
const StepItem = styled.div`
  margin-bottom: 1.5rem;
  display: flex;
  gap: 1rem;
`;

// Step number
const StepNumber = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  flex-shrink: 0;
`;

// Step content
const StepContent = styled.div`
  flex: 1;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 0.95rem;
  line-height: 1.5;
`;

// Code reference
const CodeReference = styled.div`
  margin-top: 0.5rem;
  padding: 0.5rem;
  background-color: ${({ theme }) => theme.colors.codeBackground + '88'};
  border-left: 3px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-family: monospace;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.code};
  white-space: pre-wrap;
`;

// Related concepts container
const RelatedConceptsContainer = styled.div`
  padding: 1rem;
`;

// Related concepts title
const RelatedConceptsTitle = styled.h4`
  margin: 0 0 1rem 0;
  font-size: 1rem;
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  color: ${({ theme }) => theme.colors.text.primary};
`;

// Related concept item
const ConceptItem = styled.div`
  margin-bottom: 1rem;
  padding: 0.75rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

// Concept title
const ConceptTitle = styled.h5`
  margin: 0 0 0.5rem 0;
  font-size: 0.95rem;
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  color: ${({ theme }) => theme.colors.text.primary};
`;

// Concept description
const ConceptDescription = styled.p`
  margin: 0;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.5;
`;

// Concept link
const ConceptLink = styled.a`
  display: inline-block;
  margin-top: 0.5rem;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 0.85rem;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

// Empty state
const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 2rem;
  text-align: center;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

// Empty state icon
const EmptyStateIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.border};
`;

// Empty state text
const EmptyStateText = styled.p`
  margin: 0;
  font-size: 1rem;
`;

const CodeExplainPanel: React.FC<CodeExplainPanelProps> = ({
  codeSegments = [],
  fullCodeExample,
  language = 'javascript',
  fileName,
  stepByStepExplanation,
  relatedConcepts = [],
  onRequestMoreDetail
}) => {
  // State for view options
  const [showFullCode, setShowFullCode] = useState<boolean>(false);
  const [expandedSegments, setExpandedSegments] = useState<string[]>([]);
  
  // Toggle full code view
  const toggleFullCodeView = () => {
    setShowFullCode(!showFullCode);
  };
  
  // Toggle segment explanation
  const toggleSegmentExplanation = (segmentId: string) => {
    if (expandedSegments.includes(segmentId)) {
      setExpandedSegments(expandedSegments.filter(id => id !== segmentId));
    } else {
      setExpandedSegments([...expandedSegments, segmentId]);
    }
  };
  
  // Request more detail for a segment
  const handleRequestMoreDetail = (segmentId: string) => {
    if (onRequestMoreDetail) {
      onRequestMoreDetail(segmentId);
    }
  };
  
  // Check if any content is available
  const hasContent = fullCodeExample || codeSegments.length > 0 || stepByStepExplanation;
  
  if (!hasContent) {
    return (
      <Container>
        <Header>
          <Title>Code Explanation</Title>
        </Header>
        <EmptyState>
          <EmptyStateIcon aria-hidden="true">💻</EmptyStateIcon>
          <EmptyStateText>No code to explain yet.</EmptyStateText>
          <EmptyStateText>Ask the AI tutor to explain a code example or concept.</EmptyStateText>
        </EmptyState>
      </Container>
    );
  }
  
  return (
    <Container>
      <Header>
        <Title>Code Explanation</Title>
        {fileName && (
          <FileInfo>
            <span>File: {fileName}</span>
            <span>Language: {language}</span>
          </FileInfo>
        )}
      </Header>
      
      <ContentContainer>
        {/* Code View Section */}
        <CodeContainer>
          <CodeHeader>
            <h4 style={{ margin: 0 }}>
              {showFullCode ? 'Full Code Example' : 'Code Segments'}
            </h4>
            <ViewOptions>
              {fullCodeExample && (
                <Button
                  variant="text"
                  size="small"
                  onClick={toggleFullCodeView}
                  ariaLabel={showFullCode ? "Show code segments" : "Show full code"}
                >
                  {showFullCode ? "Show Segments" : "Show Full Code"}
                </Button>
              )}
            </ViewOptions>
          </CodeHeader>
          
          {showFullCode && fullCodeExample ? (
            <CodeBlock>
              {fullCodeExample}
            </CodeBlock>
          ) : (
            codeSegments.map(segment => {
              const isExpanded = expandedSegments.includes(segment.id);
              
              return (
                <CodeSegmentBlock key={segment.id} importance={segment.importance}>
                  <CodeSegmentTitle>
                    {segment.lineNumbers && (
                      <span>Lines {segment.lineNumbers[0]}-{segment.lineNumbers[1]}</span>
                    )}
                    <ImportanceLabel importance={segment.importance}>
                      {segment.importance === 'critical' ? 'Critical' : 
                       segment.importance === 'important' ? 'Important' : 'Context'}
                    </ImportanceLabel>
                  </CodeSegmentTitle>
                  
                  <CodeBlock>
                    {segment.code}
                  </CodeBlock>
                  
                  <CodeExplanation>
                    {segment.explanation}
                    
                    <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      <Button
                        variant="text"
                        size="small"
                        onClick={() => handleRequestMoreDetail(segment.id)}
                        ariaLabel="Request more detailed explanation"
                      >
                        More Detail
                      </Button>
                      <Button
                        variant="text"
                        size="small"
                        onClick={() => toggleSegmentExplanation(segment.id)}
                        ariaLabel={isExpanded ? "Show less" : "Show more"}
                      >
                        {isExpanded ? "Show Less" : "Show More"}
                      </Button>
                    </div>
                  </CodeExplanation>
                </CodeSegmentBlock>
              );
            })
          )}
        </CodeContainer>
        
        {/* Step by Step Explanation */}
        {stepByStepExplanation && (
          <StepsContainer>
            <StepHeader>{stepByStepExplanation.title}</StepHeader>
            
            {stepByStepExplanation.steps.map(step => (
              <StepItem key={step.stepNumber}>
                <StepNumber>{step.stepNumber}</StepNumber>
                <StepContent>
                  {step.content}
                  
                  {step.codeReference && (
                    <CodeReference>
                      {step.codeReference}
                    </CodeReference>
                  )}
                </StepContent>
              </StepItem>
            ))}
          </StepsContainer>
        )}
        
        {/* Related Concepts */}
        {relatedConcepts.length > 0 && (
          <RelatedConceptsContainer>
            <RelatedConceptsTitle>Related Concepts</RelatedConceptsTitle>
            
            {relatedConcepts.map(concept => (
              <ConceptItem key={concept.id}>
                <ConceptTitle>{concept.title}</ConceptTitle>
                <ConceptDescription>{concept.description}</ConceptDescription>
                
                {concept.link && (
                  <ConceptLink 
                    href={concept.link}
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    Learn more about {concept.title}
                  </ConceptLink>
                )}
              </ConceptItem>
            ))}
          </RelatedConceptsContainer>
        )}
      </ContentContainer>
    </Container>
  );
};

export default CodeExplainPanel; 