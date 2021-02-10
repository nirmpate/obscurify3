import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YearBreakdownComponent } from './year-breakdown.component';

describe('YearBreakdownComponent', () => {
  let component: YearBreakdownComponent;
  let fixture: ComponentFixture<YearBreakdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YearBreakdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YearBreakdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
