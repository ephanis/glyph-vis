import { Component, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { UiCanvasComponent } from '../ui-canvas/ui-canvas.component';
import {ButtonModule} from 'primeng/button';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-ui-grouping',
  changeDetection: ChangeDetectionStrategy.OnPush, 
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './ui-grouping.component.html',
  styleUrl: './ui-grouping.component.css'
})
export class UiGroupingComponent {

  @Input()
  public canvas!: UiCanvasComponent;

  constructor(public sanitizer:DomSanitizer, private cd: ChangeDetectorRef) { }


  refresh() {
    this.cd.detectChanges();
  }

}
