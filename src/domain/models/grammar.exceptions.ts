export class GrammarException extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'GrammarException';
    }
  }
  
  export class InvalidGrammarException extends GrammarException {
    constructor(message: string = 'La gramática especificada no es válida') {
      super(message);
      this.name = 'InvalidGrammarException';
    }
  }
  
  export class EmptyTerminalException extends GrammarException {
    constructor(message: string = 'No se permiten símbolos terminales vacíos') {
      super(message);
      this.name = 'EmptyTerminalException';
    }
  }
  
  export class DuplicateSymbolException extends GrammarException {
    constructor(symbol: string) {
      super(`El símbolo "${symbol}" ya existe en la gramática`);
      this.name = 'DuplicateSymbolException';
    }
  }
  
  export class InvalidStartSymbolException extends GrammarException {
    constructor(message: string = 'El símbolo inicial debe ser un no terminal válido') {
      super(message);
      this.name = 'InvalidStartSymbolException';
    }
  }
  
  export class InvalidProductionException extends GrammarException {
    constructor(message: string = 'La producción especificada no es válida') {
      super(message);
      this.name = 'InvalidProductionException';
    }
  }
  
  export class MaxDerivationStepsExceededException extends GrammarException {
    constructor(message: string = 'Se excedió el número máximo de pasos de derivación') {
      super(message);
      this.name = 'MaxDerivationStepsExceededException';
    }
  }