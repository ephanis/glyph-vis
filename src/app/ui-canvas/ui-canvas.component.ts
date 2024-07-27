import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import {Project, Path, Rectangle, Layer, Group} from 'paper'; //'paper/dist/paper-core';
import { UiPage } from '../ui-graphics/ui-page';
import { DrawingTools} from '../ui-drawing-toolbar/ui-drawing-toolbar.component';
import { isDiagonal } from '../ui-graphics/ui-utilities';
import { GlyphNode, MarkNode, NodeType } from '../glyph-model/nodes';
import { UiLayersComponent } from '../ui-layers/ui-layers.component';
import { Selector } from '../ui-graphics/ui-selector';

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

  @ViewChild("main_canvas") main_canvas!: ElementRef<HTMLCanvasElement>;
 
  paperProject : any; // Project
  drawingLayer: any; // Layer when drawing takes place
  selectionLayer: any // Layer for showing selection widgets -- not sure if i need it
  selector?: Selector;

  page!: UiPage; // Represented by the white page at the back
  tool!: DrawingTools;

  drawingPath: any; // Path under creation
  type?: NodeType;
  pathColor = "grey";
  fillColor = "white";

  nodes: GlyphNode[] = [];
  selectedNodes: GlyphNode[] = [];

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

      if(this.tool == DrawingTools.POINTER) { // Selection mode
        this.select(event);
        this.updateSelection();
      }
    }

    this.paperProject.view.onMouseDrag = (event:paper.MouseEvent) => {
      switch(this.tool){
        case DrawingTools.MOVE: 
          this.pan(eDown.point, event.point);
          break;
        case DrawingTools.POINTER:
          if(this.selectedNodes.length) this.move(eDown.point, event.point);
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
      if(this.tool == DrawingTools.POINTER) { 
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

  public updateSelection(){ // To update to support multiple selection
    if(this.selectedNodes.length > 0){
      for(let node of this.selectedNodes){
        node.data.item.pinPosition = node.data.item.position;
      }
    } 
    this.selector!.update(this.selectedNodes);
    this.layersPanel.refresh();
  }

  private select(event:paper.MouseEvent) {
    if(this.selector!.contains(event.point)){
      return;
    }

    const hitOptions = {
      stroke: true,
      fill: true,
      tolerance: 4,
      match: function(hitResult:any){
        if(hitResult.item && hitResult.item.node) return true; 
        else return false;
      }
    };

    const hitResult = this.paperProject.hitTest(event.point, hitOptions);
    if(hitResult) this.selectedNodes = [hitResult.item.node];
    else this.selectedNodes = [];
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
      node.data.item.position =  node.data.item.pinPosition.add(offset);
    }
    this.selector!.update(this.selectedNodes);
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
      case DrawingTools.POINTER:   
        this.setCursor("default");
        break;
       default: this.setCursor("crosshair");
    }
  }

}
