import { useState, useEffect, useCallback } from "react";
import { GrammarException } from "../../domain/models/grammar.exceptions";
import { Grammar, ValidationResult, TreeNode } from "../../domain/models/grammar.model";
import { GrammarService } from "../../domain/services/grammar.service";
import { LocalStorageGrammarRepository } from "../../infrastructure/repositories/local-storage-grammar.repository";
import { GrammarController } from "../controllers/grammar.controller";
import { BrowserSystemInfoRepository } from "../../infrastructure/repositories/browser-system-info.repository";

// Hook personalizado para la lógica de negocio del validador de gramáticas
export const useGrammarValidator = () => {
  // Inicializamos los servicios y repositorios
  const grammarService = new GrammarService();
  const grammarStateRepository = new LocalStorageGrammarRepository();
  const systemInfoRepository = new BrowserSystemInfoRepository();
  
  // Creamos el controlador
  const controller = new GrammarController(
    grammarService,
    grammarStateRepository,
    systemInfoRepository
  );
  
  // Estados de la aplicación
  const [grammar, setGrammar] = useState<Grammar>({
    terminals: [],
    nonTerminals: [],
    startSymbol: '',
    productions: []
  });
  const [word, setWord] = useState<string>('abab');
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [derivationTree, setDerivationTree] = useState<TreeNode | null>(null);
  const [generalTree, setGeneralTree] = useState<TreeNode | null>(null);
  const [systemInfo, setSystemInfo] = useState<any>({});
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Inicialización
  useEffect(() => {
    const initialize = async () => {
      try {
        setIsLoading(true);
        const { 
          grammar, 
          validationResult, 
          derivationTree, 
          generalTree, 
          systemInfo 
        } = await controller.initialize();
        
        setGrammar(grammar);
        setResult(validationResult);
        setDerivationTree(derivationTree);
        setGeneralTree(generalTree);
        setSystemInfo(systemInfo);
        setError(null);
      } catch (err) {
        setError(`Error al inicializar: ${(err as Error).message}`);
      } finally {
        setIsLoading(false);
      }
    };
    
    initialize();
  }, []);
  
  /**
   * Valida si una palabra pertenece al lenguaje
   */
  const validateWord = useCallback(() => {
    try {
      setError(null);
      const validationResult = controller.validateWord(word);
      setResult(validationResult);
      setDerivationTree(controller.getDerivationTree());
      setGeneralTree(controller.getGeneralTree());
    } catch (err) {
      if (err instanceof GrammarException) {
        setError(`Error de gramática: ${err.message}`);
      } else {
        setError(`Error: ${(err as Error).message}`);
      }
    }
  }, [word, controller]);
  
  /**
   * Añade un símbolo terminal
   */
  const addTerminal = useCallback(() => {
    try {
      setError(null);
      const updatedGrammar = controller.addTerminal('');
      setGrammar(updatedGrammar);
    } catch (err) {
      if (err instanceof GrammarException) {
        setError(`Error de gramática: ${err.message}`);
      } else {
        setError(`Error: ${(err as Error).message}`);
      }
    }
  }, [controller]);
  
  /**
   * Añade un símbolo no terminal
   */
  const addNonTerminal = useCallback(() => {
    try {
      setError(null);
      const updatedGrammar = controller.addNonTerminal('');
      setGrammar(updatedGrammar);
    } catch (err) {
      if (err instanceof GrammarException) {
        setError(`Error de gramática: ${err.message}`);
      } else {
        setError(`Error: ${(err as Error).message}`);
      }
    }
  }, [controller]);
  
  /**
   * Añade una producción
   */
  const addProduction = useCallback(() => {
    try {
      setError(null);
      // Utilizamos el primer no terminal disponible como valor por defecto
      const defaultLeft = grammar.nonTerminals.length > 0 ? grammar.nonTerminals[0].value : '';
      const updatedGrammar = controller.addProduction(defaultLeft, '');
      setGrammar(updatedGrammar);
    } catch (err) {
      if (err instanceof GrammarException) {
        setError(`Error de gramática: ${err.message}`);
      } else {
        setError(`Error: ${(err as Error).message}`);
      }
    }
  }, [controller, grammar.nonTerminals]);
  
  /**
   * Actualiza un símbolo terminal
   */
  const updateTerminal = useCallback((index: number, value: string) => {
    try {
      setError(null);
      const updatedGrammar = controller.updateTerminal(index, value);
      setGrammar(updatedGrammar);
    } catch (err) {
      if (err instanceof GrammarException) {
        setError(`Error de gramática: ${err.message}`);
      } else {
        setError(`Error: ${(err as Error).message}`);
      }
    }
  }, [controller]);
  
  /**
   * Actualiza un símbolo no terminal
   */
  const updateNonTerminal = useCallback((index: number, value: string) => {
    try {
      setError(null);
      const updatedGrammar = controller.updateNonTerminal(index, value);
      setGrammar(updatedGrammar);
    } catch (err) {
      if (err instanceof GrammarException) {
        setError(`Error de gramática: ${err.message}`);
      } else {
        setError(`Error: ${(err as Error).message}`);
      }
    }
  }, [controller]);
  
  /**
   * Actualiza una producción
   */
  const updateProduction = useCallback((index: number, field: 'left' | 'right', value: string) => {
    try {
      setError(null);
      const updatedGrammar = controller.updateProduction(index, field, value);
      setGrammar(updatedGrammar);
    } catch (err) {
      if (err instanceof GrammarException) {
        setError(`Error de gramática: ${err.message}`);
      } else {
        setError(`Error: ${(err as Error).message}`);
      }
    }
  }, [controller]);
  
  /**
   * Actualiza el símbolo inicial
   */
  const updateStartSymbol = useCallback((value: string) => {
    try {
      setError(null);
      const updatedGrammar = controller.updateStartSymbol(value);
      setGrammar(updatedGrammar);
    } catch (err) {
      if (err instanceof GrammarException) {
        setError(`Error de gramática: ${err.message}`);
      } else {
        setError(`Error: ${(err as Error).message}`);
      }
    }
  }, [controller]);
  
  return {
    grammar,
    word,
    setWord,
    result,
    derivationTree,
    generalTree,
    systemInfo,
    error,
    isLoading,
    validateWord,
    addTerminal,
    addNonTerminal,
    addProduction,
    updateTerminal,
    updateNonTerminal,
    updateProduction,
    updateStartSymbol
  };
};