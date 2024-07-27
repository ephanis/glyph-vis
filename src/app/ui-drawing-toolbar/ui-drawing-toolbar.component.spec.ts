import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiDrawingToolbarComponent } from './ui-drawing-toolbar.component';

describe('UiDrawingToolbarComponent', () => {
  let component: UiDrawingToolbarComponent;
  let fixture: ComponentFixture<UiDrawingToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiDrawingToolbarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UiDrawingToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
