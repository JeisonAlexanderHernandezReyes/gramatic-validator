import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  TextField,
  Button,
  Alert,
  AlertTitle,
} from "@mui/material";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { ValidationResult } from "../../domain/models/grammar.model";

interface WordValidationCardProps {
  word: string;
  onWordChange: (word: string) => void;
  onValidate: () => void;
  result: ValidationResult | null;
}

export const WordValidationCard: React.FC<WordValidationCardProps> = ({
  word,
  onWordChange,
  onValidate,
  result,
}) => {
  return (
    <Card>
      <CardHeader
        title="Validación de Palabra"
        titleTypographyProps={{
          variant: "h6",
          fontWeight: "bold",
          textAlign: "center",
        }}
        avatar={<PlaylistAddCheckIcon />}
      />
      <CardContent>
        <Box display="flex" gap={1} mb={3}>
          <TextField
            fullWidth
            size="small"
            value={word}
            onChange={(e) => onWordChange(e.target.value)}
            placeholder="Ingrese la palabra a validar"
          />
          <Button variant="contained" color="primary" onClick={onValidate}>
            Validar
          </Button>
        </Box>

        {result && (
          <Alert
            severity={result.isValid ? "success" : "error"}
            icon={result.isValid ? <CheckCircleIcon /> : <CancelIcon />}
            sx={{
              alignItems: "center",
              "& .MuiAlert-message": {
                width: "100%",
              },
            }}
          >
            <AlertTitle sx={{ fontWeight: "bold", textAlign: "center" }}>
              {result.isValid ? "Palabra Válida" : "Palabra Inválida"}
            </AlertTitle>
            <Typography>
              La palabra "{word}" {result.isValid ? "SÍ" : "NO"} pertenece al
              lenguaje generado por la gramática
            </Typography>
            <Box mt={1}>
              <Typography variant="body2">
                <strong>Derivación final:</strong>{" "}
                <code>{result.finalDerivation}</code>
              </Typography>
            </Box>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};
