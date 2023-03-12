import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeatherAppMainComponent } from './weather-app-main.component';

describe('WeatherAppMainComponent', () => {
  let component: WeatherAppMainComponent;
  let fixture: ComponentFixture<WeatherAppMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WeatherAppMainComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeatherAppMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
