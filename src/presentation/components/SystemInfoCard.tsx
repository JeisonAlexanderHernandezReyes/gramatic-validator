import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@mui/material";
import ComputerIcon from "@mui/icons-material/Computer";

interface SystemInfoProps {
  systemInfo: {
    language: string;
    os: string;
    processor: string;
    memory: string;
    motherboard: string;
  };
}

export const SystemInfoCard: React.FC<SystemInfoProps> = ({ systemInfo }) => {
  return (
    <Card>
      <CardHeader
        title="Información del Sistema"
        titleTypographyProps={{
          variant: "h6",
          fontWeight: "bold",
          textAlign: "center",
        }}
        avatar={<ComputerIcon />}
      />
      <CardContent>
        <Table>
          <TableBody>
            {Object.entries(systemInfo).map(([key, value]) => (
              <TableRow key={key}>
                <TableCell
                  component="th"
                  scope="row"
                  sx={{ fontWeight: "bold" }}
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)}:
                </TableCell>
                <TableCell>{value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
