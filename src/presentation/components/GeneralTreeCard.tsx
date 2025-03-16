import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Box,
  Paper
} from '@mui/material';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import { TreeNode } from '../../domain/models/grammar.model';

interface GeneralTreeCardProps {
  tree: TreeNode | null;
}

export const GeneralTreeCard: React.FC<GeneralTreeCardProps> = ({
  tree
}) => {
  if (!tree) return null;

  const renderNode = (node: TreeNode, depth: number = 0) => {
    return (
      <Box key={node.id} sx={{ ml: depth * 4, mb: 1 }}>
        <Box display="flex" alignItems="center">
          <Paper
            variant="outlined"
            sx={{
              px: 2,
              py: 1,
              fontFamily: 'monospace',
              fontSize: '0.9rem'
            }}
          >
            {node.node}
          </Paper>
        </Box>
        
        {node.children && node.children.length > 0 && (
          <Box
            sx={{
              borderLeft: '1px dashed',
              borderColor: 'divider',
              ml: 2,
              pl: 2,
              mt: 1
            }}
          >
            {node.children.map((child) => renderNode(child, depth + 1))}
          </Box>
        )}
      </Box>
    );
  };

  return (
    <Card>
      <CardHeader
        title="Árbol de Derivación General"
        titleTypographyProps={{ variant: 'h6', fontWeight: 'bold', textAlign: 'center' }}
        avatar={<AccountTreeIcon />}
      />
      <CardContent>
        {renderNode(tree)}
      </CardContent>
    </Card>
  );
};