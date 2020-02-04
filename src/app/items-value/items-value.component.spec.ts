import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsValueComponent } from './items-value.component';

describe('ItemsValueComponent', () => {
  let component: ItemsValueComponent;
  let fixture: ComponentFixture<ItemsValueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemsValueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemsValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
