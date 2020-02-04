import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandsValueComponent } from './brands-value.component';

describe('BrandsValueComponent', () => {
  let component: BrandsValueComponent;
  let fixture: ComponentFixture<BrandsValueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrandsValueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrandsValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
