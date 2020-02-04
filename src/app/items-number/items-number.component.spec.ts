import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsNumberComponent } from './items-number.component';

describe('ItemsNumberComponent', () => {
  let component: ItemsNumberComponent;
  let fixture: ComponentFixture<ItemsNumberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemsNumberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemsNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
