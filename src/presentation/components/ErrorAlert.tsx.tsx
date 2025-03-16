import React from 'react';
import { Alert, AlertTitle } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

interface ErrorAlertProps {
  message: string;
  onClose?: () => void;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <Alert 
      severity="error" 
      onClose={onClose}
      icon={<ErrorOutlineIcon />}
      sx={{ 
        my: 2, 
        alignItems: 'center', 
        '& .MuiAlert-message': { 
          width: '100%',
          textAlign: 'center' 
        } 
      }}
    >
      <AlertTitle sx={{ fontWeight: 'bold', textAlign: 'center' }}>
        Error
      </AlertTitle>
      {message}
    </Alert>
  );
};