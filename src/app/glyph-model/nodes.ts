import { TreeNode } from "primeng/api/treenode";


export enum NodeType {
    RECTANGLE = 0,
    ELLIPSE,
    LINE,
    PATH,
    GROUP
};

export let DefaultNames = ["Rectangle", "Ellipse", "Line", "Path", "Group"];
export let DefaultIcons = ["rect-icon", "circle-icon", "line-icon", "path-icon", "group-icon"];

export class PaperData {
    constructor(public item:any){}
}

export class GlyphNode implements TreeNode<PaperData> {
    data: PaperData;
    parent?: GroupNode | undefined;
    label?: string | undefined;
    icon?: string | undefined;

    constructor(item:any) {
        this.data = new PaperData(item);
        item.node = this; // Keep a reference of the node from the actual path
    }
}

export class MarkNode extends GlyphNode {
    leaf:boolean = true;
    markType: NodeType;

    constructor(path:any, markType:NodeType) {
        super(path);
        this.markType = markType;
        this.label = DefaultNames[markType];
        this.icon = DefaultIcons[markType];
    }
}

export class GroupNode extends GlyphNode {
    leaf:boolean = false;
    children: TreeNode<PaperData>[] = [];
    markType: NodeType = NodeType.GROUP;

    constructor(group:any) {
        super(group);
        this.label = DefaultNames[NodeType.GROUP];
        this.icon = DefaultIcons[NodeType.GROUP];
    }

    addChild(node: GlyphNode){
        this.children.push(node);
        node.parent = this;
    }
}
