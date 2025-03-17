import React from 'react';
import {
  Box,
  Container,
  Skeleton,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';

export const CourseDetailSkeleton: React.FC = () => {
  return (
    <Container maxWidth="lg">
      {/* Breadcrumb Skeleton */}
      <Box sx={{ mb: 3, display: 'flex', gap: 1 }}>
        <Skeleton width={80} height={24} />
        <Skeleton width={20} height={24} />
        <Skeleton width={150} height={24} />
      </Box>

      {/* Course Header Skeleton */}
      <Box sx={{ mb: 4 }}>
        <Skeleton variant="text" width="60%" height={48} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="100%" height={24} />
        <Skeleton variant="text" width="90%" height={24} />
      </Box>

      {/* Progress Card Skeleton */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Skeleton variant="text" width="30%" height={32} sx={{ mb: 2 }} />
          <Skeleton variant="rectangular" width="100%" height={10} sx={{ borderRadius: 5 }} />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
            <Skeleton variant="text" width={100} height={24} />
          </Box>
        </CardContent>
      </Card>

      {/* Course Content Title Skeleton */}
      <Skeleton variant="text" width="40%" height={32} sx={{ mb: 3 }} />

      {/* Module Accordions Skeleton */}
      {[1, 2, 3].map((index) => (
        <Accordion key={index} sx={{ mb: 2 }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`panel${index}-content`}
            id={`panel${index}-header`}
          >
            <Box sx={{ width: '100%' }}>
              <Skeleton variant="text" width="40%" height={28} />
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <Skeleton 
                  variant="rectangular" 
                  width="100%" 
                  height={6} 
                  sx={{ borderRadius: 3, mr: 2 }} 
                />
                <Skeleton variant="text" width={50} height={24} />
              </Box>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            {[1, 2, 3].map((lessonIndex) => (
              <Box
                key={lessonIndex}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  py: 1,
                  gap: 2,
                }}
              >
                <Skeleton variant="circular" width={24} height={24} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant="text" width="60%" height={24} />
                  <Skeleton variant="text" width="30%" height={20} />
                </Box>
                <Skeleton variant="circular" width={24} height={24} />
              </Box>
            ))}
          </AccordionDetails>
        </Accordion>
      ))}
    </Container>
  );
};

export default CourseDetailSkeleton; 