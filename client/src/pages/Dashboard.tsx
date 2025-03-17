import React, { useEffect, useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  LinearProgress,
  Button,
} from '@mui/material';
import { Layout } from '../components/layout/Layout';
import { CourseService, Course, CourseProgress } from '../services/course';

export const Dashboard: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [courseProgress, setCourseProgress] = useState<Record<number, CourseProgress>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const fetchedCourses = await CourseService.getCourses();
        setCourses(fetchedCourses);

        // Fetch progress for each course
        const progressPromises = fetchedCourses.map(course =>
          CourseService.getCourseProgress(course.id)
            .then(progress => ({ [course.id]: progress }))
            .catch(() => ({ [course.id]: null }))
        );

        const progressResults = await Promise.all(progressPromises);
        const progressMap = progressResults.reduce(
          (acc, curr) => ({ ...acc, ...curr }),
          {}
        );

        setCourseProgress(progressMap);
      } catch (err) {
        setError('Failed to load courses. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const calculateProgress = (course: Course): number => {
    const progress = courseProgress[course.id];
    if (!progress) return 0;

    const totalLessons = course.modules.reduce(
      (total, module) => total + module.lessons.length,
      0
    );
    return (progress.completed_lessons.length / totalLessons) * 100;
  };

  return (
    <Layout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          My Learning Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Track your progress and continue your learning journey
        </Typography>
      </Box>

      {isLoading ? (
        <LinearProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <Grid container spacing={3}>
          {courses.map((course) => (
            <Grid item xs={12} sm={6} md={4} key={course.id}>
              <Card>
                <CardMedia
                  component="img"
                  height="140"
                  image={course.image_url || '/placeholder-course.jpg'}
                  alt={course.title}
                />
                <CardContent>
                  <Typography gutterBottom variant="h6" component="div">
                    {course.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      mb: 2,
                    }}
                  >
                    {course.description}
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Progress: {Math.round(calculateProgress(course))}%
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={calculateProgress(course)}
                      sx={{ mt: 1 }}
                    />
                  </Box>

                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => {
                      const progress = courseProgress[course.id];
                      if (!progress) {
                        CourseService.startCourse(course.id)
                          .then(() => window.location.href = `/courses/${course.id}`)
                          .catch(err => setError('Failed to start course. Please try again.'));
                      } else {
                        window.location.href = `/courses/${course.id}`;
                      }
                    }}
                  >
                    {courseProgress[course.id] ? 'Continue Learning' : 'Start Course'}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Layout>
  );
};

export default Dashboard; 