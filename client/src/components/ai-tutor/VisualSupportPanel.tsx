import React, { useState } from 'react';
import styled from 'styled-components';
import Button from '../common/Button';

interface ConceptNode {
  id: string;
  label: string;
  description?: string;
  type: 'concept' | 'example' | 'practice' | 'resource';
  position: { x: number; y: number };
}

interface ConceptConnection {
  source: string;
  target: string;
  label?: string;
  type: 'related' | 'prerequisite' | 'leads-to';
}

interface ConceptMap {
  title: string;
  nodes: ConceptNode[];
  connections: ConceptConnection[];
}

interface Diagram {
  id: string;
  title: string;
  imageSrc: string;
  alt: string;
  description?: string;
  tags: string[];
}

interface CodeVisualization {
  id: string;
  title: string;
  code: string;
  visual: 'flowchart' | 'memory' | 'execution' | 'dataStructure';
  description?: string;
}

interface VisualSupportPanelProps {
  conceptMaps?: ConceptMap[];
  diagrams?: Diagram[];
  codeVisualizations?: CodeVisualization[];
  activeVisualId?: string;
  onSelectVisual?: (id: string, type: 'conceptMap' | 'diagram' | 'codeViz') => void;
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
const PanelHeader = styled.div`
  padding: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

// Panel title
const PanelTitle = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  color: ${({ theme }) => theme.colors.text.primary};
`;

// Tabs
const TabsContainer = styled.div`
  display: flex;
  padding: 0 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  overflow-x: auto;
  
  &::-webkit-scrollbar {
    height: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.colors.border};
    border-radius: 2px;
  }
`;

// Tab
const Tab = styled.button<{ isActive: boolean }>`
  padding: 0.75rem 1rem;
  background-color: transparent;
  border: none;
  border-bottom: 2px solid ${({ theme, isActive }) => isActive ? theme.colors.primary : 'transparent'};
  color: ${({ theme, isActive }) => isActive ? theme.colors.primary : theme.colors.text.secondary};
  font-weight: ${({ theme, isActive }) => isActive ? theme.typography.fontWeights.medium : theme.typography.fontWeights.regular};
  cursor: pointer;
  white-space: nowrap;
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
  
  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.focus};
    outline-offset: -2px;
  }
`;

// Content container
const ContentContainer = styled.div`
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
`;

// Visual item container
const VisualItem = styled.div<{ isActive: boolean }>`
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme, isActive }) => isActive ? theme.colors.primary : theme.colors.border};
  background-color: ${({ theme, isActive }) => isActive ? theme.colors.primaryLight : theme.colors.background};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }
  
  .reduced-motion & {
    transition: none;
  }
`;

// Visual item title
const VisualItemTitle = styled.h4`
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  color: ${({ theme }) => theme.colors.text.primary};
`;

// Visual item description
const VisualItemDescription = styled.p`
  margin: 0;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

// Visual controls
const VisualControls = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 0.5rem;
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
`;

// Empty state icon
const EmptyStateIcon = styled.div`
  font-size: 3rem;
  color: ${({ theme }) => theme.colors.border};
  margin-bottom: 1rem;
`;

// Empty state text
const EmptyStateText = styled.p`
  margin: 0;
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

// Tags container
const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

// Tag
const Tag = styled.span`
  padding: 0.25rem 0.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background-color: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

// Diagram image container
const DiagramImage = styled.div`
  margin-top: 1rem;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.background};
`;

// Diagram image
const Image = styled.img`
  max-width: 100%;
  height: auto;
  display: block;
`;

// Concept map container
const ConceptMapContainer = styled.div<{ expanded: boolean }>`
  max-height: ${({ expanded }) => expanded ? 'none' : '200px'};
  overflow: hidden;
  position: relative;
  margin-top: 1rem;
  padding: 1rem;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  background-color: ${({ theme }) => theme.colors.background};
`;

// Concept map node
const ConceptMapNode = styled.div<{ nodeType: string; x: number; y: number }>`
  position: absolute;
  top: ${({ y }) => `${y}px`};
  left: ${({ x }) => `${x}px`};
  padding: 0.5rem;
  min-width: 100px;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  background-color: ${({ theme, nodeType }) => 
    nodeType === 'concept' ? theme.colors.primary :
    nodeType === 'example' ? theme.colors.success :
    nodeType === 'practice' ? theme.colors.warning :
    theme.colors.info
  };
  color: ${({ theme, nodeType }) => 
    nodeType === 'concept' ? theme.colors.textOnPrimary :
    nodeType === 'example' ? theme.colors.textOnSuccess :
    nodeType === 'practice' ? theme.colors.textOnWarning :
    theme.colors.textOnInfo
  };
  font-size: 0.85rem;
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  text-align: center;
  z-index: 2;
`;

// Code visualization container
const CodeVisContainer = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  background-color: ${({ theme }) => theme.colors.background};
`;

// Code visualization content
const CodeVisContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-top: 1rem;
`;

// Code block
const CodeBlock = styled.pre`
  margin: 0;
  padding: 1rem;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  background-color: ${({ theme }) => theme.colors.codeBackground};
  color: ${({ theme }) => theme.colors.code};
  font-family: monospace;
  font-size: 0.85rem;
  line-height: 1.5;
  overflow: auto;
`;

// Visual representation
const VisualRepresentation = styled.div`
  padding: 1rem;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  background-color: white;
  border: 1px dashed ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const VisualSupportPanel: React.FC<VisualSupportPanelProps> = ({
  conceptMaps = [],
  diagrams = [],
  codeVisualizations = [],
  activeVisualId,
  onSelectVisual
}) => {
  // State for the active tab
  const [activeTab, setActiveTab] = useState<'conceptMaps' | 'diagrams' | 'codeViz'>(
    conceptMaps.length > 0 ? 'conceptMaps' :
    diagrams.length > 0 ? 'diagrams' : 
    'codeViz'
  );
  
  // State for expanded concept maps
  const [expandedMaps, setExpandedMaps] = useState<string[]>([]);
  
  // Change active tab
  const handleTabChange = (tab: 'conceptMaps' | 'diagrams' | 'codeViz') => {
    setActiveTab(tab);
  };
  
  // Toggle concept map expansion
  const toggleMapExpansion = (mapId: string) => {
    if (expandedMaps.includes(mapId)) {
      setExpandedMaps(expandedMaps.filter(id => id !== mapId));
    } else {
      setExpandedMaps([...expandedMaps, mapId]);
    }
  };
  
  // Handle clicking on a visual
  const handleVisualClick = (id: string, type: 'conceptMap' | 'diagram' | 'codeViz') => {
    if (onSelectVisual) {
      onSelectVisual(id, type);
    }
  };
  
  return (
    <Container>
      <PanelHeader>
        <PanelTitle>Visual Support</PanelTitle>
      </PanelHeader>
      
      <TabsContainer>
        {conceptMaps.length > 0 && (
          <Tab 
            isActive={activeTab === 'conceptMaps'} 
            onClick={() => handleTabChange('conceptMaps')}
          >
            Concept Maps
          </Tab>
        )}
        
        {diagrams.length > 0 && (
          <Tab 
            isActive={activeTab === 'diagrams'} 
            onClick={() => handleTabChange('diagrams')}
          >
            Diagrams
          </Tab>
        )}
        
        {codeVisualizations.length > 0 && (
          <Tab 
            isActive={activeTab === 'codeViz'} 
            onClick={() => handleTabChange('codeViz')}
          >
            Code Visualizations
          </Tab>
        )}
      </TabsContainer>
      
      <ContentContainer>
        {/* Concept Maps */}
        {activeTab === 'conceptMaps' && (
          conceptMaps.length > 0 ? (
            conceptMaps.map(map => {
              const isActive = activeVisualId === map.title;
              const isExpanded = expandedMaps.includes(map.title);
              
              return (
                <VisualItem 
                  key={map.title} 
                  isActive={isActive}
                  onClick={() => handleVisualClick(map.title, 'conceptMap')}
                >
                  <VisualItemTitle>{map.title}</VisualItemTitle>
                  
                  <ConceptMapContainer expanded={isExpanded}>
                    {map.nodes.map(node => (
                      <ConceptMapNode 
                        key={node.id}
                        nodeType={node.type}
                        x={node.position.x}
                        y={node.position.y}
                        title={node.description}
                      >
                        {node.label}
                      </ConceptMapNode>
                    ))}
                    
                    {/* Note: In a real implementation, we would render SVG lines for connections */}
                    {!isExpanded && (
                      <div style={{ 
                        position: 'absolute', 
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '50px',
                        background: 'linear-gradient(transparent, rgba(255,255,255,0.9))'
                      }} />
                    )}
                  </ConceptMapContainer>
                  
                  <VisualControls>
                    <Button
                      variant="text"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMapExpansion(map.title);
                      }}
                      ariaLabel={isExpanded ? "Collapse map" : "Expand map"}
                    >
                      {isExpanded ? "Collapse" : "Expand"}
                    </Button>
                  </VisualControls>
                </VisualItem>
              );
            })
          ) : (
            <EmptyState>
              <EmptyStateIcon aria-hidden="true">🗺️</EmptyStateIcon>
              <EmptyStateText>No concept maps available for this topic yet.</EmptyStateText>
            </EmptyState>
          )
        )}
        
        {/* Diagrams */}
        {activeTab === 'diagrams' && (
          diagrams.length > 0 ? (
            diagrams.map(diagram => {
              const isActive = activeVisualId === diagram.id;
              
              return (
                <VisualItem 
                  key={diagram.id} 
                  isActive={isActive}
                  onClick={() => handleVisualClick(diagram.id, 'diagram')}
                >
                  <VisualItemTitle>{diagram.title}</VisualItemTitle>
                  
                  {diagram.description && (
                    <VisualItemDescription>{diagram.description}</VisualItemDescription>
                  )}
                  
                  <Tags>
                    {diagram.tags.map((tag, index) => (
                      <Tag key={index}>{tag}</Tag>
                    ))}
                  </Tags>
                  
                  <DiagramImage>
                    <Image 
                      src={diagram.imageSrc} 
                      alt={diagram.alt}
                      loading="lazy"
                    />
                  </DiagramImage>
                </VisualItem>
              );
            })
          ) : (
            <EmptyState>
              <EmptyStateIcon aria-hidden="true">📊</EmptyStateIcon>
              <EmptyStateText>No diagrams available for this topic yet.</EmptyStateText>
            </EmptyState>
          )
        )}
        
        {/* Code Visualizations */}
        {activeTab === 'codeViz' && (
          codeVisualizations.length > 0 ? (
            codeVisualizations.map(codeViz => {
              const isActive = activeVisualId === codeViz.id;
              
              return (
                <VisualItem 
                  key={codeViz.id} 
                  isActive={isActive}
                  onClick={() => handleVisualClick(codeViz.id, 'codeViz')}
                >
                  <VisualItemTitle>{codeViz.title}</VisualItemTitle>
                  
                  {codeViz.description && (
                    <VisualItemDescription>{codeViz.description}</VisualItemDescription>
                  )}
                  
                  <CodeVisContainer>
                    <div>
                      <strong>
                        {codeViz.visual === 'flowchart' && 'Code Flowchart'}
                        {codeViz.visual === 'memory' && 'Memory Visualization'}
                        {codeViz.visual === 'execution' && 'Execution Steps'}
                        {codeViz.visual === 'dataStructure' && 'Data Structure Visualization'}
                      </strong>
                    </div>
                    
                    <CodeVisContent>
                      <CodeBlock>{codeViz.code}</CodeBlock>
                      <VisualRepresentation>
                        {/* In a real implementation, this would contain the actual visualization */}
                        <div>
                          {codeViz.visual === 'flowchart' && '📈 Flowchart Visualization'}
                          {codeViz.visual === 'memory' && '🧠 Memory Model Visualization'}
                          {codeViz.visual === 'execution' && '⚙️ Execution Step Visualization'}
                          {codeViz.visual === 'dataStructure' && '🏗️ Data Structure Visualization'}
                        </div>
                      </VisualRepresentation>
                    </CodeVisContent>
                  </CodeVisContainer>
                </VisualItem>
              );
            })
          ) : (
            <EmptyState>
              <EmptyStateIcon aria-hidden="true">💻</EmptyStateIcon>
              <EmptyStateText>No code visualizations available for this topic yet.</EmptyStateText>
            </EmptyState>
          )
        )}
      </ContentContainer>
    </Container>
  );
};

export default VisualSupportPanel; 