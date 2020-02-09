import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawDetailGraphComponent } from './draw-detail-graph.component';

describe('DrawDetailGraphComponent', () => {
  let component: DrawDetailGraphComponent;
  let fixture: ComponentFixture<DrawDetailGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrawDetailGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawDetailGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
