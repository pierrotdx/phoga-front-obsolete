import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhogaSharedComponent } from './phoga-shared.component';

describe('PhogaSharedComponent', () => {
  let component: PhogaSharedComponent;
  let fixture: ComponentFixture<PhogaSharedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhogaSharedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PhogaSharedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
