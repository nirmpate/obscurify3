import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DecadeCardComponent } from './decade-card.component';

describe('DecadeCardComponent', () => {
  let component: DecadeCardComponent;
  let fixture: ComponentFixture<DecadeCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DecadeCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DecadeCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
