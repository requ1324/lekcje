import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Xml } from './xml';

describe('Xml', () => {
  let component: Xml;
  let fixture: ComponentFixture<Xml>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Xml],
    }).compileComponents();

    fixture = TestBed.createComponent(Xml);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
