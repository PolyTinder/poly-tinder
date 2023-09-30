import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageControlComponent } from './image-control.component';

describe('ImageControlComponent', () => {
  let component: ImageControlComponent;
  let fixture: ComponentFixture<ImageControlComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ImageControlComponent]
    });
    fixture = TestBed.createComponent(ImageControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
