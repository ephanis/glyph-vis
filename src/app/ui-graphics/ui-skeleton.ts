import { GlyphNode, RelativePosition } from "../glyph-model/nodes";
import { Path } from "paper";

export class OriginHandle {
    path:any; 

    constructor(public node: GlyphNode) {
        this.path = new Path.Circle({
            center: node.getOrigin(),
            radius: 5,
            strokeColor: '#0197F6',
            fillColor: 'white',
            strokeWidth: 1
        });

        this.setVisible(true);
    }

    update() { 
        this.path.position = this.node.getOrigin();
    }

    setVisible(visible: boolean){
        this.path.visible = visible;

        if(visible) {
            let down:any;
            let offset_0:any;

            this.path.onMouseEnter = (event:paper.MouseEvent) => {
                event.stopPropagation();
                if(!down) this.path.scaling = 1.6;
             };
     
             this.path.onMouseLeave = (event:paper.MouseEvent) => {
                event.stopPropagation();
                if(!down) this.path.scaling = .625;
             };

            this.path.onMouseDown = (event:paper.MouseEvent) => {
                event.stopPropagation();
                down = event.point;
                offset_0 = this.node.origin.offset;
                this.path.pinPosition = this.path.position;
            };

            this.path.onMouseDrag = (event:paper.MouseEvent) => {
                event.stopPropagation();
                this.move(offset_0, down, event.point);
            };

            this.path.onMouseUp = (event:paper.MouseEvent) => {
                event.stopPropagation();
                //this.selector.updateContent();
                if(!this.path.contains(event.point)) this.path.scaling = .625;
                down = null;
            };

        } else {
            this.path.onMouseEnter = null;
            this.path.onMouseLeave = null;
        }
    }

    move(offset:any, from:any, to:any){ 
        this.node.origin.offset = to.subtract(from).add(offset);
        this.update();
    }
}

export class Skeleton {
    origin: OriginHandle;

    constructor(public node: GlyphNode) {
        this.origin = new OriginHandle(node);
    }

    destroy() {
        this.origin.path.remove();
    }

}


export class SkeletonVisualizer {
    nodes: GlyphNode[] = [];
    skeletons: Skeleton[] = [];

    clear() {
        for(var skeleton of this.skeletons){
           skeleton.destroy();
        }
        this.skeletons = [];
    }

    update(nodes:GlyphNode[]){
        this.clear();
        for(var node of nodes){
            this.skeletons.push(new Skeleton(node));
        }
        this.nodes = nodes;
    }

    add(node:GlyphNode) {
        this.nodes.push(node);
        this.skeletons.push(new Skeleton(node));
    }

    refresh(){
        for(var skeleton of this.skeletons){
            skeleton.origin.update();
         }
    }
}
