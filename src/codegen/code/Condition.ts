import { Block } from "./Block";
import { Compilable } from "../core/Compilable";
import { join } from "../../util/join";

/**
 * @description 
 * code block seems like:
 * if(cond){
 *  //then block
 * }
 * else{
 *  //else block
 * }
 */
class ConditionTE extends Compilable {

    /**
     * cond 
     */
    private predSource: string;

    /**
     * then block body
     */
    private thenBlock: Block = new Block();

    /**
     * else block body
     */
    private elseBlock: Block = new Block();

    constructor(...args: any[]) {
        super();
        this.predSource = join(args);
    }

    /**
     * @description then block codelines
     * @example
     * cond.Then.push(`console(true)`);
     */
    get Then(): Block {
        return this.thenBlock;
    }

    /**
     * @description else block codelines
     * @example
     * cond.Else.push(`alert(0)`);
     */
    get Else(): Block {
        return this.elseBlock;
    }

    compile = (): string => {
        return this.regularize(`if(${this.predSource}){${this.Then.compile()}}else{${this.Else.compile()}}`);
    }
}

/**
 * @description
 * code block seems like
 * if(cond){
 *  //then block
 * }
 */
class ConditionT extends Compilable {

    /**
     * cond 
     */
    private predSource: string;

    /**
     * 
     */
    private thenBlock: Block = new Block();

    constructor(...args: any[]) {
        super();
        this.predSource = join(args);
    }

    get Then(): Block {
        return this.thenBlock;
    }

    compile = (): string => {
        return this.regularize(`if(${this.predSource}){${this.Then.compile()}}`);
    }

}

export {
    ConditionT,
    ConditionTE
}