import { Point } from "paper";
import { TreeNode } from "primeng/api/treenode";

export enum NodeType {
    RECTANGLE = 0,
    ELLIPSE,
    LINE,
    PATH,
    GROUP
};

export enum RelativePosition {
    CENTER = 0,
    TOP_LEFT,
    TOP_CENTER,
    TOP_RIGHT,
    CENTER_LEFT,
    CENTER_RIGHT,
    BOTTOM_LEFT,
    BOTTOM_CENTER,
    BOTTOM_RIGHT
}

export let DefaultNames = ["Rectangle", "Ellipse", "Line", "Path", "Group"];
export let DefaultIcons = ["rect-icon", "circle-icon", "line-icon", "path-icon", "group-icon"];

export class PaperData {
    constructor(public item:any){}
}

export class Origin {
    constructor(public reference: RelativePosition, public offset: any){ }
}

export class GlyphNode implements TreeNode<PaperData> {
    data: PaperData;
    parent?: GroupNode | undefined;
    label?: string | undefined;
    icon?: string | undefined;

    origin: Origin = new Origin(RelativePosition.CENTER, new Point({x:0, y:0}));

    constructor(item:any) {
        this.data = new PaperData(item);
        item.node = this; // Keep a reference of the node from the actual path
    }

    getRootNode(): GlyphNode {
        if(this.parent) return this.parent.getRootNode();
        else return this; 
    }

    getOrigin() {
        const rect = this.data.item.bounds;

        switch(this.origin.reference){
            case RelativePosition.CENTER: 
                return rect.center.add(this.origin.offset);
            case RelativePosition.TOP_LEFT:        
                return rect.topLeft.add(this.origin.offset);
            case RelativePosition.TOP_CENTER:
                return rect.topCenter.add(this.origin.offset);
            case RelativePosition.TOP_RIGHT:
                return rect.topRight.add(this.origin.offset);
            case RelativePosition.CENTER_LEFT:
                return rect.leftCenter.add(this.origin.offset);
            case RelativePosition.CENTER_RIGHT:
                return rect.rightCenter.add(this.origin.offset);
            case RelativePosition.BOTTOM_LEFT:
                return rect.bottomLeft.add(this.origin.offset);
            case RelativePosition.BOTTOM_CENTER:
                return rect.bottomCenter.add(this.origin.offset);
            case RelativePosition.BOTTOM_RIGHT:
                return rect.bottomRight.add(this.origin.offset);
            default:
        }
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

    setChildren(nodes: GlyphNode[]){
        nodes.forEach(node => {
            node.parent = this;
            this.data.item.addChild(node.data.item);
        });
        this.children = nodes;
    }
}
