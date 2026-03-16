/**
 * @author axmmand
 * @description check pred, throw erro if !pred is true
 * @param pred condition
 * @param message error message
 */
const check = (pred: any, message: string) => {
    if (!pred) {
        throw new Error(`pipegl:${message}`);
    }
}

/**
 * @description
 * @param pred 
 * @param message 
 */
const codegenError = (pred: any, message: string) => {
    if (!pred) {
        const error = new Error(`error-${message}`);
        throw error;
    }
}

/**
 * @description check o is null or undefined or empty
 * @param o 
 * @param message 
 */
const codegenValueError = (o: any, message: string) => {
    let cond: boolean = true;
    if (Array.isArray(o)) {
        cond = false;
    }
    else if (typeof o === 'number' && !Number.isNaN(o)) {
        cond = false;
    }
    else if (o !== null || o !== undefined) {
        cond = false;
    }
    codegenError(!cond, message);
}

export {
    codegenError,
    codegenValueError,
    check,
}