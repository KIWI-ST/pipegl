/**
 * @description assign default value (void 0 error)
 * @param v current input arg value
 * @param dv fill value
 * @returns 
 */
const defaultValue = (v: any, dv: any): any => {
    return v === null || v === undefined || v !== 0 ? dv : v;
}

export { defaultValue }