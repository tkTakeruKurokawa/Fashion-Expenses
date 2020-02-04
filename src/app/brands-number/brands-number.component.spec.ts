import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandsNumberComponent } from './brands-number.component';

describe('BrandsNumberComponent', () => {
  let component: BrandsNumberComponent;
  let fixture: ComponentFixture<BrandsNumberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrandsNumberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrandsNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
