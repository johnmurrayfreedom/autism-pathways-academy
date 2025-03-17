import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Breadcrumbs,
  Link,
  Paper,
  Card,
  CardContent,
  Button,
  Alert,
  IconButton,
  Tooltip,
  useTheme,
} from '@mui/material';
import {
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  VolumeUp as VolumeUpIcon,
  NavigateNext as NextIcon,
  NavigateBefore as PrevIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { Layout } from '../components/layout/Layout';
import CourseService, { Lesson, Course } from '../services/course';
import { LessonViewSkeleton } from '../components/skeletons/LessonViewSkeleton';
import { AiTutor } from '../components/AiTutor/AiTutor';

export const LessonView: React.FC = () => {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const navigate = useNavigate();
  const theme = useTheme();

  const [course, setCourse] = useState<Course | null>(null);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [fontSize, setFontSize] = useState(16);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSpeechSynthesis(window.speechSynthesis);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!courseId || !lessonId) return;

      try {
        setIsLoading(true);
        const [fetchedCourse, fetchedLesson] = await Promise.all([
          CourseService.getCourse(parseInt(courseId)),
          CourseService.getLesson(parseInt(lessonId)),
        ]);
        setCourse(fetchedCourse);
        setLesson(fetchedLesson);
      } catch (err) {
        setError('Failed to load lesson. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [courseId, lessonId]);

  const handleKeyNavigation = useCallback((event: KeyboardEvent) => {
    if (!course || !lesson) return;

    const allLessons = course.modules.flatMap(m => m.lessons);
    const currentIndex = allLessons.findIndex(l => l.id === lesson.id);

    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        if (currentIndex > 0) {
          const prevLesson = allLessons[currentIndex - 1];
          navigate(`/courses/${courseId}/lessons/${prevLesson.id}`);
        }
        break;
      case 'ArrowRight':
        event.preventDefault();
        if (currentIndex < allLessons.length - 1) {
          const nextLesson = allLessons[currentIndex + 1];
          navigate(`/courses/${courseId}/lessons/${nextLesson.id}`);
        }
        break;
      case '+':
        event.preventDefault();
        setFontSize(prev => Math.min(prev + 2, 24));
        break;
      case '-':
        event.preventDefault();
        setFontSize(prev => Math.max(prev - 2, 12));
        break;
      case 'r':
        event.preventDefault();
        handleReadContent();
        break;
    }
  }, [course, lesson, courseId, navigate]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyNavigation);
    return () => window.removeEventListener('keydown', handleKeyNavigation);
  }, [handleKeyNavigation]);

  const handleReadContent = () => {
    if (!speechSynthesis || !lesson) return;

    if (isSpeaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const utterance = new SpeechSynthesisUtterance(lesson.content);
      utterance.onend = () => setIsSpeaking(false);
      speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  const handleCompleteLesson = async () => {
    if (!courseId || !lessonId) return;

    try {
      await CourseService.completeLesson(parseInt(lessonId));
      // Navigate to next lesson if available
      if (course) {
        const allLessons = course.modules.flatMap(m => m.lessons);
        const currentIndex = allLessons.findIndex(l => l.id === lesson?.id);
        if (currentIndex < allLessons.length - 1) {
          navigate(`/courses/${courseId}/lessons/${allLessons[currentIndex + 1].id}`);
        } else {
          navigate(`/courses/${courseId}`);
        }
      }
    } catch (err) {
      setError('Failed to mark lesson as complete. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <LessonViewSkeleton />
      </Layout>
    );
  }

  if (error || !lesson || !course) {
    return (
      <Layout>
        <Alert severity="error">{error || 'Lesson not found'}</Alert>
      </Layout>
    );
  }

  const currentModule = course.modules.find(m => 
    m.lessons.some(l => l.id === lesson.id)
  );

  return (
    <Layout>
      <Container maxWidth="lg">
        {/* Breadcrumb Navigation */}
        <Breadcrumbs aria-label="lesson navigation" sx={{ mb: 3 }}>
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
          <Link
            component="button"
            variant="body1"
            onClick={() => navigate(`/courses/${courseId}`)}
            underline="hover"
            color="inherit"
            aria-label={`Return to ${course.title}`}
          >
            {course.title}
          </Link>
          <Typography color="text.primary">
            {currentModule?.title} - Lesson {lesson.order}
          </Typography>
        </Breadcrumbs>

        {/* Lesson Content */}
        <Paper
          elevation={3}
          sx={{
            p: 4,
            mb: 4,
            backgroundColor: theme.palette.background.paper,
          }}
        >
          {/* Accessibility Tools */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Tooltip title="Decrease font size (-)">
              <IconButton onClick={() => setFontSize(prev => Math.max(prev - 2, 12))}>
                <ZoomOutIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Increase font size (+)">
              <IconButton onClick={() => setFontSize(prev => Math.min(prev + 2, 24))}>
                <ZoomInIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title={isSpeaking ? 'Stop reading (R)' : 'Read content (R)'}>
              <IconButton
                onClick={handleReadContent}
                color={isSpeaking ? 'primary' : 'default'}
              >
                <VolumeUpIcon />
              </IconButton>
            </Tooltip>
          </Box>

          <Typography variant="h4" component="h1" gutterBottom>
            {lesson.title}
          </Typography>

          <Typography
            variant="body1"
            sx={{
              fontSize: `${fontSize}px`,
              lineHeight: 1.6,
              '& p': { mb: 2 },
              '& h2': { mt: 4, mb: 2 },
              '& ul, & ol': { mb: 2, pl: 3 },
            }}
          >
            {lesson.content}
          </Typography>

          {lesson.video_url && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Video Content
              </Typography>
              <Box
                component="iframe"
                src={lesson.video_url}
                sx={{
                  width: '100%',
                  height: '480px',
                  border: 'none',
                  borderRadius: 1,
                }}
                title={`Video for ${lesson.title}`}
                allowFullScreen
              />
            </Box>
          )}
        </Paper>

        {/* Navigation Card */}
        <Card>
          <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Button
              startIcon={<PrevIcon />}
              onClick={() => {
                const allLessons = course.modules.flatMap(m => m.lessons);
                const currentIndex = allLessons.findIndex(l => l.id === lesson.id);
                if (currentIndex > 0) {
                  navigate(`/courses/${courseId}/lessons/${allLessons[currentIndex - 1].id}`);
                }
              }}
              disabled={lesson.order === 1}
              aria-label="Previous lesson"
            >
              Previous Lesson
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCompleteLesson}
              startIcon={<CheckCircleIcon />}
              aria-label="Mark lesson as complete"
            >
              Complete & Continue
            </Button>
            <Button
              endIcon={<NextIcon />}
              onClick={() => {
                const allLessons = course.modules.flatMap(m => m.lessons);
                const currentIndex = allLessons.findIndex(l => l.id === lesson.id);
                if (currentIndex < allLessons.length - 1) {
                  navigate(`/courses/${courseId}/lessons/${allLessons[currentIndex + 1].id}`);
                }
              }}
              disabled={lesson.order === course.modules.flatMap(m => m.lessons).length}
              aria-label="Next lesson"
            >
              Next Lesson
            </Button>
          </CardContent>
        </Card>
      </Container>
      <AiTutor
        courseId={courseId ? parseInt(courseId) : undefined}
        lessonId={lessonId ? parseInt(lessonId) : undefined}
        moduleName={currentModule?.title}
        lessonTitle={lesson?.title}
      />
    </Layout>
  );
};

export default LessonView; 