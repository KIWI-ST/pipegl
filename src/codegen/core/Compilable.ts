import { getIdx } from "../../util/getIdx";

/**
 * @date 2021/8/15
 * @description complie code
 * @author axmand
 * @example
 * //inherit 
 * class BlockClass extends Compilable{ }
 */
class Compilable {
    /**
     * @description
     */
    private id: string = `compilable-${getIdx()}`;

    get ID() {
        return this.id;
    }

    protected regularize = (raw: string): string => {
        return raw.replace(/\n/g, '').replace(/;/g, ';\n').replace(/}/g, '}\n').replace(/{/g, '{\n');
    }

    protected compile = (): string => {
        throw new Error(`${this.ID} unimplemented method`);
    }
}

export { Compilable }