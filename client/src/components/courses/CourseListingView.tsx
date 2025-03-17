import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../store';
import { selectUserPreferences } from '../../store/slices/userSlice';
import Button from '../common/Button';

// Types for course data
export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  estimatedHours: number;
  prerequisites: string[];
  tags: string[];
  imageUrl?: string;
  authorName: string;
  createdAt: Date;
  updatedAt: Date;
  modules: {
    id: string;
    title: string;
    estimatedMinutes: number;
  }[];
}

// Types for user progress
export interface CourseProgress {
  courseId: string;
  completedModules: string[];
  lastAccessedAt: Date;
  completionPercentage: number;
  isCompleted: boolean;
}

interface CourseListingViewProps {
  courses: Course[];
  userProgress: CourseProgress[];
}

// Main container
const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

// Page title
const PageTitle = styled.h1`
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
`;

// Filters container
const FiltersContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1rem;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

// Filter group
const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 200px;
`;

// Filter label
const FilterLabel = styled.label`
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
`;

// Select input
const SelectInput = styled.select`
  padding: 0.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.inputBackground};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}33;
  }
`;

// Display options
const DisplayOptions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

// View toggle
const ViewToggle = styled.div`
  display: flex;
  gap: 0.5rem;
`;

// Courses grid
const CoursesGrid = styled.div<{ displayDensity: 'compact' | 'comfortable' | 'spacious' }>`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${({ displayDensity, theme }) => 
    displayDensity === 'compact' 
      ? '1rem' 
      : displayDensity === 'comfortable' 
        ? '1.5rem' 
        : '2rem'};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

// Courses list
const CoursesList = styled.div<{ displayDensity: 'compact' | 'comfortable' | 'spacious' }>`
  display: flex;
  flex-direction: column;
  gap: ${({ displayDensity }) => 
    displayDensity === 'compact' 
      ? '0.75rem' 
      : displayDensity === 'comfortable' 
        ? '1rem' 
        : '1.5rem'};
`;

// Course card
const CourseCard = styled(Link)<{ level: string }>`
  display: flex;
  flex-direction: column;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.surface};
  text-decoration: none;
  color: ${({ theme }) => theme.colors.text.primary};
  transition: transform 0.2s, box-shadow 0.2s;
  position: relative;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background-color: ${({ theme, level }) => 
      level === 'beginner' 
        ? theme.colors.success 
        : level === 'intermediate' 
          ? theme.colors.warning 
          : theme.colors.error};
  }
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  .reduced-motion & {
    transition: none;
  }
`;

// Course list item
const CourseListItem = styled(Link)<{ level: string }>`
  display: flex;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.surface};
  text-decoration: none;
  color: ${({ theme }) => theme.colors.text.primary};
  transition: transform 0.2s, box-shadow 0.2s;
  position: relative;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background-color: ${({ theme, level }) => 
      level === 'beginner' 
        ? theme.colors.success 
        : level === 'intermediate' 
          ? theme.colors.warning 
          : theme.colors.error};
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  .reduced-motion & {
    transition: none;
  }
`;

// Course image
const CourseImage = styled.div<{ imageUrl?: string }>`
  height: 160px;
  background-image: url(${({ imageUrl }) => imageUrl || '/placeholder-course.jpg'});
  background-size: cover;
  background-position: center;
  position: relative;
`;

// Course list image
const CourseListImage = styled.div<{ imageUrl?: string }>`
  width: 120px;
  background-image: url(${({ imageUrl }) => imageUrl || '/placeholder-course.jpg'});
  background-size: cover;
  background-position: center;
  position: relative;
`;

// Progress indicator
const ProgressIndicator = styled.div<{ progress: number }>`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background-color: ${({ theme }) => theme.colors.border};
  
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: ${({ progress }) => `${progress}%`};
    background-color: ${({ theme }) => theme.colors.primary};
  }
`;

// Course content
const CourseContent = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

// Course list content
const CourseListContent = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

// Course title
const CourseTitle = styled.h2`
  font-size: 1.25rem;
  margin: 0 0 0.5rem 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
`;

// Course description
const CourseDescription = styled.p`
  font-size: 0.95rem;
  margin: 0 0 1rem 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.5;
  flex: 1;
  
  /* Limit to 3 lines with ellipsis */
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

// Course meta
const CourseMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

// Course tags
const CourseTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

// Course tag
const CourseTag = styled.span`
  font-size: 0.8rem;
  padding: 0.25rem 0.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text.secondary};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

// Level indicator
const LevelIndicator = styled.span<{ level: string }>`
  font-size: 0.8rem;
  padding: 0.25rem 0.5rem;
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

// Time estimate
const TimeEstimate = styled.span`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

// Empty state
const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px dashed ${({ theme }) => theme.colors.border};
`;

// Empty state icon
const EmptyStateIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.border};
`;

// Helper function to get course progress
const getCourseProgress = (courseId: string, userProgress: CourseProgress[]) => {
  const progress = userProgress.find(p => p.courseId === courseId);
  return progress || { 
    courseId, 
    completedModules: [], 
    lastAccessedAt: new Date(), 
    completionPercentage: 0, 
    isCompleted: false 
  };
};

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

const CourseListingView: React.FC<CourseListingViewProps> = ({ courses, userProgress }) => {
  // Get user preferences from Redux store
  const userPreferences = useAppSelector(selectUserPreferences);
  
  // State for filters and display options
  const [category, setCategory] = useState<string>('all');
  const [level, setLevel] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(
    userPreferences?.courseViewMode || 'grid'
  );
  const [displayDensity, setDisplayDensity] = useState<'compact' | 'comfortable' | 'spacious'>(
    userPreferences?.displayDensity || 'comfortable'
  );
  
  // Filtered and sorted courses
  const [filteredCourses, setFilteredCourses] = useState<Course[]>(courses);
  
  // Extract unique categories from courses
  const categories = ['all', ...new Set(courses.map(course => course.category))];
  
  // Apply filters and sorting
  useEffect(() => {
    let result = [...courses];
    
    // Apply category filter
    if (category !== 'all') {
      result = result.filter(course => course.category === category);
    }
    
    // Apply level filter
    if (level !== 'all') {
      result = result.filter(course => course.level === level);
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
      case 'oldest':
        result.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
        break;
      case 'title':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'progress':
        result.sort((a, b) => {
          const progressA = getCourseProgress(a.id, userProgress).completionPercentage;
          const progressB = getCourseProgress(b.id, userProgress).completionPercentage;
          return progressB - progressA;
        });
        break;
      default:
        break;
    }
    
    setFilteredCourses(result);
  }, [courses, category, level, sortBy, userProgress]);
  
  // Render course cards in grid view
  const renderCourseCards = () => {
    if (filteredCourses.length === 0) {
      return (
        <EmptyState>
          <EmptyStateIcon>📚</EmptyStateIcon>
          <h3>No courses found</h3>
          <p>Try adjusting your filters or check back later for new courses</p>
        </EmptyState>
      );
    }
    
    return (
      <CoursesGrid displayDensity={displayDensity}>
        {filteredCourses.map(course => {
          const progress = getCourseProgress(course.id, userProgress);
          
          return (
            <CourseCard 
              key={course.id} 
              to={`/courses/${course.id}`} 
              level={course.level}
              aria-label={`${course.title} - ${course.level} level course, ${formatTimeEstimate(course.estimatedHours)}`}
            >
              <CourseImage imageUrl={course.imageUrl}>
                <ProgressIndicator progress={progress.completionPercentage} />
              </CourseImage>
              
              <CourseContent>
                <CourseTitle>{course.title}</CourseTitle>
                <CourseDescription>{course.description}</CourseDescription>
                
                <CourseTags>
                  <LevelIndicator level={course.level}>
                    {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                  </LevelIndicator>
                  
                  {course.tags.slice(0, 2).map(tag => (
                    <CourseTag key={tag}>{tag}</CourseTag>
                  ))}
                </CourseTags>
                
                <CourseMeta>
                  <TimeEstimate>
                    ⏱️ {formatTimeEstimate(course.estimatedHours)}
                  </TimeEstimate>
                  
                  {progress.completionPercentage > 0 && !progress.isCompleted && (
                    <span>{progress.completionPercentage}% complete</span>
                  )}
                  
                  {progress.isCompleted && (
                    <span>✅ Completed</span>
                  )}
                </CourseMeta>
              </CourseContent>
            </CourseCard>
          );
        })}
      </CoursesGrid>
    );
  };
  
  // Render course items in list view
  const renderCourseList = () => {
    if (filteredCourses.length === 0) {
      return (
        <EmptyState>
          <EmptyStateIcon>📚</EmptyStateIcon>
          <h3>No courses found</h3>
          <p>Try adjusting your filters or check back later for new courses</p>
        </EmptyState>
      );
    }
    
    return (
      <CoursesList displayDensity={displayDensity}>
        {filteredCourses.map(course => {
          const progress = getCourseProgress(course.id, userProgress);
          
          return (
            <CourseListItem 
              key={course.id} 
              to={`/courses/${course.id}`} 
              level={course.level}
              aria-label={`${course.title} - ${course.level} level course, ${formatTimeEstimate(course.estimatedHours)}`}
            >
              <CourseListImage imageUrl={course.imageUrl}>
                <ProgressIndicator progress={progress.completionPercentage} />
              </CourseListImage>
              
              <CourseListContent>
                <CourseTitle>{course.title}</CourseTitle>
                <CourseDescription>{course.description}</CourseDescription>
                
                <CourseTags>
                  <LevelIndicator level={course.level}>
                    {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                  </LevelIndicator>
                  
                  {course.tags.slice(0, 3).map(tag => (
                    <CourseTag key={tag}>{tag}</CourseTag>
                  ))}
                </CourseTags>
                
                <CourseMeta>
                  <TimeEstimate>
                    ⏱️ {formatTimeEstimate(course.estimatedHours)}
                  </TimeEstimate>
                  
                  {progress.completionPercentage > 0 && !progress.isCompleted && (
                    <span>{progress.completionPercentage}% complete</span>
                  )}
                  
                  {progress.isCompleted && (
                    <span>✅ Completed</span>
                  )}
                </CourseMeta>
              </CourseListContent>
            </CourseListItem>
          );
        })}
      </CoursesList>
    );
  };
  
  return (
    <Container>
      <PageTitle>Courses</PageTitle>
      
      <FiltersContainer>
        <FilterGroup>
          <FilterLabel htmlFor="category-filter">Category</FilterLabel>
          <SelectInput 
            id="category-filter"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat}
              </option>
            ))}
          </SelectInput>
        </FilterGroup>
        
        <FilterGroup>
          <FilterLabel htmlFor="level-filter">Level</FilterLabel>
          <SelectInput 
            id="level-filter"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
          >
            <option value="all">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </SelectInput>
        </FilterGroup>
        
        <FilterGroup>
          <FilterLabel htmlFor="sort-filter">Sort By</FilterLabel>
          <SelectInput 
            id="sort-filter"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="title">Title (A-Z)</option>
            <option value="progress">Your Progress</option>
          </SelectInput>
        </FilterGroup>
      </FiltersContainer>
      
      <DisplayOptions>
        <ViewToggle>
          <Button
            variant={viewMode === 'grid' ? 'primary' : 'secondary'}
            size="small"
            onClick={() => setViewMode('grid')}
            ariaLabel="View as grid"
            icon="grid"
          >
            Grid
          </Button>
          <Button
            variant={viewMode === 'list' ? 'primary' : 'secondary'}
            size="small"
            onClick={() => setViewMode('list')}
            ariaLabel="View as list"
            icon="list"
          >
            List
          </Button>
        </ViewToggle>
        
        <FilterGroup>
          <FilterLabel htmlFor="density-filter">Display Density</FilterLabel>
          <SelectInput 
            id="density-filter"
            value={displayDensity}
            onChange={(e) => setDisplayDensity(e.target.value as 'compact' | 'comfortable' | 'spacious')}
          >
            <option value="compact">Compact</option>
            <option value="comfortable">Comfortable</option>
            <option value="spacious">Spacious</option>
          </SelectInput>
        </FilterGroup>
      </DisplayOptions>
      
      {viewMode === 'grid' ? renderCourseCards() : renderCourseList()}
    </Container>
  );
};

export default CourseListingView; 