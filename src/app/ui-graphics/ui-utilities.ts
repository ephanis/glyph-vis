import { GlyphNode } from "../glyph-model/nodes";

export function isDiagonal(from:any, to:any): boolean {
    if(from.x == to.x || from.y == to.y) return false;
    else return true;
}

export function contains(array: any[], val: any):boolean {
    return array.some(e => e === val);
}