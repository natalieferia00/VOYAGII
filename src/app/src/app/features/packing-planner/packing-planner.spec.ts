import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackingPlanner } from './packing-planner';

describe('PackingPlanner', () => {
  let component: PackingPlanner;
  let fixture: ComponentFixture<PackingPlanner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PackingPlanner]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PackingPlanner);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
