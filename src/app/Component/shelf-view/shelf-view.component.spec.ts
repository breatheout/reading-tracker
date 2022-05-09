import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShelfViewComponent } from './shelf-view.component';

describe('ShelfViewComponent', () => {
  let component: ShelfViewComponent;
  let fixture: ComponentFixture<ShelfViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShelfViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShelfViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
