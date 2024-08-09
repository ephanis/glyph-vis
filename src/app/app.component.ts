import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UiLayersComponent } from "./ui-layers/ui-layers.component";
import { UiCanvasComponent } from "./ui-canvas/ui-canvas.component";
import { UiDrawingToolbarComponent } from "./ui-drawing-toolbar/ui-drawing-toolbar.component";
import { UiGroupingComponent } from "./ui-grouping/ui-grouping.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, UiLayersComponent, UiCanvasComponent, UiDrawingToolbarComponent, UiGroupingComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'glyph-vis';
}
