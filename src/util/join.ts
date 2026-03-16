import { slice } from "./slice"

/**
 * @description
 * @param x 
 * @returns 
 */
const join = (x: any[]): string => {
    return slice(x).join('');
}

export {
    join
}