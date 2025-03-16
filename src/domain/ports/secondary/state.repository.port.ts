import { Grammar, ValidationResult, TreeNode } from '../../models/grammar.model';

export interface IGrammarStateRepository {
  saveGrammar(grammar: Grammar): void;
  loadGrammar(): Grammar;
  saveValidationResult(result: ValidationResult): void;
  loadValidationResult(): ValidationResult | null;
  saveDerivationTree(tree: TreeNode | null): void;
  loadDerivationTree(): TreeNode | null;
  saveGeneralTree(tree: TreeNode | null): void;
  loadGeneralTree(): TreeNode | null;
}