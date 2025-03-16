import { Card, CardHeader, CardContent, Box, Typography, Grid, TextField, IconButton, FormControl, Select, MenuItem, Button } from "@mui/material";
import { Grammar } from "../../domain/models/grammar.model";
import DescriptionIcon from '@mui/icons-material/Description';
import AddIcon from '@mui/icons-material/Add';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';

interface GrammarDefinitionCardProps {
  grammar: Grammar;
  onAddTerminal: () => void;
  onAddNonTerminal: () => void;
  onAddProduction: () => void;
  onUpdateTerminal: (index: number, value: string) => void;
  onUpdateNonTerminal: (index: number, value: string) => void;
  onUpdateProduction: (index: number, field: 'left' | 'right', value: string) => void;
  onUpdateStartSymbol: (value: string) => void;
}

export const GrammarDefinitionCard: React.FC<GrammarDefinitionCardProps> = ({
  grammar,
  onAddTerminal,
  onAddNonTerminal,
  onAddProduction,
  onUpdateTerminal,
  onUpdateNonTerminal,
  onUpdateProduction,
  onUpdateStartSymbol
}) => {
  return (
    <Card>
      <CardHeader
        title="Definición de la Gramática"
        titleTypographyProps={{ variant: 'h6', fontWeight: 'bold', textAlign: 'center' }}
        avatar={<DescriptionIcon />}
      />
      <CardContent>
        <Box mb={3}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Símbolos Terminales:
          </Typography>
          <Grid container spacing={1} alignItems="center">
            {grammar.terminals.map((terminal, index) => (
              <Grid item key={terminal.id}>
                <TextField
                  size="small"
                  inputProps={{ maxLength: 1, style: { textAlign: 'center' } }}
                  sx={{ width: '60px' }}
                  value={terminal.value}
                  onChange={(e) => onUpdateTerminal(index, e.target.value)}
                />
              </Grid>
            ))}
            <Grid item>
              <IconButton
                color="primary"
                onClick={onAddTerminal}
                size="small"
                sx={{ border: '1px dashed', borderRadius: 1 }}
              >
                <AddIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Box>

        <Box mb={3}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Símbolos No Terminales:
          </Typography>
          <Grid container spacing={1} alignItems="center">
            {grammar.nonTerminals.map((nonTerminal, index) => (
              <Grid item key={nonTerminal.id}>
                <TextField
                  size="small"
                  inputProps={{ maxLength: 1, style: { textAlign: 'center' } }}
                  sx={{ width: '60px' }}
                  value={nonTerminal.value}
                  onChange={(e) => onUpdateNonTerminal(index, e.target.value)}
                />
              </Grid>
            ))}
            <Grid item>
              <IconButton
                color="primary"
                onClick={onAddNonTerminal}
                size="small"
                sx={{ border: '1px dashed', borderRadius: 1 }}
              >
                <AddIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Box>

        <Box mb={3}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Símbolo Inicial:
          </Typography>
          <FormControl fullWidth size="small">
            <Select
              value={grammar.startSymbol}
              onChange={(e) => onUpdateStartSymbol(e.target.value)}
              displayEmpty
            >
              {grammar.nonTerminals.map((nt) => (
                <MenuItem key={nt.id} value={nt.value}>
                  {nt.value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box mb={2}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Producciones:
          </Typography>
          {grammar.productions.map((production, index) => (
            <Box
              key={production.id}
              display="flex"
              alignItems="center"
              mb={1}
              gap={1}
            >
              <FormControl size="small" sx={{ width: '80px' }}>
                <Select
                  value={production.left}
                  onChange={(e) => onUpdateProduction(index, 'left', e.target.value)}
                  displayEmpty
                >
                  <MenuItem value="">-</MenuItem>
                  {grammar.nonTerminals.map((nt) => (
                    <MenuItem key={nt.id} value={nt.value}>
                      {nt.value}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <ArrowRightAltIcon />

              <TextField
                fullWidth
                size="small"
                value={production.right}
                onChange={(e) => onUpdateProduction(index, 'right', e.target.value)}
                placeholder="Parte derecha de la producción"
              />
            </Box>
          ))}
          <Button
            startIcon={<AddIcon />}
            variant="outlined"
            fullWidth
            onClick={onAddProduction}
            sx={{ mt: 1 }}
          >
            Agregar Producción
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};