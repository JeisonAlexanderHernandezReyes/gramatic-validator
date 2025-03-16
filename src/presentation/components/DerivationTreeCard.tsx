import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Paper
} from '@mui/material';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import { DerivationStep } from '../../domain/models/grammar.model';

interface DerivationTreeCardProps {
  steps: DerivationStep[] | null;
}

export const DerivationTreeCard: React.FC<DerivationTreeCardProps> = ({
  steps
}) => {
  if (!steps || steps.length === 0) return null;

  return (
    <Card>
      <CardHeader
        title="Árbol de Derivación Particular"
        titleTypographyProps={{ variant: 'h6', fontWeight: 'bold', textAlign: 'center' }}
        avatar={<AccountTreeIcon />}
      />
      <CardContent>
        <Box display="flex" flexDirection="column" gap={1}>
          {steps.map((step, index) => (
            <Box key={index} display="flex" alignItems="center" gap={1}>
              <Typography 
                variant="body2" 
                component="span" 
                sx={{ 
                  width: '30px', 
                  textAlign: 'center',
                  fontWeight: 'bold'
                }}
              >
                {step.step}
              </Typography>
              
              {index > 0 && <ArrowRightAltIcon color="primary" />}
              
              <Paper
                variant="outlined"
                sx={{
                  px: 2,
                  py: 1,
                  fontFamily: 'monospace',
                  fontSize: '0.9rem',
                  flexGrow: 1
                }}
              >
                {step.symbol}
              </Paper>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};