import { Component } from '@angular/core';
import { formatDate, formatTime } from './../utils/helpers'; // Adjust path accordingly
import { DoctorServiceService } from '../doctor-service.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { HospitalServiceService } from '../hospital-service.service';
import { PatientService } from '../patient.service';

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

  selectServicesArray = [
    {
      id: 1,
      name: 'Service One',
    },
    {
      id: 2,
      name: 'Blood test',
    },
    {
      id: 3,
      name: 'New service',
    }
  ]
  onserviceChanged(services:any){
    console.log("Selected Services", services)
  }

timeSlots = [
  { startTime: '14:00:00', endTime: '14:30:00', label: '11:00 AM - 11:30 AM' },
  { startTime: '23:30:00', endTime: '00:00:00', label: '11:30 PM - 12:00 AM' },
  { startTime: '00:30:00', endTime: '01:00:00', label: '12:30 AM - 1:00 AM' },
  { startTime: '01:00:00', endTime: '01:30:00', label: '1:00 AM - 1:30 AM' },
  { startTime: '01:30:00', endTime: '02:00:00', label: '1:30 AM - 2:00 AM' },
  { startTime: '02:00:00', endTime: '02:30:00', label: '2:00 AM - 2:30 AM' }
];

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

  ErrorMsg: any = {};
  services:any[] = [];
  doctors:any [] = [];
  patients:any[] = [];
  Appointmentform:FormGroup;

  constructor(private doctorservice:DoctorServiceService, private hospservice:HospitalServiceService,
private fb: FormBuilder, private toastr: ToastrService,private router: Router,private PatientService:PatientService)
{
this.GetAllDoctors();
 this.GetServices();
 this.GetPatientDetails();
this.Appointmentform = new FormGroup({
  doctor: new FormControl('', Validators.required),
  service: new FormControl('', Validators.required), // <-- fixed
  AppointmentDate: new FormControl('', Validators.required), // <-- fixed
  patient: new FormControl('', Validators.required),
  status: new FormControl('', Validators.required),
  slot: new FormControl('', Validators.required),
 }); 
}

  changeChipFilter(filter: any) {
    console.log('Chip Filter set to: ', filter);
    //make an api call or whatever
    this.selectedChipFilter = filter;
  }

  setSelectedSlot(slot:any){
    console.log("Selected Slot: ", slot);
    debugger
    this.Appointmentform.get('slot')?.setValue(slot); // Manually set value
      this.selectedSlot = slot
     console.log("Selected Slot: ",  this.Appointmentform.get('slot')?.value);
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


     
  async GetAllDoctors() {

    try {
      const response = await this.doctorservice.GetAllDoctors();
      console.log(response);

      if (response?.status === 200) {
        this.doctors = response.doctorsData;
         console.log("After assinging", this.doctors);

      }
      if (response.status == 401) 
        {
        this.router.navigate(['/login']);
        return;
      }
    } catch (error: any) 
{
   ;

  if (error.status === 401 || error?.error?.status === 401) {
    this.router.navigate(['/login']);
    return;
  }

  console.error('Error:', error);
 }
  }


  GetServices()
  {
    
  try {
    this.hospservice.GetServices( ).subscribe({
      next: (response: any) => {
        if (response.status == 200) 
          {
          
         
            this.services = response.result;
               
        }
          
      },
      error: (error: any) => {
        if (error.status ==401) {
          this.router.navigate(['/login']);
        } else {
          console.error('Error saving service:', error);
         }
      }
    });
  } catch (error: any) {
    console.error('Exception:', error);
   }
  }
  GetPatientDetails(flag:any = 'GetPatients',Tab = 'Details')
{
  
  
      try {
        this.PatientService.GetPatientDetails(flag ,Tab).subscribe({
          next: (response: any) => {
            if (response.status === 200) 
              {
                  
                 this.patients= response.result;
              //this.showToast('success', 'Doctor details updated successfully!', 'Success');
             // window.location.reload();
            }
          },
          error: (error: any) => {

            console.log(error);
            if (error.status === 401) 
              {
            this.router.navigate(['/login']);
              } else if (error.status === 500 && error.error) {

            } else {
              console.error('Unhandled API error:', error);
            }
          },
        });
      } catch (error: any) {
        console.error('API error:', error);
      }
 

  }


  validateAppointmentForm() {
  this.ErrorMsg = {};
  let errorcode = 0;

  if (this.Appointmentform.get('doctor')?.value == '' || this.Appointmentform.get('doctor')?.value == undefined || this.Appointmentform.get('doctor')?.value == null) {
    this.ErrorMsg["doctor"] = 'Doctor is required!';
    errorcode = 1;
  }

  if (this.Appointmentform.get('service')?.value == '' || this.Appointmentform.get('service')?.value == undefined || this.Appointmentform.get('service')?.value == null) {
    this.ErrorMsg["service"] = 'Service is required!';
    errorcode = 1;
  }

  if (this.Appointmentform.get('AppointmentDate')?.value == '' || this.Appointmentform.get('AppointmentDate')?.value == undefined || this.Appointmentform.get('AppointmentDate')?.value == null) {
    this.ErrorMsg["AppointmentDate"] = 'Appointment Date is required!';
    errorcode = 1;
  }
    const selectedDate = new Date(this.Appointmentform.get('AppointmentDate')?.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) 
      {
      this.ErrorMsg['AppointmentDate'] = 'Please select today or a future date.';
       errorcode = 1;
    }

  if (this.Appointmentform.get('patient')?.value == '' || this.Appointmentform.get('patient')?.value == undefined || this.Appointmentform.get('patient')?.value == null) {
    this.ErrorMsg["patient"] = 'Patient is required!';
    errorcode = 1;
  }

  if (this.Appointmentform.get('status')?.value == '' || this.Appointmentform.get('status')?.value == undefined || this.Appointmentform.get('status')?.value == null) {
    this.ErrorMsg["status"] = 'Status is required!';
    errorcode = 1;
  }

  if (this.Appointmentform.get('slot')?.value == '' || this.Appointmentform.get('slot')?.value == undefined || this.Appointmentform.get('slot')?.value == null) {
    this.ErrorMsg["slot"] = 'Slot selection is required!';
    errorcode = 1;
  }
 

  return errorcode ;
}

  minDate: string = new Date().toISOString().split('T')[0];


 GetAvailableSlots()
  {
    const date = this.Appointmentform.get('AppointmentDate')?.value;
    const DoctorId = this.Appointmentform.get('doctor')?.value;
    const ServiceId =    this.Appointmentform.get('service')?.value


  try {
    this.hospservice.GetAvailableSlots ( DoctorId ,ServiceId,date ).subscribe({
      next: (response: any) => {
        if (response.status == 200) 
          {
          
          
        }
          
      },
      error: (error: any) => {
        if (error.status ==401) {
          this.router.navigate(['/login']);
        } else {
          console.error('Error saving service:', error);
         }
      }
    });
  } catch (error: any) {
    console.error('Exception:', error);
   }
  }


SubmitAppointment()
{ 
 let doctor = this.Appointmentform.get('doctor')?.value;
//let service = this.Appointmentform.get('service')?.value;

let service = '50,51'

let appointmentDate = this.Appointmentform.get('AppointmentDate')?.value;
let patient = this.Appointmentform.get('patient')?.value;
let status = this.Appointmentform.get('status')?.value;
let slot = this.selectedSlot.startTime +'-'+this.selectedSlot.endTime;
let flag = 'I';
let appointmentId 
debugger
  if(this.validateAppointmentForm() == 0)
  {
     
    try {
    this.hospservice.SubmitAppointment(doctor,service.toString(),appointmentDate,patient,status,slot,flag,appointmentId).subscribe({
      next: (response: any) => {
        if (response.status == 200) 
          {         
          
        }          
      },
      error: (error: any) => 
        {
        if (error.status ==401) {
          this.router.navigate(['/login']);
        } else {
          console.error('Error saving service:', error);
         }
      }
    });
  } catch (error: any) {
    console.error('Exception:', error);
   }
  }

}






}




