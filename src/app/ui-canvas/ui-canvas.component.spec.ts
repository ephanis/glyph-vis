import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiCanvasComponent } from './ui-canvas.component';

describe('UiCanvasComponent', () => {
  let component: UiCanvasComponent;
  let fixture: ComponentFixture<UiCanvasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiCanvasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UiCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
