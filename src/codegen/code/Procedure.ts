import { Block } from "./Block";
import { Scope } from "./Scope";
import { Compilable } from "../core/Compilable";

/**
 * @description 
 * codeline seems like:
 * add:funciton(p0){
 *  //do something
 * }
 */
class Procedure extends Compilable {
    /**
     * 
     */
    private name: string;

    /**
     * 
     */
    private inputArguments: string[] = [];

    /**
     * 
     */
    private parameterCount: number;

    /**
     * 
     */
    private bodyScope: Scope = new Scope();

    /**
     * 
     */
    get Name(): string {
        return this.name;
    }

    get Entry(): Block {
        return this.bodyScope.Entry;
    }

    get Exit(): Block {
        return this.bodyScope.Exit;
    }

    get Scope(): Scope {
        return this.bodyScope;
    }

    constructor(fnName: string, parameterCount: number = 0) {
        super();
        this.name = fnName;
        this.parameterCount = parameterCount;
        for (let i = 0; i < this.parameterCount; i++) this.registArgs();
    }

    private registArgs = (): string => {
        const ne = `p${this.inputArguments.length}`;
        this.inputArguments.push(ne);
        return ne;
    }

    compile = () => {
        const inputArgumentsSource: string = this.inputArguments.join();
        return this.regularize(`function(${inputArgumentsSource}){${this.bodyScope.compile()}}`);
    }
}

export {
    Procedure
}