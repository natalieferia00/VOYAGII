import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountryCards } from './country-cards';

describe('CountryCards', () => {
  let component: CountryCards;
  let fixture: ComponentFixture<CountryCards>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CountryCards]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CountryCards);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
