import { Block } from "./Block";
import { Compilable } from "../core/Compilable";

/**
 * @description 
 * codeblock seems like:
 * //entry
 * const a = '112233'
 * ...
 * ...
 * //exit, always in tail 
 * const b = a;
 */
class Scope extends Compilable {
    /**
     * @description
     *  entry block
     */
    private entrytBlock: Block = new Block();

    /**
     * tail block
     */
    private exitBlock: Block = new Block();

    get Entry(): Block {
        return this.entrytBlock;
    }

    get Exit(): Block {
        return this.exitBlock;
    }

    compile = (): string => {
        return this.regularize(`${this.Entry.compile()}${this.Exit.compile()}`);
    }
}

export { Scope }