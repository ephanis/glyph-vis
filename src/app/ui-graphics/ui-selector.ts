import { Path, Rectangle, Group } from "paper";
import { GlyphNode, RelativePosition } from "../glyph-model/nodes";
import { isDiagonal } from "./ui-utilities";


export class Handle {
    path:any; 

    constructor(public selector:Selector, public pos:RelativePosition) {
        this.path = new Path.Circle({
            center: [200,200],
            radius: 4,
            strokeColor: '#0197F6',
            fillColor: 'white',
            strokeWidth: 1
        });

    }

    update(bounds: any) { 
        switch(this.pos){
            case RelativePosition.TOP_LEFT:
                this.path.position = bounds.topLeft;
                break;
            case RelativePosition.TOP_CENTER:
                this.path.position = bounds.topCenter;
                break;
            case RelativePosition.TOP_RIGHT:
                this.path.position = bounds.topRight;
                break;
            case RelativePosition.CENTER_LEFT:
                this.path.position = bounds.leftCenter;
                break;
            case RelativePosition.CENTER_RIGHT:
                this.path.position = bounds.rightCenter;
                break;
            case RelativePosition.BOTTOM_LEFT:
                this.path.position = bounds.bottomLeft;
                break;
            case RelativePosition.BOTTOM_CENTER:
                this.path.position = bounds.bottomCenter;
                break;
            case RelativePosition.BOTTOM_RIGHT:
                this.path.position = bounds.bottomRight;
                break;
            default:
        }
    }

    setVisible(visible: boolean){
        this.path.visible = visible;

        if(visible) {
            let down:any;

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
                this.path.pinPosition = this.path.position;
            };

            this.path.onMouseDrag = (event:paper.MouseEvent) => {
                event.stopPropagation();
                this.resizeSelector(down, event.point);
            };

            this.path.onMouseUp = (event:paper.MouseEvent) => {
                event.stopPropagation();
                this.selector.updateContent();
                if(!this.path.contains(event.point)) this.path.scaling = .625;
                down = null;
            };

        } else {
            this.path.onMouseEnter = null;
            this.path.onMouseLeave = null;
        }
    }

    resizeSelector(from:any, to:any){
        let rect = this.selector.outline.bounds;
        rect.topLeft = rect.topLeft;
        rect.bottomRight = rect.bottomRight;

        let offset = to.subtract(from);

        switch(this.pos){
            case RelativePosition.TOP_LEFT:        
                rect.topLeft = this.path.pinPosition.add(offset);
                break;
            case RelativePosition.TOP_CENTER:
                rect.top = offset.y + this.path.pinPosition.y; 
                break;
            case RelativePosition.TOP_RIGHT:
                rect.topRight = this.path.pinPosition.add(offset);
                break;
            case RelativePosition.CENTER_LEFT:
                rect.left = offset.x + this.path.pinPosition.x; 
                break;
            case RelativePosition.CENTER_RIGHT:
                rect.right = offset.x + this.path.pinPosition.x; 
                break;
            case RelativePosition.BOTTOM_LEFT:
                rect.bottomLeft = this.path.pinPosition.add(offset);
                break;
            case RelativePosition.BOTTOM_CENTER:
                rect.bottom = offset.y + this.path.pinPosition.y; 
                break;
            case RelativePosition.BOTTOM_RIGHT:
                rect.bottomRight = this.path.pinPosition.add(offset);
                break;
            default:
        }

        if(rect.width > 0 && rect.height > 0){
             this.selector.updateOutline(rect);
        } else {
            if(rect.width < 0) {
                rect.x = rect.x + rect.width;
                rect.width = -rect.width;
                this.selector.mirrorHandlesHorizontally();
            }
            if(rect.height < 0) {
                rect.y = rect.y + rect.height;
                rect.height = -rect.height;
                this.selector.mirrorHandlesVertically();
            }

            this.selector.updateOutline(rect);
        }
    }
} 

export class Selector {
    outline: any;
    handles: Handle[] = [];
    nodes: GlyphNode[] = [];

    rectSelector: any; // Rectangular selection tool

    constructor() {
        this.outline = new Path.Rectangle({
            point: [200,200],
            size: [100,100],
            strokeColor: '#0197F6',
            strokeWidth: 1,
            visible: false
        });

        for(let pos = RelativePosition.TOP_LEFT; pos <= RelativePosition.BOTTOM_RIGHT; ++pos) { 
            const handle = new Handle(this, pos);
            handle.setVisible(false);
            this.handles.push(handle);
        }
    }

    mirrorHandlesHorizontally(){
        for(var handle of this.handles){
            switch(handle.pos) {
                case RelativePosition.TOP_LEFT:        
                    handle.pos = RelativePosition.TOP_RIGHT;
                    break;
                case RelativePosition.TOP_RIGHT:
                    handle.pos = RelativePosition.TOP_LEFT;
                    break;
                case RelativePosition.CENTER_LEFT:
                    handle.pos = RelativePosition.CENTER_RIGHT;
                    break;
                case RelativePosition.CENTER_RIGHT:
                    handle.pos = RelativePosition.CENTER_LEFT;
                    break;
                case RelativePosition.BOTTOM_LEFT:
                    handle.pos = RelativePosition.BOTTOM_RIGHT;
                    break;
                case RelativePosition.BOTTOM_RIGHT:
                    handle.pos = RelativePosition.BOTTOM_LEFT;
                    break;
                default:
            }
        }
    }

    mirrorHandlesVertically(){
        for(var handle of this.handles){
            switch(handle.pos){
                case RelativePosition.TOP_LEFT:        
                    handle.pos = RelativePosition.BOTTOM_LEFT;
                    break;
                case RelativePosition.TOP_CENTER:
                    handle.pos = RelativePosition.BOTTOM_CENTER;
                    break;
                case RelativePosition.TOP_RIGHT:
                    handle.pos = RelativePosition.BOTTOM_RIGHT;
                    break;
                case RelativePosition.BOTTOM_LEFT:
                    handle.pos = RelativePosition.TOP_LEFT;
                    break;
                case RelativePosition.BOTTOM_CENTER:
                    handle.pos = RelativePosition.TOP_CENTER;
                    break;
                case RelativePosition.BOTTOM_RIGHT:
                    handle.pos = RelativePosition.TOP_RIGHT;
                    break;
                default:
            }
        }
    }

    update(nodes:GlyphNode[]){
        this.nodes = nodes;

        if(nodes.length > 0) {
            this.outline.visible = true;

            let rect = nodes[0].data.item.bounds;
            for(let i = 1; i < nodes.length; ++i){
                rect = rect.unite(nodes[i].data.item.bounds);
            }
            this.outline.bounds = rect;

            for(var handle of this.handles){
                handle.update(rect);
                handle.setVisible(true);
            }
        } else {
            this.outline.visible = false;
            for(var handle of this.handles)
                handle.setVisible(false);
        } 
    }
    
    updateOutline(rect:any) {
        this.outline.bounds = rect;

        for(var handle of this.handles){
            handle.update(rect);
        }
    }

    updateContent() {
        //this.nodes[0].data.item.bounds = this.outline.bounds;

        // Create a temporary group to handle resizing of multiple shapes
        let group = new Group({visible:false});
        for(let node of this.nodes) {
            group.addChild(new Path.Rectangle(node.data.item.bounds));
        }
        group.bounds = this.outline.bounds; // Resize the group
        
        // And now, extract the individual bounds and apply them to the individual nodes
        for(let i = 0; i < this.nodes.length; ++i) {
            this.nodes[i].data.item.bounds = group.children[i].bounds;
        }

        group.remove(); // Remove it as I don't need it
    }

    showRectSelector(from:any, to:any){
        if(!this.rectSelector && isDiagonal(from, to)) {
            this.rectSelector = new Path.Rectangle({
                from: from, 
                to: to,
                strokeColor: '#0197F6',
                dashArray: [2, 4]
            });
            } else if(isDiagonal(from, to)){
            this.rectSelector.bounds = new Rectangle(from, to);
            }
    }

    select(){
        this.rectSelector.remove();
        this.rectSelector = null;
    }

    contains(point:any):boolean {
        if(this.outline.visible && this.outline.contains(point))
            return true;
        else return false;
    }
}