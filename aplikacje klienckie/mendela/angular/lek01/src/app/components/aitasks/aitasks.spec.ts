import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AItasks } from './aitasks';

describe('AItasks', () => {
  let component: AItasks;
  let fixture: ComponentFixture<AItasks>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AItasks],
    }).compileComponents();

    fixture = TestBed.createComponent(AItasks);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
