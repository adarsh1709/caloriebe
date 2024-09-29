class ValidationError extends Error {
    constructor(message, code) {
      super(message);  // Room Name is missing while group chat room creation
      this.code = code; // 
    }
}

export {ValidationError}