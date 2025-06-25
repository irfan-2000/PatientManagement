import { Component } from '@angular/core';

@Component({
  selector: 'app-doctor-holidays',
  standalone: false,
  templateUrl: './doctor-holidays.component.html',
  styleUrl: './doctor-holidays.component.css'
})
export class DoctorHolidaysComponent {
  holidays = [
    {
      id: 1,
      name: 'Dr. John Doe',
      scheduleOf: 'Doctor',
      fromDate: '2025-12-24',
      toDate: '2025-12-26',
    },
    {
      id: 2,
      name: 'Dr. Jane Smith',
      scheduleOf: 'Doctor',
      fromDate: '2025-12-31',
      toDate: '2026-01-01',
    },
    {
      id: 3,
      name: 'Valley Clinic',
      scheduleOf: 'Clinic',
      fromDate: '2025-07-01',
      toDate: '2025-07-03',
    },
  ];

  editHoliday(holiday: any) {
    console.log('Editing holiday:', holiday);
  }

  deleteHoliday(holiday: any) {
    console.log('Deleting holiday:', holiday);
  }

   // Modal control
   showModal = false;

   // Form data
   holidayType: 'Doctor' | 'Clinic' = 'Doctor';
   scheduleDate: string = '';
   selectedName: string = '';
 
   doctors = ['Dr. John Doe', 'Dr. Jane Smith', 'Dr. Emily Brown'];
   clinics = ['City Hospital', 'Sunrise Clinic', 'Green Valley Center'];

   openModal() {
    this.showModal = true;
    this.holidayType = 'Doctor';
    this.scheduleDate = '';
    this.selectedName = '';
  }

  saveHoliday() {
    console.log('Save holiday:', {
      type: this.holidayType,
      date: this.scheduleDate,
      name: this.selectedName
    });
    this.showModal = false;
  }

  cancelHoliday() {
    console.log('Cancel holiday');
    this.showModal = false;
  }

}
