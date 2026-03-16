import { check } from "../util/check";
import { Status } from "../core/Status";
import { CWebGLStatusFLAG, CWebGLStatusVariable } from "../core/Constant";
import { SWebGLStatus, SWebGLStatusFLAG, SWebGLStatusVariable } from "../core/Support";

/**
 * 计数webgl状态更新
 * @param opts 
 * @returns 
 */
const parseStatus = (
    opts: {
        gl: WebGLRenderingContext,
        status?: SWebGLStatus
    }
): Status => {
    const { gl, status } = opts;
    const s0 = new Status(gl);
    Object.keys(status)?.forEach((key: string) => {
        const v = status[key];
        if (CWebGLStatusFLAG[key]) {
            s0.setFlag(key as SWebGLStatusFLAG, v as boolean);
        }
        else if (CWebGLStatusVariable[key]) {
            s0.setVariable(key as SWebGLStatusVariable, v as any[]);
        }
        else {
            check(false, `ParseStatus error: unsupport webgl format. key: ${key}`);
        }
    });
    return s0;
}

export { parseStatus }