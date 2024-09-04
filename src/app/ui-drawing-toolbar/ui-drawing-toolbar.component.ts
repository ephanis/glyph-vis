import { AfterViewInit, Component, Input } from '@angular/core';
import {ButtonModule} from 'primeng/button';
import {TieredMenuModule } from 'primeng/tieredmenu';
import {ToggleButtonModule} from 'primeng/togglebutton';
import { FormsModule } from '@angular/forms';
import { UiCanvasComponent } from '../ui-canvas/ui-canvas.component';

export enum DrawingTools {
  MOVE = 1,
  POINTER,
  SHAPE_EDIT,
  POINTER_REF,
  RECT,
  ELLIPSE,
  LINE,
  DRAW
}

@Component({
  selector: 'app-ui-drawing-toolbar',
  standalone: true,
  imports: [TieredMenuModule, ButtonModule, ToggleButtonModule, FormsModule],
  templateUrl: './ui-drawing-toolbar.component.html',
  styleUrl: './ui-drawing-toolbar.component.css'
})
export class UiDrawingToolbarComponent implements AfterViewInit  {

  @Input()
  public canvas!: UiCanvasComponent;

  public activeTool = DrawingTools.MOVE;
  
  pointerChecked: boolean = false;
  pointerRefChecked: boolean = false;
  editShapeChecked: boolean = false;
  moveChecked: boolean = true;
  lineChecked: boolean = false;
  rectChecked: boolean = false;
  circleChecked: boolean = false;
  drawChecked: boolean = false;

  resetTool(tool: DrawingTools) {
    if(tool == this.activeTool) return;

    switch(this.activeTool){
      case DrawingTools.MOVE: 
        this.moveChecked = false;
        break;
      case DrawingTools.POINTER:   
        this.pointerChecked = false;
        break;
      case DrawingTools.POINTER_REF:   
        this.pointerRefChecked = false;
        break;
      case DrawingTools.SHAPE_EDIT: 
        this.editShapeChecked = false;
        break;
      case DrawingTools.RECT: 
        this.rectChecked = false;
        break;
      case DrawingTools.ELLIPSE: 
        this.circleChecked = false;
        break;
      case DrawingTools.LINE: 
        this.lineChecked = false;
        break;
      case DrawingTools.DRAW: 
        this.drawChecked = false;
        break;
       default:
    }

    this.activeTool = tool;
    this.canvas.setTool(this.activeTool);
  }

  pointerPressed() {
    this.resetTool(DrawingTools.POINTER);
    this.pointerChecked = true;
  }

  pointerRefPressed() {
    // TODO:
    this.resetTool(DrawingTools.POINTER_REF);
    this.pointerRefChecked = true;
  }

  editShapePressed() {
    this.resetTool(DrawingTools.SHAPE_EDIT);
    this.editShapeChecked = true;
  }

  drawPressed() {
    this.resetTool(DrawingTools.DRAW);
    this.drawChecked = true;
  }

  circlePressed() {
    this.resetTool(DrawingTools.ELLIPSE);
    this.circleChecked = true;
  }

  rectPressed() {
    this.resetTool(DrawingTools.RECT);
    this.rectChecked = true;
  }

  linePressed() {
    this.resetTool(DrawingTools.LINE);
    this.lineChecked = true;
  }

  movePressed() {
    this.resetTool(DrawingTools.MOVE);
    this.moveChecked = true;
  }

  ngAfterViewInit(): void {
    this.canvas.setTool(this.activeTool);
  }

}
