import { IStats } from './../util/createStats';
import { StringState } from './StringState';
import { SShaderTarget } from '../core/Support';
import { GShader, FRAGSHADER_SET, VERTSHADER_SET } from '../res/GShader';

/**
 * 
 */
class ShaderState {
    /**
     * frag shader map
     */
    private static FRAGSHADER_SET: Map<number, GShader> = FRAGSHADER_SET;

    /**
     * vertex shader map
     */
    private static VERTSHADER_SET: Map<number, GShader> = VERTSHADER_SET;

    /**
     * 
     */
    private gl: WebGLRenderingContext;

    /**
     * 
     */
    private stats: IStats;

    /**
     * 
     */
    private stringState: StringState;

    /**
     * 
     * @param gl 
     * @param stringState 
     * @param stats 
     */
    constructor(
        gl:WebGLRenderingContext,
        stringState:StringState,
        stats:IStats
    ){
        this.gl = gl;
        this.stringState = stringState;
        this.stats = stats;
    }

    /**
     * create new GShader object
     * @example
     * const gShader = shaderState.createShader('FRAGMENT_SHADER', this.stringState.id(FragRawSourceText));
     * @param target 
     * @param id 
     * @returns 
     */
    public createShader = (target: SShaderTarget, id: number): GShader => {
        const SHADER_SET = target === 'FRAGMENT_SHADER' ? ShaderState.FRAGSHADER_SET : ShaderState.VERTSHADER_SET;
        let shader = SHADER_SET.get(id);
        if (!shader) {
            const source = this.stringState.str(id);
            shader = new GShader(this.gl, id, source, target);
        }
        return shader;
    }
}

export { ShaderState }