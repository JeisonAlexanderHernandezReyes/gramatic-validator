export interface Terminal {
    id: string;
    value: string;
  }
  
  export interface NonTerminal {
    id: string;
    value: string;
  }
  
  export interface Production {
    id: string;
    left: string;
    right: string;
  }
  
  export interface Grammar {
    terminals: Terminal[];
    nonTerminals: NonTerminal[];
    startSymbol: string;
    productions: Production[];
  }
  
  export interface DerivationStep {
    symbol: string;
    step: number;
  }
  
  export interface ValidationResult {
    isValid: boolean;
    steps: DerivationStep[];
    finalDerivation: string;
  }
  
  export interface TreeNode {
    id: string;
    node: string;
    children: TreeNode[];
  }