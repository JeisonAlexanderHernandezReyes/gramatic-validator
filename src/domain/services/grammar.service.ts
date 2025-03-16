import { v4 as uuidv4 } from 'uuid';
import { 
  Grammar, 
  Terminal,
  NonTerminal,
  Production,
  ValidationResult,
  TreeNode,
  DerivationStep
} from '../models/grammar.model';
import { IGrammarService } from '../ports/primary/grammar.service.port';
import { InvalidGrammarException, MaxDerivationStepsExceededException, EmptyTerminalException, DuplicateSymbolException, InvalidProductionException, InvalidStartSymbolException } from '../models/grammar.exceptions';


export class GrammarService implements IGrammarService {
  private readonly MAX_DERIVATION_STEPS = 100;
  private readonly MAX_TREE_DEPTH = 3;

  /**
   * Valida si una palabra pertenece al lenguaje generado por la gramática
   * @param grammar Gramática formal
   * @param word Palabra a validar
   * @throws {InvalidGrammarException} Si la gramática no es válida
   * @throws {MaxDerivationStepsExceededException} Si se excede el número máximo de pasos de derivación
   */
  public validateWord(grammar: Grammar, word: string): ValidationResult {
    // Validamos la gramática antes de proceder
    if (!this.validateGrammar(grammar)) {
      throw new InvalidGrammarException();
    }

    let isValid = false;
    let currentDerivation = grammar.startSymbol;
    let steps: DerivationStep[] = [{symbol: grammar.startSymbol, step: 0}];
    let stepCount = 0;
    
    try {
      // Algoritmo de derivación para gramáticas regulares
      while (stepCount < this.MAX_DERIVATION_STEPS) {
        stepCount++;
        let foundMatch = false;
        
        for (const prod of grammar.productions) {
          if (currentDerivation.includes(prod.left)) {
            const newDerivation = currentDerivation.replace(prod.left, prod.right);
            currentDerivation = newDerivation;
            steps.push({symbol: newDerivation, step: stepCount});
            foundMatch = true;
            break;
          }
        }
        
        if (!foundMatch) {
          break;
        }
        
        // Verificar si llegamos a la palabra objetivo
        if (currentDerivation === word) {
          isValid = true;
          break;
        }
        
        // Si la derivación es más larga que la palabra objetivo, detenemos
        if (currentDerivation.length > word.length * 2) {
          break;
        }
      }
      
      // Si alcanzamos el límite de pasos, lanzamos una excepción
      if (stepCount >= this.MAX_DERIVATION_STEPS) {
        throw new MaxDerivationStepsExceededException();
      }
      
      return {
        isValid,
        steps,
        finalDerivation: currentDerivation
      };
    } catch (error) {
      if (error instanceof MaxDerivationStepsExceededException) {
        throw error;
      }
      
      // Capturamos cualquier otra excepción y la convertimos en InvalidGrammarException
      throw new InvalidGrammarException(`Error al validar la palabra: ${(error as Error).message}`);
    }
  }

  /**
   * Genera el árbol de derivación para una secuencia de pasos
   * @param steps Pasos de derivación
   */
  public generateDerivationTree(steps: DerivationStep[]): TreeNode | null {
    if (!steps || steps.length === 0) return null;
    
    // Convertir pasos de derivación en un árbol visual
    const rootNode: TreeNode = {
      id: uuidv4(),
      node: steps[0].symbol,
      children: []
    };
    
    let currentNode = rootNode;
    
    for (let i = 1; i < steps.length; i++) {
      const childNode: TreeNode = {
        id: uuidv4(),
        node: steps[i].symbol,
        children: []
      };
      
      currentNode.children.push(childNode);
      currentNode = childNode;
    }
    
    return rootNode;
  }

  /**
   * Genera el árbol general de la gramática
   * @param grammar Gramática formal
   */
  public generateGeneralTree(grammar: Grammar): TreeNode | null {
    if (!this.validateGrammar(grammar)) {
      throw new InvalidGrammarException();
    }
    
    const treeRoot: TreeNode = {
      id: uuidv4(),
      node: grammar.startSymbol,
      children: this.generateChildren(grammar, grammar.startSymbol, 0)
    };
    
    return treeRoot;
  }

  /**
   * Genera los nodos hijos para el árbol general (función recursiva)
   * @param grammar Gramática formal
   * @param symbol Símbolo no terminal
   * @param depth Profundidad actual en el árbol
   */
  private generateChildren(grammar: Grammar, symbol: string, depth: number): TreeNode[] {
    if (depth >= this.MAX_TREE_DEPTH) return []; // Limitar profundidad para evitar árboles infinitos
    
    const children: TreeNode[] = [];
    
    for (const prod of grammar.productions) {
      if (prod.left === symbol) {
        const childNode: TreeNode = {
          id: uuidv4(),
          node: prod.right,
          children: []
        };
        
        // Para cada símbolo no terminal en la parte derecha, generamos sus hijos
        if (depth < this.MAX_TREE_DEPTH - 1) {
          const nonTerminals = prod.right.split('')
            .filter(char => grammar.nonTerminals.some(nt => nt.value === char));
          
          for (const nt of nonTerminals) {
            const ntChildren = this.generateChildren(grammar, nt, depth + 1);
            childNode.children.push(...ntChildren);
          }
        }
        
        children.push(childNode);
      }
    }
    
    return children;
  }

  /**
   * Añade un símbolo terminal a la gramática
   * @param grammar Gramática actual
   * @param value Valor del símbolo terminal
   * @throws {EmptyTerminalException} Si el valor está vacío
   * @throws {DuplicateSymbolException} Si el símbolo ya existe
   */
  public addTerminal(grammar: Grammar, value: string): Grammar {
    if (!value.trim()) {
      throw new EmptyTerminalException();
    }
    
    // Verificar que no exista ya
    if (grammar.terminals.some(t => t.value === value)) {
      throw new DuplicateSymbolException(value);
    }
    
    const newTerminal: Terminal = {
      id: uuidv4(),
      value
    };
    
    return {
      ...grammar,
      terminals: [...grammar.terminals, newTerminal]
    };
  }

  /**
   * Añade un símbolo no terminal a la gramática
   * @param grammar Gramática actual
   * @param value Valor del símbolo no terminal
   * @throws {EmptyTerminalException} Si el valor está vacío
   * @throws {DuplicateSymbolException} Si el símbolo ya existe
   */
  public addNonTerminal(grammar: Grammar, value: string): Grammar {
    if (!value.trim()) {
      throw new EmptyTerminalException('No se permiten símbolos no terminales vacíos');
    }
    
    // Verificar que no exista ya
    if (grammar.nonTerminals.some(nt => nt.value === value)) {
      throw new DuplicateSymbolException(value);
    }
    
    const newNonTerminal: NonTerminal = {
      id: uuidv4(),
      value
    };
    
    return {
      ...grammar,
      nonTerminals: [...grammar.nonTerminals, newNonTerminal]
    };
  }

  /**
   * Añade una producción a la gramática
   * @param grammar Gramática actual
   * @param left Parte izquierda (debe ser un no terminal)
   * @param right Parte derecha
   * @throws {InvalidProductionException} Si la producción no es válida
   */
  public addProduction(grammar: Grammar, left: string, right: string): Grammar {
    // Verificar que la parte izquierda sea un no terminal
    if (!grammar.nonTerminals.some(nt => nt.value === left)) {
      throw new InvalidProductionException('La parte izquierda debe ser un símbolo no terminal válido');
    }
    
    // Verificar que la parte derecha no esté vacía
    if (!right.trim()) {
      throw new InvalidProductionException('La parte derecha no puede estar vacía');
    }
    
    const newProduction: Production = {
      id: uuidv4(),
      left,
      right
    };
    
    return {
      ...grammar,
      productions: [...grammar.productions, newProduction]
    };
  }

  /**
   * Actualiza un símbolo terminal
   * @param grammar Gramática actual
   * @param index Índice del terminal a actualizar
   * @param value Nuevo valor
   * @throws {EmptyTerminalException} Si el valor está vacío
   * @throws {DuplicateSymbolException} Si el símbolo ya existe
   */
  public updateTerminal(grammar: Grammar, index: number, value: string): Grammar {
    if (index < 0 || index >= grammar.terminals.length) {
      throw new Error(`Índice de terminal fuera de rango: ${index}`);
    }
    
    if (!value.trim()) {
      throw new EmptyTerminalException();
    }
    
    // Verificar que no exista ya (excepto el actual)
    if (grammar.terminals.some((t, i) => t.value === value && i !== index)) {
      throw new DuplicateSymbolException(value);
    }
    
    const newTerminals = [...grammar.terminals];
    newTerminals[index] = { ...newTerminals[index], value };
    
    return {
      ...grammar,
      terminals: newTerminals
    };
  }

  /**
   * Actualiza un símbolo no terminal
   * @param grammar Gramática actual
   * @param index Índice del no terminal a actualizar
   * @param value Nuevo valor
   * @throws {EmptyTerminalException} Si el valor está vacío
   * @throws {DuplicateSymbolException} Si el símbolo ya existe
   */
  public updateNonTerminal(grammar: Grammar, index: number, value: string): Grammar {
    if (index < 0 || index >= grammar.nonTerminals.length) {
      throw new Error(`Índice de no terminal fuera de rango: ${index}`);
    }
    
    if (!value.trim()) {
      throw new EmptyTerminalException('No se permiten símbolos no terminales vacíos');
    }
    
    // Verificar que no exista ya (excepto el actual)
    if (grammar.nonTerminals.some((nt, i) => nt.value === value && i !== index)) {
      throw new DuplicateSymbolException(value);
    }
    
    const oldValue = grammar.nonTerminals[index].value;
    const newNonTerminals = [...grammar.nonTerminals];
    newNonTerminals[index] = { ...newNonTerminals[index], value };
    
    // Actualizar también las producciones que usan este no terminal
    const newProductions = grammar.productions.map(prod => {
      if (prod.left === oldValue) {
        return { ...prod, left: value };
      }
      return prod;
    });
    
    // Actualizar también el símbolo inicial si es necesario
    const newStartSymbol = grammar.startSymbol === oldValue ? value : grammar.startSymbol;
    
    return {
      ...grammar,
      nonTerminals: newNonTerminals,
      productions: newProductions,
      startSymbol: newStartSymbol
    };
  }

  /**
   * Actualiza una producción
   * @param grammar Gramática actual
   * @param index Índice de la producción a actualizar
   * @param field Campo a actualizar ('left' o 'right')
   * @param value Nuevo valor
   * @throws {InvalidProductionException} Si la producción no es válida
   */
  public updateProduction(grammar: Grammar, index: number, field: 'left' | 'right', value: string): Grammar {
    if (index < 0 || index >= grammar.productions.length) {
      throw new Error(`Índice de producción fuera de rango: ${index}`);
    }
    
    if (field === 'left') {
      // Verificar que la parte izquierda sea un no terminal
      if (!grammar.nonTerminals.some(nt => nt.value === value)) {
        throw new InvalidProductionException('La parte izquierda debe ser un símbolo no terminal válido');
      }
    } else if (field === 'right') {
      // Verificar que la parte derecha no esté vacía
      if (!value.trim()) {
        throw new InvalidProductionException('La parte derecha no puede estar vacía');
      }
    }
    
    const newProductions = [...grammar.productions];
    newProductions[index] = { 
      ...newProductions[index], 
      [field]: value 
    };
    
    return {
      ...grammar,
      productions: newProductions
    };
  }

  /**
   * Actualiza el símbolo inicial
   * @param grammar Gramática actual
   * @param value Nuevo símbolo inicial
   * @throws {InvalidStartSymbolException} Si el símbolo no es un no terminal válido
   */
  public updateStartSymbol(grammar: Grammar, value: string): Grammar {
    // Verificar que el símbolo inicial sea un no terminal
    if (!grammar.nonTerminals.some(nt => nt.value === value)) {
      throw new InvalidStartSymbolException();
    }
    
    return {
      ...grammar,
      startSymbol: value
    };
  }

  /**
   * Valida que la gramática esté bien formada
   * @param grammar Gramática a validar
   */
  public validateGrammar(grammar: Grammar): boolean {
    try {
      // Verificar que haya al menos un terminal
      if (grammar.terminals.length === 0) {
        return false;
      }
      
      // Verificar que haya al menos un no terminal
      if (grammar.nonTerminals.length === 0) {
        return false;
      }
      
      // Verificar que el símbolo inicial sea un no terminal
      if (!grammar.nonTerminals.some(nt => nt.value === grammar.startSymbol)) {
        return false;
      }
      
      // Verificar que haya al menos una producción
      if (grammar.productions.length === 0) {
        return false;
      }
      
      // Verificar que todas las producciones tengan un no terminal en la parte izquierda
      for (const prod of grammar.productions) {
        if (!grammar.nonTerminals.some(nt => nt.value === prod.left)) {
          return false;
        }
        
        // Verificar que la parte derecha no esté vacía
        if (!prod.right.trim()) {
          return false;
        }
      }
      
      return true;
    } catch (error) {
      return false;
    }
  }
}