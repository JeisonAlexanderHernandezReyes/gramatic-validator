import { GrammarException } from "../../domain/models/grammar.exceptions";
import {
  Grammar,
  ValidationResult,
  TreeNode,
} from "../../domain/models/grammar.model";
import { IGrammarService } from "../../domain/ports/primary/grammar.service.port";
import { IGrammarStateRepository } from "../../domain/ports/secondary/state.repository.port";
import { ISystemInfoRepository } from "../../domain/ports/secondary/system-info.repository.port";

export class GrammarController {
  constructor(
    private readonly grammarService: IGrammarService,
    private readonly grammarStateRepository: IGrammarStateRepository,
    private readonly systemInfoRepository: ISystemInfoRepository
  ) {}

  /**
   * Inicializa el controlador cargando el estado guardado
   */
  public async initialize(): Promise<{
    grammar: Grammar;
    validationResult: ValidationResult | null;
    derivationTree: TreeNode | null;
    generalTree: TreeNode | null;
    systemInfo: any;
  }> {
    try {
      const grammar = this.grammarStateRepository.loadGrammar();
      const validationResult =
        this.grammarStateRepository.loadValidationResult();
      const derivationTree = this.grammarStateRepository.loadDerivationTree();
      const generalTree = this.grammarStateRepository.loadGeneralTree();
      const systemInfo = await this.systemInfoRepository.getSystemInfo();

      return {
        grammar,
        validationResult,
        derivationTree,
        generalTree,
        systemInfo,
      };
    } catch (error) {
      console.error("Error al inicializar el controlador:", error);
      throw new Error("No se pudo inicializar la aplicación");
    }
  }

  /**
   * Valida si una palabra pertenece al lenguaje generado por la gramática
   * @param word Palabra a validar
   */
  public validateWord(word: string): ValidationResult {
    try {
      const grammar = this.grammarStateRepository.loadGrammar();
      const result = this.grammarService.validateWord(grammar, word);

      // Guardar el resultado
      this.grammarStateRepository.saveValidationResult(result);

      // Generar y guardar árboles
      const derivationTree = this.grammarService.generateDerivationTree(
        result.steps
      );
      const generalTree = this.grammarService.generateGeneralTree(grammar);

      this.grammarStateRepository.saveDerivationTree(derivationTree);
      this.grammarStateRepository.saveGeneralTree(generalTree);

      return result;
    } catch (error) {
      console.error("Error al validar la palabra:", error);

      if (error instanceof GrammarException) {
        throw error;
      }

      throw new Error(
        `Error al validar la palabra: ${(error as Error).message}`
      );
    }
  }

  /**
   * Añade un símbolo terminal a la gramática
   * @param value Valor del terminal
   */
  public addTerminal(value: string): Grammar {
    try {
      const grammar = this.grammarStateRepository.loadGrammar();
      const updatedGrammar = this.grammarService.addTerminal(grammar, value);

      this.grammarStateRepository.saveGrammar(updatedGrammar);
      return updatedGrammar;
    } catch (error) {
      console.error("Error al añadir terminal:", error);

      if (error instanceof GrammarException) {
        throw error;
      }

      throw new Error(`Error al añadir terminal: ${(error as Error).message}`);
    }
  }

  /**
   * Añade un símbolo no terminal a la gramática
   * @param value Valor del no terminal
   */
  public addNonTerminal(value: string): Grammar {
    try {
      const grammar = this.grammarStateRepository.loadGrammar();
      const updatedGrammar = this.grammarService.addNonTerminal(grammar, value);

      this.grammarStateRepository.saveGrammar(updatedGrammar);
      return updatedGrammar;
    } catch (error) {
      console.error("Error al añadir no terminal:", error);

      if (error instanceof GrammarException) {
        throw error;
      }

      throw new Error(
        `Error al añadir no terminal: ${(error as Error).message}`
      );
    }
  }

  /**
   * Añade una producción a la gramática
   * @param left Parte izquierda
   * @param right Parte derecha
   */
  public addProduction(left: string, right: string): Grammar {
    try {
      const grammar = this.grammarStateRepository.loadGrammar();
      const updatedGrammar = this.grammarService.addProduction(
        grammar,
        left,
        right
      );

      this.grammarStateRepository.saveGrammar(updatedGrammar);
      return updatedGrammar;
    } catch (error) {
      console.error("Error al añadir producción:", error);

      if (error instanceof GrammarException) {
        throw error;
      }

      throw new Error(
        `Error al añadir producción: ${(error as Error).message}`
      );
    }
  }

  /**
   * Actualiza un símbolo terminal
   * @param index Índice del terminal
   * @param value Nuevo valor
   */
  public updateTerminal(index: number, value: string): Grammar {
    try {
      const grammar = this.grammarStateRepository.loadGrammar();
      const updatedGrammar = this.grammarService.updateTerminal(
        grammar,
        index,
        value
      );

      this.grammarStateRepository.saveGrammar(updatedGrammar);
      return updatedGrammar;
    } catch (error) {
      console.error("Error al actualizar terminal:", error);

      if (error instanceof GrammarException) {
        throw error;
      }

      throw new Error(
        `Error al actualizar terminal: ${(error as Error).message}`
      );
    }
  }

  /**
   * Actualiza un símbolo no terminal
   * @param index Índice del no terminal
   * @param value Nuevo valor
   */
  public updateNonTerminal(index: number, value: string): Grammar {
    try {
      const grammar = this.grammarStateRepository.loadGrammar();
      const updatedGrammar = this.grammarService.updateNonTerminal(
        grammar,
        index,
        value
      );

      this.grammarStateRepository.saveGrammar(updatedGrammar);
      return updatedGrammar;
    } catch (error) {
      console.error("Error al actualizar no terminal:", error);

      if (error instanceof GrammarException) {
        throw error;
      }

      throw new Error(
        `Error al actualizar no terminal: ${(error as Error).message}`
      );
    }
  }

  /**
   * Actualiza una producción
   * @param index Índice de la producción
   * @param field Campo a actualizar
   * @param value Nuevo valor
   */
  public updateProduction(
    index: number,
    field: "left" | "right",
    value: string
  ): Grammar {
    try {
      const grammar = this.grammarStateRepository.loadGrammar();
      const updatedGrammar = this.grammarService.updateProduction(
        grammar,
        index,
        field,
        value
      );

      this.grammarStateRepository.saveGrammar(updatedGrammar);
      return updatedGrammar;
    } catch (error) {
      console.error("Error al actualizar producción:", error);

      if (error instanceof GrammarException) {
        throw error;
      }

      throw new Error(
        `Error al actualizar producción: ${(error as Error).message}`
      );
    }
  }

  /**
   * Actualiza el símbolo inicial
   * @param value Nuevo símbolo inicial
   */
  public updateStartSymbol(value: string): Grammar {
    try {
      const grammar = this.grammarStateRepository.loadGrammar();
      const updatedGrammar = this.grammarService.updateStartSymbol(
        grammar,
        value
      );

      this.grammarStateRepository.saveGrammar(updatedGrammar);
      return updatedGrammar;
    } catch (error) {
      console.error("Error al actualizar símbolo inicial:", error);

      if (error instanceof GrammarException) {
        throw error;
      }

      throw new Error(
        `Error al actualizar símbolo inicial: ${(error as Error).message}`
      );
    }
  }

  /**
   * Obtiene el árbol de derivación actual
   */
  public getDerivationTree(): TreeNode | null {
    return this.grammarStateRepository.loadDerivationTree();
  }

  /**
   * Obtiene el árbol general actual
   */
  public getGeneralTree(): TreeNode | null {
    return this.grammarStateRepository.loadGeneralTree();
  }
}
