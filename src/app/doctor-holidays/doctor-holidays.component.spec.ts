import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorHolidaysComponent } from './doctor-holidays.component';

describe('DoctorHolidaysComponent', () => {
  let component: DoctorHolidaysComponent;
  let fixture: ComponentFixture<DoctorHolidaysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DoctorHolidaysComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoctorHolidaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
