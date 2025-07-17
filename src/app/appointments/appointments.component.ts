import { Component } from '@angular/core';
import { convertTo12HourFormat, formatDate, formatTime } from './../utils/helpers'; // Adjust path accordingly
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
    patient: '',
    status: '',
    doctorName: '',
  };

  patientFilters = [
    'patient one',
    'New Patient'
  ]
  statusFilters = [
    'Booked',
    'Upcoming',
    'Completed (Check out)',
    'Cancelled',
    'Check-in',
    'Pending'
  ]
  availablePaymentModes = [
    "UPI",
    "Cash",
    "Manual"
  ]

  selectServicesArray:any[]= [ ]
  SelectedServiceId :any [] = [50,51];

  onserviceChanged(services:any)
  {
    this.serviceDetail.length = 0; //emptying the current array
    services.map((serv:any)=>{
      const servDetail = this.selectServicesArray.find(item=>item.serviceId == serv);
      if(!servDetail || !Object.keys(servDetail).length){
        console.error("One or more of the services selected are not found")
      }
      const formattedServ = {
        service: servDetail?.name,
        charge: servDetail?.charges?.split('.')[0]
      }
      this.serviceDetail.push(formattedServ)
    })

     this.GetAvailableSlots();
  }

timeSlots  :any[] = []
  selectedSlot:any;
  serviceDetail:any = []
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

  // Helper getters for cleaner template
  get selectedDoctorId(): string[] {
    const val = this.Appointmentform.get('doctor')?.value;
    return val ? [val] : [];
  }

  get selectedPatientId(): string[] {
    const val = this.Appointmentform.get('patient')?.value;
    return val ? [val] : [];
  }

  // Handlers for multiselect single selection
  onDoctorSelectionChange(selected: string[]) {
    this.Appointmentform.get('doctor')?.setValue(selected[0] || '');
    this.GetAvailableSlots();
  }

  onPatientSelectionChange(selected: string[]) {
    this.Appointmentform.get('patient')?.setValue(selected[0] || '');
  }

  constructor(private doctorservice:DoctorServiceService, private hospservice:HospitalServiceService,
private fb: FormBuilder, private toastr: ToastrService,private router: Router,private PatientService:PatientService)
{
this.GetAllDoctors();
 this.GetServices();
 this.GetPatientDetails();
 this.GetAppointments();
this.Appointmentform = new FormGroup({
  doctor: new FormControl('', Validators.required),
  service: new FormControl('', Validators.required), // <-- fixed
  AppointmentDate: new FormControl('', Validators.required), // <-- fixed
  patient: new FormControl('', Validators.required),
  status: new FormControl('', Validators.required),
  slot: new FormControl('', Validators.required),
  paymentMode: new FormControl('', Validators.required)
 }); 

 this.Appointmentform.get('paymentMode')?.disable()
}

  changeChipFilter(filter: any) {
    console.log('Chip Filter set to: ', filter);
    //make an api call or whatever
    this.selectedChipFilter = filter;
  }

  setSelectedSlot(slot:any){
    console.log("Selected Slot: ", slot);
     
    this.Appointmentform.get('slot')?.setValue(slot); // Manually set value
      this.selectedSlot = slot
     console.log("Selected Slot: ",  this.Appointmentform.get('slot')?.value);
  }

  Allappointments:any = [];
  appointments:any = [];
  

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
  submitAddAppointmentForm(){
    console.log("Submit Add appointment")
  }
     
  async GetAllDoctors() {

    try {
      const response = await this.doctorservice.GetAllDoctors();
      console.log(response);

      if (response?.status === 200) {

        this.doctors = response.doctorsData.filter((item:any)=>item.status == "1");
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
          
         
            this.selectServicesArray = response.result.filter((item:any)=>item.status == "1");

               
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

  if (this.Appointmentform.get('doctor')?.value == '' || this.Appointmentform.get('doctor')?.value == undefined || this.Appointmentform.get('doctor')?.value == null) 
    {
    this.ErrorMsg["doctor"] = 'Doctor is required!';
    errorcode = 1;
  }

  // if (this.Appointmentform.get('service')?.value == '' || this.Appointmentform.get('service')?.value == undefined || this.Appointmentform.get('service')?.value == null) {
  //   this.ErrorMsg["service"] = 'Service is required!';
  //   errorcode = 1;
  // }

 if (this.selectServicesArray.length == 0 || this.selectServicesArray.length<0) {
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
 
  // if (this.Appointmentform.get('paymentMode')?.value == '' || this.Appointmentform.get('paymentMode')?.value == undefined || this.Appointmentform.get('paymentMode')?.value == null) {
  //   this.ErrorMsg["paymentMode"] = 'Payment Mode is required!';
  //   errorcode = 1;
  // }

  return errorcode ;
}

  minDate: string = new Date().toISOString().split('T')[0];


 GetAvailableSlots()
  {
    this.ErrorMsg= {}
    const selectedDate = new Date(this.Appointmentform.get('AppointmentDate')?.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) 
      {
      this.ErrorMsg['AppointmentDate'] = 'Please select today or a future date.';
        return;
    }

     
    const date = this.Appointmentform.get('AppointmentDate')?.value;
    const DoctorId = this.Appointmentform.get('doctor')?.value;
    const ServiceId =    this.Appointmentform.get('service')?.value

      if(date  == "" || date == null ||date == 'undefined')
      {
        return;
      }
      if(DoctorId == "" || DoctorId == null || DoctorId == "undefined")
      {
        return;
      }

      if(this.SelectedServiceId.length <=0)
      {
        return;
      }

 
  try {
    this.hospservice.GetAvailableSlots ( DoctorId ,this.SelectedServiceId,date ).subscribe({
      next: (response: any) => {
        if (response.status == 200) 
          {
          this.timeSlots = response.result;
         
         
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

GetAppointments(){
  try {
    this.hospservice.GetAppointments( ).subscribe({
      next: (response: any) => {
        if (response.status == 200) 
          {
            this.Allappointments = response.data;
            this.appointments = response.data; // Initialize filtered array
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

showToast(type: 'success' | 'error' | 'warning' | 'info', message: string, title: string) {
  switch (type) {
    case 'success':
      this.toastr.success(message, title);
      break;
    case 'error':
      this.toastr.error(message, title);
      break;
    case 'warning':
      this.toastr.warning(message, title);
      break;
    case 'info':
      this.toastr.info(message, title);
      break;
    default:
      console.error('Invalid toast type');
  }
}

disableSaveButton:boolean = false;

SubmitAppointment()
{ 
 let doctor = this.Appointmentform.get('doctor')?.value;
//let service = this.Appointmentform.get('service')?.value;

let service = '50,51'


 
  if(this.validateAppointmentForm() == 0)
  {
     let appointmentDate = this.Appointmentform.get('AppointmentDate')?.value;
let patient = this.Appointmentform.get('patient')?.value;
let status = this.Appointmentform.get('status')?.value;
let slot = this.selectedSlot.startTime +'-'+this.selectedSlot.endTime;
let paymentMode = this.Appointmentform.get('paymentMode')?.value
let flag = 'I';
let appointmentId 
this.disableSaveButton = true
    try {
    this.hospservice.SubmitAppointment(doctor,service.toString(),appointmentDate,patient,status,slot,flag,appointmentId, paymentMode).subscribe({
      next: (response: any) => {
        if (response.status == 200) 
          {         
            this.showAddAppointmentForm = false;
            this.Appointmentform.reset()
            this.showToast('success','Appointment created','');
            this.GetAppointments()
        }          
      },
      error: (error: any) => 
        {
    this.disableSaveButton = false
        if (error.status ==401) {
          this.router.navigate(['/login']);
        } else {
          console.error('Error saving service:', error);
         }
      }
    });
  } catch (error: any) {
    console.error('Exception:', error);
    this.disableSaveButton = false
   }
  }

}



convertTo12HourFormat(time24: string): string {
  const [hourStr, minuteStr] = time24.split(':');
  let hour = parseInt(hourStr, 10);
  let minute = parseInt(minuteStr, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';

  hour = hour % 12;
  hour = hour === 0 ? 12 : hour;

  const paddedHour = hour < 10 ? '0' + hour : hour.toString();
  const paddedMinute = minute < 10 ? '0' + minute : minute.toString();

  return `${paddedHour}:${paddedMinute} ${ampm}`;
}

SearchFilter(keyword: string) 
{
  keyword = keyword?.toLowerCase().trim();

  return this.Allappointments.filter((item: any) => {
    return (
      item.doctorId?.toLowerCase().includes(keyword) ||
      item.doctorName?.toLowerCase().includes(keyword) ||
      item.patientName?.toLowerCase().includes(keyword) ||
      item.gender?.toLowerCase().includes(keyword) ||
      item.status?.toLowerCase().includes(keyword)
    );
  });
}


  DeleteAppointment(slotId:any, apptId:any) {

    const confirmDelete = confirm("Are you sure to delete the appointment.")
    if(!confirmDelete) return;

    try {
      // Send formData to the backend API
      const response = this.hospservice.DeleteAppointment(slotId, apptId, 'Delete').subscribe({
        next: (response: any) => {
          console.log(response);
          if (response.status == 200 && response.data) {
            this.showToast('success','Appointment Deleted','')
            this.GetAppointments();
           
          } else if (response.status == 500) {
            this.showToast('error', 'Internal server error', '');
          }
        },
        error: (error: any) => {
          console.error('Error:', error);
          if (error.status == 401) {
            this.router.navigate(['/login'])
          }
        }


      });


    } catch (error: any) {
      console.error('Error:', error);
    }
  }

  UpdateAppointmentStatus(apptStatus:any, apptId:any) {
    const status = apptStatus?.target?.value;
    if(!status){
      console.error("Appointment status not found")
      return
    }
    
    try {
      // Send formData to the backend API
      const response = this.hospservice.UpdateAppointmentStatus(status, apptId, 'UpdateStatus').subscribe({
        next: (response: any) => {
          console.log(response);
          if (response.status == 200) {
            this.showToast('success','Appointment Status Updated','')
            this.GetAppointments()
           
          } else if (response.status == 500) {
            this.showToast('error', 'Internal server error', '');
          }
        },
        error: (error: any) => {
          console.error('Error:', error);
          if (error.status == 401) {
            this.router.navigate(['/login'])
          }
        }


      });


    } catch (error: any) {
      console.error('Error:', error);
    }
  }

clearFilters(){
  this.filters = {
    date: '',
    patient: '',
    status: '',
    doctorName: '',
  };
  this.applyFilters();
}

  applyFilters(){
    console.log("reh filters", this.filters)
    function toDDMMYYYY(dateStr: string): string {
      if (!dateStr) return '';
      const [yyyy, mm, dd] = dateStr.split('-');
      return `${dd}-${mm}-${yyyy}`;
    }

    this.appointments = this.Allappointments.filter((appt:any)=>{
      const matchDate = !this.filters.date || (
        appt.appointmentDate &&
        toDDMMYYYY(this.filters.date) === appt.appointmentDate.split(' ')[0]
      );
      const matchPatient = !this.filters.patient || appt.patientName === this.filters.patient;
      const matchStatus = !this.filters.status || appt.status === this.filters.status;
      const matchDoctor = !this.filters.doctorName || (appt.firstName + ' ' + appt.lName) === this.filters.doctorName;
      return matchDate && matchPatient && matchStatus && matchDoctor;
    })
  }

}


