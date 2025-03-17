import React from 'react';
import {
  Box,
  Container,
  Skeleton,
  Paper,
  Card,
  CardContent,
} from '@mui/material';

export const LessonViewSkeleton: React.FC = () => {
  return (
    <Container maxWidth="lg">
      {/* Breadcrumb Skeleton */}
      <Box sx={{ mb: 3, display: 'flex', gap: 1 }}>
        <Skeleton width={80} height={24} />
        <Skeleton width={20} height={24} />
        <Skeleton width={120} height={24} />
        <Skeleton width={20} height={24} />
        <Skeleton width={180} height={24} />
      </Box>

      {/* Lesson Content Paper */}
      <Paper elevation={2} sx={{ p: 4, mb: 4 }}>
        {/* Header with Title and Tools */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Skeleton variant="text" width="50%" height={48} />
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Skeleton variant="circular" width={40} height={40} />
            <Skeleton variant="circular" width={40} height={40} />
            <Skeleton variant="circular" width={40} height={40} />
          </Box>
        </Box>

        {/* Content Skeleton */}
        <Box sx={{ mb: 4 }}>
          <Skeleton variant="text" width="100%" height={24} />
          <Skeleton variant="text" width="95%" height={24} />
          <Skeleton variant="text" width="98%" height={24} />
          <Skeleton variant="text" width="90%" height={24} />
          <Box sx={{ my: 3 }}>
            <Skeleton variant="text" width="97%" height={24} />
            <Skeleton variant="text" width="94%" height={24} />
            <Skeleton variant="text" width="96%" height={24} />
          </Box>
          <Skeleton variant="text" width="92%" height={24} />
          <Skeleton variant="text" width="88%" height={24} />
        </Box>

        {/* Video Placeholder */}
        <Box sx={{ mt: 4 }}>
          <Skeleton variant="text" width="30%" height={32} sx={{ mb: 2 }} />
          <Skeleton 
            variant="rectangular" 
            width="100%" 
            height={400}
            sx={{ borderRadius: 1 }}
          />
        </Box>
      </Paper>

      {/* Navigation Card */}
      <Card>
        <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Skeleton variant="rectangular" width={120} height={36} sx={{ borderRadius: 1 }} />
          <Skeleton variant="rectangular" width={180} height={36} sx={{ borderRadius: 1 }} />
        </CardContent>
      </Card>
    </Container>
  );
};

export default LessonViewSkeleton; 