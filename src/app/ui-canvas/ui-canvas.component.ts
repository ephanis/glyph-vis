import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import {Project, Path, Rectangle, Layer, Group} from 'paper'; //'paper/dist/paper-core';
import { UiPage } from '../ui-graphics/ui-page';
import { DrawingTools} from '../ui-drawing-toolbar/ui-drawing-toolbar.component';
import { isDiagonal, contains } from '../ui-graphics/ui-utilities';
import { GlyphNode, GroupNode, MarkNode, NodeType } from '../glyph-model/nodes';
import { UiLayersComponent } from '../ui-layers/ui-layers.component';
import { Selector } from '../ui-graphics/ui-selector';
import { UiGroupingComponent } from '../ui-grouping/ui-grouping.component';

@Component({
  selector: 'app-ui-canvas',
  standalone: true,
  imports: [],
  templateUrl: './ui-canvas.component.html',
  styleUrl: './ui-canvas.component.css'
})
export class UiCanvasComponent implements AfterViewInit {
  @Input()
  public layersPanel!: UiLayersComponent;

  @Input()
  public groupingTools!: UiGroupingComponent;

  @ViewChild("main_canvas") main_canvas!: ElementRef<HTMLCanvasElement>;
 
  paperProject : any; // Project
  drawingLayer: any; // Layer when drawing takes place
  selectionLayer: any // Layer for showing selection widgets -- not sure if i need it
  selector?: Selector;

  segment: any; // segment selection with edit tool

  page!: UiPage; // Represented by the white page at the back
  tool!: DrawingTools;

  drawingPath: any; // Path under creation
  type?: NodeType;
  pathColor = "grey";
  fillColor = "white";

  nodes: GlyphNode[] = [];
  selectedNodes: GlyphNode[] = [];
  vectorSelection:  GlyphNode[] = [];

  ngAfterViewInit(): void {
    this.paperProject = new Project('main-canvas');
    this.drawingLayer = this.paperProject.activeLayer;
    this.page = new UiPage(this.paperProject, 2000, 1000);

    this.selectionLayer = new Layer();
    this.selectionLayer.activate();
    this.selector = new Selector();

    this.drawingLayer.activate();

    let eDown: paper.MouseEvent;
    this.paperProject.view.onMouseDown = (event:paper.MouseEvent) => {
      eDown = event;

      if(this.tool == DrawingTools.POINTER || this.tool == DrawingTools.SHAPE_EDIT) { // Selection mode
        this.select(event);
        this.updateSelection();
      }
    }

    this.paperProject.view.onMouseDrag = (event:paper.MouseEvent) => {
      switch(this.tool){
        case DrawingTools.MOVE: 
          this.pan(eDown.point, event.point);
          break;
        case DrawingTools.SHAPE_EDIT:
        case DrawingTools.POINTER:
          if(this.segment) {
            this.segment.point.x += event.delta.x;
            this.segment.point.y += event.delta.y;
          }
          else if(this.selectedNodes.length) this.move(eDown.point, event.point);
          else {
            this.selector!.showRectSelector(eDown.point, event.point);
          }
          break;
        case DrawingTools.RECT: 
          this.type = NodeType.RECTANGLE;
          this.drawRect(eDown.point, event.point);
          break;
        case DrawingTools.ELLIPSE: 
          this.type = NodeType.ELLIPSE;
          this.drawEllipse(eDown.point, event.point);
          break;
        case DrawingTools.LINE: 
          this.type = NodeType.LINE;
          this.drawLine(eDown.point, event.point);
          break;
        case DrawingTools.DRAW: 
          this.type = NodeType.PATH;
          break;
        default:
      }      
    }

    this.paperProject.view.onMouseUp = (event:paper.MouseEvent) => {
      if(this.tool == DrawingTools.POINTER || this.tool == DrawingTools.SHAPE_EDIT) {
        this.segment = null; 
        if(this.selector!.rectSelector){
          this.selectRect(this.selector!.rectSelector.bounds);
          this.selector!.select();
        }
        this.updateSelection();
      }
      else if(this.drawingPath) {
        let node = new MarkNode(this.drawingPath, this.type!);
        this.nodes.unshift(node);
        this.drawingPath = null;
        this.selectedNodes = [node];
        this.selector!.update(this.selectedNodes);
        this.layersPanel.refresh();
      }
    }
  }

  public updateSelection(){
    const editMode = this.tool == DrawingTools.SHAPE_EDIT;
    
    if(this.selectedNodes.length > 0){
      for(let node of this.selectedNodes){
        node.data.item.pinPosition = node.data.item.position;
      }
    } 
    if(editMode) {
      this.selector!.update([]);
      for(let node of this.vectorSelection){
        node.data.item.selected= false;
       }
      for(let node of this.selectedNodes){
       node.data.item.selected= true;
      }
      this.vectorSelection = this.selectedNodes;
    }
    else{
      for(let node of this.selectedNodes){
        node.data.item.selected= false;
      }
      this.selector!.update(this.selectedNodes);
    } 
    this.layersPanel.refresh();
    this.groupingTools.refresh();
  }

  private select(event:paper.MouseEvent) {
    if(this.selector!.contains(event.point)){
      return;
    }

    const hitOptions = {
      segments: true,
      stroke: true,
      fill: true,
      tolerance: 5,
      match: function(hitResult:any){
        if(hitResult.item && hitResult.item.node) return true; 
        else return false;
      }
    };

    const hitResult = this.paperProject.hitTest(event.point, hitOptions);

    if(!hitResult) {
      this.segment = null;
      this.selectedNodes = [];
    }
    else {
      if(this.tool != DrawingTools.SHAPE_EDIT || !contains(this.selectedNodes, hitResult.item.node)) this.segment = null;
      else if(hitResult.type == "segment"){
        this.segment = hitResult.segment;
      }  else if(hitResult.type == 'stroke') {
        var location = hitResult.location;
        this.segment = hitResult.item.insert(location.index + 1, event.point);
        //hitResult.item.smooth();
      } else this.segment = null;

      if(this.tool == DrawingTools.SHAPE_EDIT) this.selectedNodes = [hitResult.item.node];
      else {
        this.selectedNodes = [hitResult.item.node.getRootNode()];
      }
    }
  }

  private selectRect(rect:any) {
    this.selectedNodes = [];
    for(let node of this.nodes) {
      if(node.data.item.bounds.intersects(rect))
        this.selectedNodes.push(node);
    }
  }

  private move(from:any, to:any){
    let offset = to.subtract(from);
    for(let node of this.selectedNodes){
      node.data.item.position = node.data.item.pinPosition.add(offset);
    }
    if(this.tool == DrawingTools.POINTER) this.selector!.update(this.selectedNodes);
  }

  private pan(from:any, to:any){
    let offset = to.subtract(from);
    this.paperProject.view.center = this.paperProject.view.center.subtract(offset);
  }


  private drawRect(from:any, to:any){
    if(!this.drawingPath && isDiagonal(from, to)) {
      this.drawingPath = new Path.Rectangle({
        from: from, 
        to: to,
        strokeColor: this.pathColor,
        fillColor: this.fillColor
      });
    } else if(isDiagonal(from, to)){
      this.drawingPath.bounds = new Rectangle(from, to);
    }
  }

  private drawEllipse(from:any, to:any){
    if(!this.drawingPath && isDiagonal(from, to)) {
      this.drawingPath = new Path.Ellipse(new Rectangle(from, to));
      this.drawingPath.strokeColor = this.pathColor;
      this.drawingPath.fillColor = this.fillColor;
    } else if(isDiagonal(from, to)){
      this.drawingPath.bounds = new Rectangle(from, to);
    }
  }

  private drawLine(from:any, to:any){
    if(!this.drawingPath) {
      this.drawingPath = new Path.Line(from, to);
      this.drawingPath.strokeColor = this.pathColor;
    } else {
      this.drawingPath.removeSegment(1);
      this.drawingPath.add(to);
    }
  }

  public setCursor(cursor:string){
    this.main_canvas.nativeElement.style.cursor = cursor;
  }

  public setTool(tool: DrawingTools) {
    this.tool = tool;

    switch(tool){
      case DrawingTools.MOVE: 
        this.setCursor("move");
        break;
      case DrawingTools.SHAPE_EDIT:   
        //this.selectedNodes = [];
        this.updateSelection();
        this.setCursor("default");
        break;

      case DrawingTools.POINTER: 
        this.updateSelection();
        this.setCursor("default");
        break;
       default: this.setCursor("crosshair");
    }
  }

  groupSelected() { // TODO: Not ready
    const group = new Group();
    const groupNode = new GroupNode(group);
    groupNode.setChildren(this.selectedNodes.reverse());

    this.nodes = this.nodes.filter(v => !this.selectedNodes.includes(v));
    this.nodes.unshift(groupNode);
    this.selectedNodes = [groupNode];
    this.updateSelection();
  }
}
