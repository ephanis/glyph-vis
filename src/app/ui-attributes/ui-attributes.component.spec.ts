import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiAttributesComponent } from './ui-attributes.component';

describe('UiAttributesComponent', () => {
  let component: UiAttributesComponent;
  let fixture: ComponentFixture<UiAttributesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiAttributesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UiAttributesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
