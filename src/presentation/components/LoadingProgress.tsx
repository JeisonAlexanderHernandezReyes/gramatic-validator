import React from 'react';
import {
  Box,
  CircularProgress,
  Typography
} from '@mui/material';

interface LoadingProgressProps {
  message?: string;
}

export const LoadingProgress: React.FC<LoadingProgressProps> = ({
  message = 'Cargando...'
}) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={{ minHeight: '200px' }}
    >
      <CircularProgress size={50} />
      <Typography variant="body1" sx={{ mt: 2 }}>
        {message}
      </Typography>
    </Box>
  );
};