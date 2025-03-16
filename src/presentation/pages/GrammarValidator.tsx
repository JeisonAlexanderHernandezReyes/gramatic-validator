import React, { useState } from 'react';
import { Container, Typography, Grid, Box } from '@mui/material';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { SystemInfoCard } from '../components/SystemInfoCard';
import { GrammarDefinitionCard } from '../components/GrammarDefinitionCard';
import { WordValidationCard } from '../components/WordValidationCard';
import { DerivationTreeCard } from '../components/DerivationTreeCard';
import { GeneralTreeCard } from '../components/GeneralTreeCard';
import { LoadingProgress } from '../components/LoadingProgress';
import { useGrammarValidator } from '../../application/hooks/useGrammarValidator';
import { ErrorAlert } from '../components/ErrorAlert.tsx';

const GrammarValidator: React.FC = () => {
  const {
    grammar,
    word,
    setWord,
    result,
    derivationTree,
    generalTree,
    systemInfo,
    error,
    isLoading,
    validateWord,
    addTerminal,
    addNonTerminal,
    addProduction,
    updateTerminal,
    updateNonTerminal,
    updateProduction,
    updateStartSymbol
  } = useGrammarValidator();

  // Estado local para manejar el cierre de alertas
  const [showError, setShowError] = useState<boolean>(true);

  const handleCloseError = () => {
    setShowError(false);
  };

  // Manejador de cambios en la palabra a validar
  const handleWordChange = (newWord: string) => {
    setWord(newWord);
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <LoadingProgress message="Inicializando el validador de gramáticas..." />
      </Container>
    );
  }

  return (
    <ErrorBoundary>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom 
          align="center"
          fontWeight="bold"
          sx={{ mb: 4 }}
        >
          Validador de Palabras en Gramáticas Formales
        </Typography>

        {error && showError && (
          <ErrorAlert message={error} onClose={handleCloseError} />
        )}

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <SystemInfoCard systemInfo={systemInfo} />
          </Grid>
          <Grid item xs={12} md={6}>
            <GrammarDefinitionCard
              grammar={grammar}
              onAddTerminal={addTerminal}
              onAddNonTerminal={addNonTerminal}
              onAddProduction={addProduction}
              onUpdateTerminal={updateTerminal}
              onUpdateNonTerminal={updateNonTerminal}
              onUpdateProduction={updateProduction}
              onUpdateStartSymbol={updateStartSymbol}
            />
          </Grid>
        </Grid>

        <Box sx={{ mb: 4 }}>
          <WordValidationCard
            word={word}
            onWordChange={handleWordChange}
            onValidate={validateWord}
            result={result}
          />
        </Box>

        {result && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <DerivationTreeCard steps={result.steps} />
            </Grid>
            <Grid item xs={12} md={6}>
              <GeneralTreeCard tree={generalTree} />
            </Grid>
          </Grid>
        )}
      </Container>
    </ErrorBoundary>
  );
};

export default GrammarValidator;