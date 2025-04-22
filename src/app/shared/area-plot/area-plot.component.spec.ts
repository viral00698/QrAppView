import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaPlotComponent } from './area-plot.component';

describe('AreaPlotComponent', () => {
  let component: AreaPlotComponent;
  let fixture: ComponentFixture<AreaPlotComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AreaPlotComponent]
    });
    fixture = TestBed.createComponent(AreaPlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
