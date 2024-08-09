import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiGroupingComponent } from './ui-grouping.component';

describe('UiGroupingComponent', () => {
  let component: UiGroupingComponent;
  let fixture: ComponentFixture<UiGroupingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiGroupingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UiGroupingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
