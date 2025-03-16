import { IGrammarStateRepository } from '../../domain/ports/secondary/state.repository.port';
import { Grammar, ValidationResult, TreeNode } from '../../domain/models/grammar.model';
import { v4 as uuidv4 } from 'uuid';

export class LocalStorageGrammarRepository implements IGrammarStateRepository {
  private readonly GRAMMAR_KEY = 'grammar_validator_grammar';
  private readonly VALIDATION_RESULT_KEY = 'grammar_validator_result';
  private readonly DERIVATION_TREE_KEY = 'grammar_validator_derivation_tree';
  private readonly GENERAL_TREE_KEY = 'grammar_validator_general_tree';

  /**
   * Guarda la gramática en localStorage
   * @param grammar Gramática a guardar
   */
  public saveGrammar(grammar: Grammar): void {
    try {
      localStorage.setItem(this.GRAMMAR_KEY, JSON.stringify(grammar));
    } catch (error) {
      console.error('Error al guardar la gramática:', error);
      throw new Error('No se pudo guardar la gramática');
    }
  }

  /**
   * Carga la gramática desde localStorage o devuelve una gramática por defecto
   */
  public loadGrammar(): Grammar {
    try {
      const savedGrammar = localStorage.getItem(this.GRAMMAR_KEY);
      
      if (savedGrammar) {
        return JSON.parse(savedGrammar);
      }
      
      // Gramática por defecto
      return {
        terminals: [
          { id: uuidv4(), value: 'a' },
          { id: uuidv4(), value: 'b' }
        ],
        nonTerminals: [
          { id: uuidv4(), value: 'S' },
          { id: uuidv4(), value: 'A' },
          { id: uuidv4(), value: 'B' }
        ],
        startSymbol: 'S',
        productions: [
          { id: uuidv4(), left: 'S', right: 'aA' },
          { id: uuidv4(), left: 'A', right: 'bB' },
          { id: uuidv4(), left: 'B', right: 'ab' }
        ]
      };
    } catch (error) {
      console.error('Error al cargar la gramática:', error);
      
      // En caso de error, devolvemos una gramática por defecto
      return {
        terminals: [
          { id: uuidv4(), value: 'a' },
          { id: uuidv4(), value: 'b' }
        ],
        nonTerminals: [
          { id: uuidv4(), value: 'S' },
          { id: uuidv4(), value: 'A' },
          { id: uuidv4(), value: 'B' }
        ],
        startSymbol: 'S',
        productions: [
          { id: uuidv4(), left: 'S', right: 'aA' },
          { id: uuidv4(), left: 'A', right: 'bB' },
          { id: uuidv4(), left: 'B', right: 'ab' }
        ]
      };
    }
  }

  /**
   * Guarda el resultado de validación en localStorage
   * @param result Resultado a guardar
   */
  public saveValidationResult(result: ValidationResult): void {
    try {
      localStorage.setItem(this.VALIDATION_RESULT_KEY, JSON.stringify(result));
    } catch (error) {
      console.error('Error al guardar el resultado de validación:', error);
      throw new Error('No se pudo guardar el resultado de validación');
    }
  }

  /**
   * Carga el resultado de validación desde localStorage
   */
  public loadValidationResult(): ValidationResult | null {
    try {
      const savedResult = localStorage.getItem(this.VALIDATION_RESULT_KEY);
      
      if (savedResult) {
        return JSON.parse(savedResult);
      }
      
      return null;
    } catch (error) {
      console.error('Error al cargar el resultado de validación:', error);
      return null;
    }
  }

  /**
   * Guarda el árbol de derivación en localStorage
   * @param tree Árbol a guardar
   */
  public saveDerivationTree(tree: TreeNode | null): void {
    try {
      localStorage.setItem(this.DERIVATION_TREE_KEY, JSON.stringify(tree));
    } catch (error) {
      console.error('Error al guardar el árbol de derivación:', error);
      throw new Error('No se pudo guardar el árbol de derivación');
    }
  }

  /**
   * Carga el árbol de derivación desde localStorage
   */
  public loadDerivationTree(): TreeNode | null {
    try {
      const savedTree = localStorage.getItem(this.DERIVATION_TREE_KEY);
      
      if (savedTree) {
        return JSON.parse(savedTree);
      }
      
      return null;
    } catch (error) {
      console.error('Error al cargar el árbol de derivación:', error);
      return null;
    }
  }

  /**
   * Guarda el árbol general en localStorage
   * @param tree Árbol a guardar
   */
  public saveGeneralTree(tree: TreeNode | null): void {
    try {
      localStorage.setItem(this.GENERAL_TREE_KEY, JSON.stringify(tree));
    } catch (error) {
      console.error('Error al guardar el árbol general:', error);
      throw new Error('No se pudo guardar el árbol general');
    }
  }

  /**
   * Carga el árbol general desde localStorage
   */
  public loadGeneralTree(): TreeNode | null {
    try {
      const savedTree = localStorage.getItem(this.GENERAL_TREE_KEY);
      
      if (savedTree) {
        return JSON.parse(savedTree);
      }
      
      return null;
    } catch (error) {
      console.error('Error al cargar el árbol general:', error);
      return null;
    }
  }
}