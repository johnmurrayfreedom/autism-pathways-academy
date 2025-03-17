import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Breadcrumbs,
  Link,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  LinearProgress,
  Button,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as UncheckedIcon,
  PlayCircleOutline as PlayIcon,
} from '@mui/icons-material';
import { Layout } from '../components/layout/Layout';
import CourseService, { Course, Module, CourseProgress } from '../services/course';
import { CourseDetailSkeleton } from '../components/skeletons/CourseDetailSkeleton';
import { AiTutor } from '../components/AiTutor/AiTutor';

export const CourseDetail: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [progress, setProgress] = useState<CourseProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [expandedModule, setExpandedModule] = useState<string | false>(false);
  const [focusedLesson, setFocusedLesson] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourseData = async () => {
      if (!courseId) return;
      
      try {
        setIsLoading(true);
        const [fetchedCourse, courseProgress] = await Promise.all([
          CourseService.getCourse(parseInt(courseId)),
          CourseService.getCourseProgress(parseInt(courseId)),
        ]);
        
        setCourse(fetchedCourse);
        setProgress(courseProgress);
        
        // Expand the first incomplete module by default
        if (fetchedCourse.modules.length > 0) {
          const firstIncompleteModule = fetchedCourse.modules.find(module =>
            module.lessons.some(lesson => 
              !courseProgress?.completed_lessons.includes(lesson.id)
            )
          );
          setExpandedModule(firstIncompleteModule?.id.toString() || fetchedCourse.modules[0].id.toString());
        }
      } catch (err) {
        setError('Failed to load course details. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId]);

  const handleModuleChange = (moduleId: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedModule(isExpanded ? moduleId : false);
  };

  const isLessonCompleted = (lessonId: number) => {
    return progress?.completed_lessons.includes(lessonId) || false;
  };

  const calculateModuleProgress = (module: Module): number => {
    if (!progress) return 0;
    const completedLessons = module.lessons.filter(lesson => 
      progress.completed_lessons.includes(lesson.id)
    ).length;
    return (completedLessons / module.lessons.length) * 100;
  };

  const handleKeyNavigation = useCallback((event: KeyboardEvent) => {
    if (!course) return;

    const allLessons = course.modules.flatMap(m => m.lessons);
    const currentIndex = focusedLesson ? allLessons.findIndex(l => l.id.toString() === focusedLesson) : -1;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (currentIndex < allLessons.length - 1) {
          const nextLesson = allLessons[currentIndex + 1];
          setFocusedLesson(nextLesson.id.toString());
          setExpandedModule(course.modules.find(m => 
            m.lessons.some(l => l.id === nextLesson.id)
          )?.id.toString() || false);
          document.getElementById(`lesson-${nextLesson.id}`)?.focus();
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (currentIndex > 0) {
          const prevLesson = allLessons[currentIndex - 1];
          setFocusedLesson(prevLesson.id.toString());
          setExpandedModule(course.modules.find(m => 
            m.lessons.some(l => l.id === prevLesson.id)
          )?.id.toString() || false);
          document.getElementById(`lesson-${prevLesson.id}`)?.focus();
        }
        break;
      case 'Enter':
      case ' ':
        if (focusedLesson) {
          event.preventDefault();
          navigate(`/courses/${courseId}/lessons/${focusedLesson}`);
        }
        break;
    }
  }, [course, focusedLesson, courseId, navigate]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyNavigation);
    return () => window.removeEventListener('keydown', handleKeyNavigation);
  }, [handleKeyNavigation]);

  if (isLoading) {
    return (
      <Layout>
        <CourseDetailSkeleton />
      </Layout>
    );
  }

  if (error || !course) {
    return (
      <Layout>
        <Alert severity="error">{error || 'Course not found'}</Alert>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container maxWidth="lg">
        {/* Breadcrumb Navigation */}
        <Breadcrumbs aria-label="course navigation" sx={{ mb: 3 }}>
          <Link
            component="button"
            variant="body1"
            onClick={() => navigate('/dashboard')}
            underline="hover"
            color="inherit"
            aria-label="Return to dashboard"
          >
            Dashboard
          </Link>
          <Typography color="text.primary">{course.title}</Typography>
        </Breadcrumbs>

        {/* Course Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {course.title}
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            {course.description}
          </Typography>
        </Box>

        {/* Course Progress Overview */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Your Progress
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Box sx={{ flexGrow: 1, mr: 2 }}>
                <LinearProgress
                  variant="determinate"
                  value={
                    (progress?.completed_lessons.length || 0) /
                    course.modules.reduce((total, m) => total + m.lessons.length, 0) * 100
                  }
                  sx={{ height: 10, borderRadius: 5 }}
                />
              </Box>
              <Typography variant="body2" color="text.secondary">
                {progress?.completed_lessons.length || 0} / {
                  course.modules.reduce((total, m) => total + m.lessons.length, 0)
                } lessons completed
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Modules and Lessons */}
        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
          Course Content
        </Typography>
        
        {course.modules.map((module) => (
          <Accordion
            key={module.id}
            expanded={expandedModule === module.id.toString()}
            onChange={handleModuleChange(module.id.toString())}
            sx={{ mb: 2 }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`module-${module.id}-content`}
              id={`module-${module.id}-header`}
            >
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h6">
                  Module {module.order}: {module.title}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={calculateModuleProgress(module)}
                    sx={{ flexGrow: 1, mr: 2, height: 6, borderRadius: 3 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {Math.round(calculateModuleProgress(module))}% Complete
                  </Typography>
                </Box>
              </Box>
            </AccordionSummary>
            
            <AccordionDetails>
              <List>
                {module.lessons.map((lesson) => (
                  <ListItem
                    key={lesson.id}
                    disablePadding
                    sx={{
                      backgroundColor: isLessonCompleted(lesson.id)
                        ? 'action.selected'
                        : 'transparent',
                    }}
                  >
                    <ListItemButton
                      id={`lesson-${lesson.id}`}
                      onClick={() => navigate(`/courses/${courseId}/lessons/${lesson.id}`)}
                      onFocus={() => setFocusedLesson(lesson.id.toString())}
                      aria-label={`${lesson.title} - Lesson ${lesson.order}${
                        isLessonCompleted(lesson.id) ? ' (Completed)' : ''
                      }`}
                      tabIndex={0}
                    >
                      <ListItemIcon>
                        {isLessonCompleted(lesson.id) ? (
                          <CheckCircleIcon color="success" />
                        ) : (
                          <UncheckedIcon />
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary={lesson.title}
                        secondary={`Lesson ${lesson.order}`}
                      />
                      <PlayIcon />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        ))}
      </Container>
      <AiTutor
        courseId={courseId ? parseInt(courseId) : undefined}
        moduleName={course?.modules.find(m => m.id.toString() === expandedModule)?.title}
      />
    </Layout>
  );
};

export default CourseDetail; 