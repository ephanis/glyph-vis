import { Component, Input } from '@angular/core';
import { UiCanvasComponent } from '../ui-canvas/ui-canvas.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { DividerModule } from 'primeng/divider';
import {DropdownModule} from 'primeng/dropdown';

interface Origin {
  name: string,
  code: number
}

@Component({
  selector: 'app-ui-attributes',
  standalone: true,
  imports: [InputNumberModule, FormsModule, DropdownModule, DividerModule],
  templateUrl: './ui-attributes.component.html',
  styleUrl: './ui-attributes.component.css'
})
export class UiAttributesComponent {

  @Input()
  public canvas!: UiCanvasComponent;
  
  originPoints: Origin[] = [
    {name:"Top Left", code:1}, 
    {name:"Top Center", code:2}, 
    {name:"Top Right", code:3}, 
    {name:"Center Left", code:4}, 
    {name:"Center", code:5}, 
    {name:"Center Right", code:6}, 
    {name:"Bottom Left", code:7}, 
    {name:"Bottom Center", code:8},
    {name:"Bottom Right", code:9}
  ];

  selectedOriginCode = 5;

  value1 = 100;

}
