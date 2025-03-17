import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../store';
import { selectUserPreferences } from '../../store/slices/userSlice';
import Button from '../common/Button';
import { Course, CourseProgress } from './CourseListingView';

interface CourseDetailViewProps {
  course: Course;
  userProgress: CourseProgress;
  relatedCourses: Course[];
}

// Main container
const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

// Breadcrumb navigation
const Breadcrumbs = styled.nav`
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  
  a {
    color: ${({ theme }) => theme.colors.text.secondary};
    text-decoration: none;
    
    &:hover {
      color: ${({ theme }) => theme.colors.primary};
      text-decoration: underline;
    }
  }
  
  span {
    margin: 0 0.5rem;
  }
`;

// Course header
const CourseHeader = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 2rem;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: row;
    gap: 2rem;
  }
`;

// Course image
const CourseImage = styled.div<{ imageUrl?: string }>`
  height: 240px;
  background-image: url(${({ imageUrl }) => imageUrl || '/placeholder-course.jpg'});
  background-size: cover;
  background-position: center;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  flex-shrink: 0;
  width: 100%;
  margin-bottom: 1.5rem;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 400px;
    margin-bottom: 0;
  }
`;

// Course info
const CourseInfo = styled.div`
  flex: 1;
`;

// Course title
const CourseTitle = styled.h1`
  font-size: 2rem;
  margin: 0 0 1rem 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
`;

// Course description
const CourseDescription = styled.p`
  font-size: 1.1rem;
  margin: 0 0 1.5rem 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.6;
`;

// Course meta
const CourseMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
`;

// Meta item
const MetaItem = styled.div`
  display: flex;
  flex-direction: column;
`;

// Meta label
const MetaLabel = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 0.25rem;
  font-size: 0.85rem;
`;

// Meta value
const MetaValue = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
`;

// Course tags
const CourseTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

// Course tag
const CourseTag = styled.span`
  font-size: 0.85rem;
  padding: 0.25rem 0.75rem;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text.secondary};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

// Level indicator
const LevelIndicator = styled.span<{ level: string }>`
  font-size: 0.85rem;
  padding: 0.25rem 0.75rem;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background-color: ${({ theme, level }) => 
    level === 'beginner' 
      ? theme.colors.success + '22' 
      : level === 'intermediate' 
        ? theme.colors.warning + '22' 
        : theme.colors.error + '22'};
  color: ${({ theme, level }) => 
    level === 'beginner' 
      ? theme.colors.success 
      : level === 'intermediate' 
        ? theme.colors.warning 
        : theme.colors.error};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
`;

// Action buttons
const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
  }
`;

// Course content container
const CourseContent = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 2fr 1fr;
  }
`;

// Main content
const MainContent = styled.div``;

// Sidebar
const Sidebar = styled.div`
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    order: -1;
  }
`;

// Section
const Section = styled.section`
  margin-bottom: 2.5rem;
`;

// Section title
const SectionTitle = styled.h2`
  font-size: 1.5rem;
  margin: 0 0 1.25rem 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  padding-bottom: 0.75rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

// Module list
const ModuleList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

// Module item
const ModuleItem = styled.div<{ isCompleted: boolean; isActive: boolean }>`
  display: flex;
  padding: 1rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme, isActive }) => 
    isActive ? theme.colors.primary : theme.colors.border};
  background-color: ${({ theme, isActive }) => 
    isActive ? theme.colors.primary + '11' : theme.colors.surface};
  position: relative;
  
  ${({ isCompleted, theme }) => isCompleted && `
    &:after {
      content: '✓';
      position: absolute;
      top: 1rem;
      right: 1rem;
      color: ${theme.colors.success};
      font-weight: bold;
    }
  `}
`;

// Module content
const ModuleContent = styled.div`
  flex: 1;
`;

// Module title
const ModuleTitle = styled.h3`
  font-size: 1.1rem;
  margin: 0 0 0.5rem 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
`;

// Module description
const ModuleDescription = styled.p`
  font-size: 0.95rem;
  margin: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

// Module meta
const ModuleMeta = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 0.75rem;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.text.hint};
`;

// Module actions
const ModuleActions = styled.div`
  margin-left: 1rem;
  display: flex;
  align-items: center;
`;

// Progress card
const ProgressCard = styled.div`
  padding: 1.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  margin-bottom: 2rem;
`;

// Progress title
const ProgressTitle = styled.h3`
  font-size: 1.25rem;
  margin: 0 0 1rem 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
`;

// Progress bar container
const ProgressBarContainer = styled.div`
  height: 8px;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  margin-bottom: 1rem;
  overflow: hidden;
`;

// Progress bar
const ProgressBar = styled.div<{ progress: number }>`
  height: 100%;
  width: ${({ progress }) => `${progress}%`};
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  transition: width 0.3s ease;
`;

// Progress stats
const ProgressStats = styled.div`
  display: flex;
  justify-content: space-between;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 0.9rem;
`;

// Prerequisites card
const PrerequisitesCard = styled.div`
  padding: 1.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  margin-bottom: 2rem;
`;

// Prerequisites title
const PrerequisitesTitle = styled.h3`
  font-size: 1.25rem;
  margin: 0 0 1rem 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
`;

// Prerequisites list
const PrerequisitesList = styled.ul`
  margin: 0;
  padding-left: 1.5rem;
  
  li {
    margin-bottom: 0.75rem;
    color: ${({ theme }) => theme.colors.text.secondary};
    
    &:last-child {
      margin-bottom: 0;
    }
  }
`;

// Related courses card
const RelatedCoursesCard = styled.div`
  padding: 1.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

// Related courses title
const RelatedCoursesTitle = styled.h3`
  font-size: 1.25rem;
  margin: 0 0 1rem 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
`;

// Related course list
const RelatedCourseList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

// Related course item
const RelatedCourseItem = styled(Link)`
  display: flex;
  gap: 1rem;
  text-decoration: none;
  color: ${({ theme }) => theme.colors.text.primary};
  
  &:hover h4 {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

// Related course image
const RelatedCourseImage = styled.div<{ imageUrl?: string }>`
  width: 80px;
  height: 60px;
  background-image: url(${({ imageUrl }) => imageUrl || '/placeholder-course.jpg'});
  background-size: cover;
  background-position: center;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  flex-shrink: 0;
`;

// Related course info
const RelatedCourseInfo = styled.div`
  flex: 1;
`;

// Related course title
const RelatedCourseTitle = styled.h4`
  font-size: 1rem;
  margin: 0 0 0.25rem 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  transition: color 0.2s;
`;

// Related course meta
const RelatedCourseMeta = styled.div`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

// Learning objectives
const LearningObjectives = styled.ul`
  margin: 0;
  padding-left: 1.5rem;
  
  li {
    margin-bottom: 0.75rem;
    color: ${({ theme }) => theme.colors.text.secondary};
    line-height: 1.5;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
`;

// Helper function to format time estimate
const formatTimeEstimate = (hours: number) => {
  if (hours < 1) {
    return `${Math.round(hours * 60)} min`;
  }
  if (Number.isInteger(hours)) {
    return `${hours} hr${hours !== 1 ? 's' : ''}`;
  }
  return `${Math.floor(hours)} hr ${Math.round((hours % 1) * 60)} min`;
};

// Helper function to format date
const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};

// Mock learning objectives for demonstration
const mockLearningObjectives = [
  "Understand the fundamental concepts and principles of the subject",
  "Apply theoretical knowledge to practical scenarios and problem-solving",
  "Analyze complex systems and break them down into manageable components",
  "Develop critical thinking skills related to the course material",
  "Create original solutions using the techniques learned in the course"
];

const CourseDetailView: React.FC<CourseDetailViewProps> = ({ 
  course, 
  userProgress, 
  relatedCourses 
}) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const userPreferences = useAppSelector(selectUserPreferences);
  
  // State for active module
  const [activeModuleId, setActiveModuleId] = useState<string | null>(
    userProgress.completedModules.length === 0 && course.modules.length > 0
      ? course.modules[0].id
      : null
  );
  
  // Calculate total course duration
  const totalMinutes = course.modules.reduce((total, module) => total + module.estimatedMinutes, 0);
  
  // Handle continue learning
  const handleContinueLearning = () => {
    // Find the first incomplete module
    const firstIncompleteModule = course.modules.find(
      module => !userProgress.completedModules.includes(module.id)
    );
    
    if (firstIncompleteModule) {
      navigate(`/courses/${course.id}/modules/${firstIncompleteModule.id}`);
    } else if (course.modules.length > 0) {
      // If all modules are complete, go to the first one
      navigate(`/courses/${course.id}/modules/${course.modules[0].id}`);
    }
  };
  
  // Handle start course
  const handleStartCourse = () => {
    if (course.modules.length > 0) {
      navigate(`/courses/${course.id}/modules/${course.modules[0].id}`);
    }
  };
  
  // Handle AI tutor help
  const handleAITutorHelp = () => {
    navigate(`/ai-tutor?courseId=${course.id}`);
  };
  
  return (
    <Container>
      <Breadcrumbs aria-label="breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to="/courses">Courses</Link>
        <span>/</span>
        <span>{course.title}</span>
      </Breadcrumbs>
      
      <CourseHeader>
        <CourseImage imageUrl={course.imageUrl} />
        
        <CourseInfo>
          <CourseTitle>{course.title}</CourseTitle>
          
          <CourseTags>
            <LevelIndicator level={course.level}>
              {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
            </LevelIndicator>
            
            {course.tags.map(tag => (
              <CourseTag key={tag}>{tag}</CourseTag>
            ))}
          </CourseTags>
          
          <CourseDescription>{course.description}</CourseDescription>
          
          <CourseMeta>
            <MetaItem>
              <MetaLabel>Instructor</MetaLabel>
              <MetaValue>{course.authorName}</MetaValue>
            </MetaItem>
            
            <MetaItem>
              <MetaLabel>Duration</MetaLabel>
              <MetaValue>{formatTimeEstimate(course.estimatedHours)}</MetaValue>
            </MetaItem>
            
            <MetaItem>
              <MetaLabel>Last Updated</MetaLabel>
              <MetaValue>{formatDate(course.updatedAt)}</MetaValue>
            </MetaItem>
            
            <MetaItem>
              <MetaLabel>Modules</MetaLabel>
              <MetaValue>{course.modules.length}</MetaValue>
            </MetaItem>
          </CourseMeta>
          
          <ActionButtons>
            {userProgress.completionPercentage > 0 && !userProgress.isCompleted ? (
              <Button
                variant="primary"
                size="large"
                onClick={handleContinueLearning}
                icon="play"
              >
                Continue Learning
              </Button>
            ) : userProgress.isCompleted ? (
              <Button
                variant="secondary"
                size="large"
                onClick={handleStartCourse}
                icon="refresh"
              >
                Review Course
              </Button>
            ) : (
              <Button
                variant="primary"
                size="large"
                onClick={handleStartCourse}
                icon="play"
              >
                Start Course
              </Button>
            )}
            
            <Button
              variant="secondary"
              size="large"
              onClick={handleAITutorHelp}
              icon="help"
            >
              Ask AI Tutor
            </Button>
          </ActionButtons>
        </CourseInfo>
      </CourseHeader>
      
      <CourseContent>
        <MainContent>
          <Section>
            <SectionTitle>Course Content</SectionTitle>
            <ModuleList>
              {course.modules.map(module => {
                const isCompleted = userProgress.completedModules.includes(module.id);
                const isActive = module.id === activeModuleId;
                
                return (
                  <ModuleItem 
                    key={module.id} 
                    isCompleted={isCompleted}
                    isActive={isActive}
                    onClick={() => setActiveModuleId(module.id)}
                  >
                    <ModuleContent>
                      <ModuleTitle>{module.title}</ModuleTitle>
                      <ModuleDescription>
                        {/* In a real app, this would come from the module data */}
                        Learn about the key concepts and practical applications.
                      </ModuleDescription>
                      <ModuleMeta>
                        <span>⏱️ {formatTimeEstimate(module.estimatedMinutes / 60)}</span>
                      </ModuleMeta>
                    </ModuleContent>
                    <ModuleActions>
                      <Button
                        variant="text"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/courses/${course.id}/modules/${module.id}`);
                        }}
                        icon="arrow-right"
                      >
                        {isCompleted ? 'Review' : 'Start'}
                      </Button>
                    </ModuleActions>
                  </ModuleItem>
                );
              })}
            </ModuleList>
          </Section>
          
          <Section>
            <SectionTitle>What You'll Learn</SectionTitle>
            <LearningObjectives>
              {mockLearningObjectives.map((objective, index) => (
                <li key={index}>{objective}</li>
              ))}
            </LearningObjectives>
          </Section>
        </MainContent>
        
        <Sidebar>
          <ProgressCard>
            <ProgressTitle>Your Progress</ProgressTitle>
            <ProgressBarContainer>
              <ProgressBar progress={userProgress.completionPercentage} />
            </ProgressBarContainer>
            <ProgressStats>
              <span>{userProgress.completionPercentage}% complete</span>
              <span>
                {userProgress.completedModules.length}/{course.modules.length} modules
              </span>
            </ProgressStats>
          </ProgressCard>
          
          {course.prerequisites.length > 0 && (
            <PrerequisitesCard>
              <PrerequisitesTitle>Prerequisites</PrerequisitesTitle>
              <PrerequisitesList>
                {course.prerequisites.map((prerequisite, index) => (
                  <li key={index}>{prerequisite}</li>
                ))}
              </PrerequisitesList>
            </PrerequisitesCard>
          )}
          
          {relatedCourses.length > 0 && (
            <RelatedCoursesCard>
              <RelatedCoursesTitle>Related Courses</RelatedCoursesTitle>
              <RelatedCourseList>
                {relatedCourses.map(relatedCourse => (
                  <RelatedCourseItem 
                    key={relatedCourse.id} 
                    to={`/courses/${relatedCourse.id}`}
                  >
                    <RelatedCourseImage imageUrl={relatedCourse.imageUrl} />
                    <RelatedCourseInfo>
                      <RelatedCourseTitle>{relatedCourse.title}</RelatedCourseTitle>
                      <RelatedCourseMeta>
                        {formatTimeEstimate(relatedCourse.estimatedHours)} • {relatedCourse.level}
                      </RelatedCourseMeta>
                    </RelatedCourseInfo>
                  </RelatedCourseItem>
                ))}
              </RelatedCourseList>
            </RelatedCoursesCard>
          )}
        </Sidebar>
      </CourseContent>
    </Container>
  );
};

export default CourseDetailView; 