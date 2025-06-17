import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorSessionsComponent } from './doctor-sessions.component';

describe('DoctorSessionsComponent', () => {
  let component: DoctorSessionsComponent;
  let fixture: ComponentFixture<DoctorSessionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DoctorSessionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoctorSessionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
