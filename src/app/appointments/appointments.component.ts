import { Component } from '@angular/core';
import { formatDate, formatTime } from './../utils/helpers'; // Adjust path accordingly

@Component({
  selector: 'app-appointments',
  standalone: false,
  templateUrl: './appointments.component.html',
  styleUrl: './appointments.component.css',
})
export class AppointmentsComponent {
  filters = {
    date: '',
    clinic: '',
    patient: '',
    status: '',
    doctorName: '',
  };

  clinicFilters = [
    'clinic one',
    'New clinic'
  ]
  patientFilters = [
    'patient one',
    'New Patient'
  ]
  statusFilters = [
    'All',
    'Upcoming',
    'Completed (Check out)',
    'Cancelled',
    'Check-in',
    'Pending'
  ]
  doctorFilters = [
    'Doc 1 (MBBS)',
    'Doc 2 (Dermmatology, Family Medicine)'
  ]
  timeSlots = [
    '11.00am - 11.30am',
    '11.30pm - 12.00am',
    '12.30am - 1.00am',
    '1.00am - 1.30am',
    '1.30am - 2.00am',
    '2.00am - 2.30am',
    '2.30am - 3.00am',
    '3.00am - 3.30am',
    '3.30am - 4.00am',
    '4.00am - 4.30am',
  ]
  selectedSlot:any;
  serviceDetail = [
    {
      service: "Telmed",
      charge: "100",
    },
    {
      service: "Dental checkup",
      charge: "240",
    },
    {
      service: "Full body scan",
      charge: "620",
    },

  ]
  tax:any;
  showAddAppointmentForm:boolean = false;

  formatDate = formatDate;
  formatTime = formatTime;

  selectedChipFilter: any = 'upcoming';

  changeChipFilter(filter: any) {
    console.log('Chip Filter set to: ', filter);
    //make an api call or whatever
    this.selectedChipFilter = filter;
  }

  setSelectedSlot(slot:any){
    console.log("Selected Slot: ", slot);
    this.selectedSlot = slot;
  }

  appointments = [
    {
      id: 1,
      patientName: 'Test',
      services: [
        'Body checkup',
        'Dental checkup',
        'test',
        'new test checkup data',
      ],
      charges: '200',
      paymentMode: 'Manual',
      status: 'Booked',
      doctor: 'Doc One',
      clinic: 'Some clinic',
      slotDateAndTime: '2025-06-03T05:57:11Z',
    },
    {
      id: 2,
      patientName: 'Reh test Two',
      services: ['Eye checkup', 'Telmed'],
      charges: '460',
      paymentMode: 'Manual',
      status: 'Pending',
      doctor: 'Doc One',
      clinic: 'Some clinic',
      slot: '2025-06-03T05:58:34Z',
    },
  ];

  addAppointment() {
    console.log('Add appointment');
    this.showAddAppointmentForm = true;
  }
  importData() {
    console.log('Import data');
  }
  viewAppointment(id: any) {
    console.log('Viewing appointment', id);
  }
  editAppointment(id: any) {
    console.log('Editing appointment', id);
  }
  printAppointment(id: any) {
    console.log('Printing appointment', id);
  }
  checkinAppointment(id: any) {
    console.log('Check-In appointment', id);
  }
  deleteAppointment(id: any) {
    console.log('Delete appointment', id);
  }
  submitAddAppointmentForm(){
    console.log("Submit Add appointment")
  }
}
