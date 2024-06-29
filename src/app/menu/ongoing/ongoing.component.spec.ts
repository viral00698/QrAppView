import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OngoingComponent } from './ongoing.component';

describe('OngoingComponent', () => {
  let component: OngoingComponent;
  let fixture: ComponentFixture<OngoingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OngoingComponent]
    });
    fixture = TestBed.createComponent(OngoingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
