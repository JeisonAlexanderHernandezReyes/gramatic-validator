import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Alert, AlertTitle } from '@mui/material';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Error capturado en boundary:', error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <Alert 
          severity="error"
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
            Error en la aplicación
          </AlertTitle>
          <p>
            Ha ocurrido un error inesperado: {this.state.error?.message}
          </p>
          <p>
            Por favor, recargue la página o contacte al administrador.
          </p>
        </Alert>
      );
    }

    return this.props.children;
  }
}