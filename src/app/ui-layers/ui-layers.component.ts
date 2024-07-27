import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';

import { TreeModule, TreeNodeSelectEvent, TreeNodeUnSelectEvent } from 'primeng/tree'; // see https://primeng.org/
import {TreeNode} from 'primeng/api';
import { UiCanvasComponent } from '../ui-canvas/ui-canvas.component';
import { GlyphNode } from '../glyph-model/nodes';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';  


@Component({
  selector: 'app-ui-layers',
  changeDetection: ChangeDetectionStrategy.OnPush, // See: https://www.digitalocean.com/community/tutorials/angular-change-detection-strategy
  standalone: true,
  imports: [TreeModule, CommonModule],
  templateUrl: './ui-layers.component.html',
  styleUrl: './ui-layers.component.css'
})
export class UiLayersComponent {

  @Input()
  public canvas!: UiCanvasComponent;

  constructor(public sanitizer:DomSanitizer, private cd: ChangeDetectorRef) { }

  nodeUnselect(event: TreeNodeUnSelectEvent) {
    this.canvas.updateSelection();
  }
  
  nodeSelect(event: TreeNodeSelectEvent) {
    this.canvas.updateSelection();
  }
    
  refresh() {
    this.cd.detectChanges();
  }

}
