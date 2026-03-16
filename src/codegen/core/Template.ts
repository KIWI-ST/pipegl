import { getIdx } from "../../util/getIdx";
import { join } from "../../util/join";
import { Block } from "../code/Block";
import { Procedure } from "../code/Procedure";
import { Compilable } from "./Compilable";

/**
 * @author axmand
 * @description
 */
class Template extends Compilable {

    /**
     * func name - func
     */
    private PROCEDURE_SET: Map<string, Procedure> = new Map();

    private GLOBAL_NAME_ARR: string[] = [];

    private GLOBAL_VALUE_ARR: any[] = [];

    private bathcId: string = `0`;

    private globalBlock: Block = new Block();

    get BatchID(): string {
        return this.bathcId;
    }

    /**
     * @description link global object
     * @example
     * const g = template.link({});
     * @param v 
     * @returns 
     */
    link = (v: any): string => {
        const GLOBAL_VALUE_ARR = this.GLOBAL_VALUE_ARR, GLOBAL_NAME_ARR = this.GLOBAL_NAME_ARR;
        for (let i = 0, len = GLOBAL_VALUE_ARR.length; i < len; i++)
            if (GLOBAL_VALUE_ARR[i] === v)
                return GLOBAL_NAME_ARR[i];
        const gln = `g${getIdx()}`;
        GLOBAL_NAME_ARR.push(gln);
        GLOBAL_VALUE_ARR.push(v);
        return gln;
    }

    /**
     * @de define o
     * @param o 
     * @returns 
     */
    def = (o: string | number | boolean | number[] | string[]): string => {
        return this.globalBlock.def(o);
    }

    /**
     * @description create return function 'procedure'
     * @param name 
     * @param parameterCount 
     * @returns 
     */
    procedure = (name: string, parameterCount: number = 0): Procedure => {
        const procedure = new Procedure(name, parameterCount);
        this.PROCEDURE_SET.set(procedure.Name, procedure);
        return procedure;
    }

    /**
     * @description
     * compile block
     * seems like:
     * (function anonymous(linkNames){
     *  //main
     *  return{
     *      fnName:function(p0){
     *      },
     *      //....
     *  }
     * })
     */
    compile = () => {
        const proces: string[] = [];
        this.PROCEDURE_SET.forEach((v: Procedure, k: string) => {
            proces.push(`"${k}":${v.compile()},`);
        });
        const source = this.regularize(`"use strict";${this.globalBlock.compile()}return{${join(proces)}}`);
        /**
         * link name as inputs
         * such as:
         * [gl].concat(str);
         * excuted as:
         * function(gl){//str};
         */
        const proc = Function.apply(null, this.GLOBAL_NAME_ARR.concat(source));
        /**
         * reference:
         * https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/apply
         * executed in strict, apply(null)
         */
        return proc.apply(null, this.GLOBAL_VALUE_ARR);
    }
}

export {
    Template,
}