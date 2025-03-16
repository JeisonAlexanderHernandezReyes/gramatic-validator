import { DerivationStep, Grammar, TreeNode, ValidationResult } from "../../models/grammar.model";

export interface IGrammarService {
  validateWord(grammar: Grammar, word: string): ValidationResult;
  generateDerivationTree(steps: DerivationStep[]): TreeNode | null;
  generateGeneralTree(grammar: Grammar): TreeNode | null;
  addTerminal(grammar: Grammar, value: string): Grammar;
  addNonTerminal(grammar: Grammar, value: string): Grammar;
  addProduction(grammar: Grammar, left: string, right: string): Grammar;
  updateTerminal(grammar: Grammar, index: number, value: string): Grammar;
  updateNonTerminal(grammar: Grammar, index: number, value: string): Grammar;
  updateProduction(
    grammar: Grammar,
    index: number,
    field: "left" | "right",
    value: string
  ): Grammar;
  updateStartSymbol(grammar: Grammar, value: string): Grammar;
  validateGrammar(grammar: Grammar): boolean;
}