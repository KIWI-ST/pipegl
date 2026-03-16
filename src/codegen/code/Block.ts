import { Scope } from "./Scope";
import { Compilable } from "../core/Compilable";
import { ConditionT, ConditionTE } from "./Condition";
import { slice } from "../../util/slice";
import { codegenError, codegenValueError } from "../../util/check";
import { getIdx } from "../../util/getIdx";
import { join } from "../../util/join";

/**
 * @description
 * @class Block
 */
class Block extends Compilable {
    /**
     * codeline count
     */
    private lc: number = 0;

    /**
     * variable declare array
     */
    private VARIABLE_NAME_ARR: string[] = [];

    /**
     * 
     */
    private CODELINE_SET: Map<number, any[] | Block | ConditionT | ConditionTE | Scope> = new Map();

    /**
     * 
     */
    private MERGE_BLOCKS_ARR: Block[] = [];

    /**
     * @description add new codeline
     * @param args 
     * @example
     * //add new codelines
     * block.push(`ccc=`, [2124,3], `;`);
     * //add new codeline
     * block.push(`ccc=0`);
     * @returns 
     */
    push(...args: any[]): Block {
        const lines: any[] = [], CODELINE_ARR = this.CODELINE_SET;
        args.forEach((v: any) => {
            Array.isArray(v) ? lines.push(`[${slice(v)}]`) : lines.push(v);
        });
        if (lines.length > 0
            && `${lines[lines.length - 1]}`.lastIndexOf('{') !== lines[lines.length - 1].length - 1
            && `${lines[lines.length - 1]}`.lastIndexOf('}') !== lines[lines.length - 1].length - 1
            && `${lines[lines.length - 1]}`.lastIndexOf(';') !== lines[lines.length - 1].length - 1
        ) lines.push(';');
        CODELINE_ARR.set(this.lc++, lines);
        return this;
    }

    /**
     * @description declare varaible, assign with default value 'v'
     * @example
     * const name = block.def([1,2]); //var g0 = [1,2];
     * @param v 
     */
    def = (v: string | number | boolean | number[] | string[]): string => {
        codegenValueError(v, `v does not support null/undefined`);
        const NAME = `b${getIdx()}`,
            CODELINE_ARR = this.CODELINE_SET,
            VARIABLE_NAME_ARR = this.VARIABLE_NAME_ARR;
        VARIABLE_NAME_ARR.push(NAME);
        const lines = [];
        lines.push(NAME, `=`);
        Array.isArray(v) ? lines.push(`[${slice(v)}]`) : lines.push(v);
        lines.push(`;`);
        CODELINE_ARR.set(this.lc++, lines);
        return NAME;
    }

    /**
     * @description combine block/scope/condition after this codeline
     * @param v 
     */
    private combine = (v: Block | ConditionT | ConditionTE | Scope): void => {
        this.CODELINE_SET.set(this.lc++, v)
    }

    /**
     * @description append exist block in tail
     * @param block 
     */
    appendBlock = (block: Block): void => {
        codegenError(!this.MERGE_BLOCKS_ARR.find((b: Block) => b.ID === block.ID), `Duplicate block merges are not allowed`);
        this.MERGE_BLOCKS_ARR.push(block);
    }

    /**
     * @description create new Block from this line
     * @returns 
     */
    createBlock = (): Block => {
        const block = new Block();
        this.CODELINE_SET.set(this.lc++, block);
        return block;
    }

    /**
     * @description create Scope and combie in this codeline
     * @returns 
     */
    createScope = (): Scope => {
        const scope = new Scope();
        this.CODELINE_SET.set(this.lc++, scope);
        return scope;
    }

    /**
     * @description create ConditionT
     * @param args 
     * @returns 
     */
    createConditionT = (...args: any[]): ConditionT => {
        const cond = new ConditionT(...args);
        this.combine(cond);
        return cond;
    }

    /**
     * @description create ConditionTE
     * @param args 
     * @returns 
     */
    createConditionTE = (...args: any[]): ConditionTE => {
        const cond = new ConditionTE(...args);
        this.combine(cond);
        return cond;
    }

    /**
     * @description compile block
     * @returns 
     */
    compile = (): string => {
        const CODELINE_SET = this.CODELINE_SET, MERGE_BLOCKS_ARR = this.MERGE_BLOCKS_ARR, VARIABLE_NAME_ARR = this.VARIABLE_NAME_ARR;
        const declareSource: string = VARIABLE_NAME_ARR.length > 0 ? `var ${VARIABLE_NAME_ARR.join(',')};` : ``;
        let bodySource: string = ``;
        CODELINE_SET.forEach(
            (line: any[] | Block | ConditionT | ConditionTE | Scope) => {
                bodySource += (
                    line instanceof Block ||
                    line instanceof ConditionTE ||
                    line instanceof ConditionT ||
                    line instanceof Scope
                ) ? line.compile() : join(line);
            }
        );
        const mergeSource: string = MERGE_BLOCKS_ARR.reduce<string>((pre: string, cur: Block) => pre + cur.compile(), ``);
        return this.regularize(`${declareSource}${bodySource}${mergeSource}`);
    }
}

export {
    Block
}