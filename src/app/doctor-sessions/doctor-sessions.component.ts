import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { DoctorServiceService } from '../doctor-service.service';
import { Router } from '@angular/router';
import { Form, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { json } from 'stream/consumers';
import { findIndex } from 'rxjs';
import { Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { connect } from 'net';

@Component({
  selector: 'app-doctor-sessions',
  standalone: false,
  templateUrl: './doctor-sessions.component.html',
  styleUrl: './doctor-sessions.component.css'
})
export class DoctorSessionsComponent implements OnInit {
  @ViewChild('doctorInput') doctorInput!: ElementRef;

  sessionForm!: FormGroup;
  showAdddEditSessionPopup = false;
  doctors: any[] = [];
  filteredDoctors: any = Observable<any[]> //= of([]);
  selectedDoctor: any = null;

  doctorSessions: any = {}
  daysOfTheWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  selectedDays: number[] = [];

  hours = Array.from({ length: 24 }, (_, i) => i); // 0 - 23
  minutes = Array.from({ length: 12 }, (_, i) => i * 5);

  constructor(private doctorservice: DoctorServiceService, private router: Router, private fb: FormBuilder, private toastr: ToastrService) {
    this.sessionForm = this.fb.group({
      doctorId: [null, [Validators.required, this.validateDoctorSelection.bind(this)]],
      slotDuration: [{value:30,  disabled:true }],
      sessions: this.fb.array([])
    });

    this.sessionForm.get('slotDuration')?.valueChanges.subscribe(() => {
      this.updateSessionTimings();
    });

    this.addSession();

  }

  // Modal related things
  showModal = false;
  currentDoctorToDelete:any
  openModal(doctor:any) {
    this.showModal = true;
    this.currentDoctorToDelete = doctor;
    console.log("reh doc", doctor)
  }

  closeModal(result: boolean) {
    this.showModal = false;
    console.log('User chose:', result);
    // true = delete, false = cancel
    if(result){
      this.DeleteDoctorSession(this.currentDoctorToDelete);
    }
    this.currentDoctorToDelete = null
  }

  ngOnInit() {
    this.GetAllDoctors();
    this.GetDoctorSessions();

    // Initialize filtered doctors
    this.filteredDoctors = this.sessionForm.get('doctorId')!.valueChanges.pipe(
      startWith(''),
      map(value => {
        console.log("Filter value:", value);
        if (typeof value === 'string') {
          return this._filterDoctors(value);
        }
        return this.doctors;
      })
    );
  }

  onDoctorSelected(event: any): void
   {
    console.log("Selection event:", event);
    const doctorId = event.option.value;
    this.selectedDoctor = this.doctors.find(d => d.doctorId === doctorId);
    this.sessionForm.get('doctorId')?.setValue(doctorId);
  }

  validateDoctorSelection(control: any) {
    const value = control.value;
    if (!value) return null;
    const isValid = this.doctors.some(doctor => doctor.doctorId === value);
    return isValid ? null : { invalidSelection: true };
  }

  private _filterDoctors(value: string): any[] {
    if (!value) return this.doctors;
    const filterValue = value.toLowerCase().trim();
    // Replace hyphens with spaces for searching
    const searchTerms = filterValue.replace(/-/g, ' ').split(' ').filter(term => term.length > 0);

    return this.doctors.filter(doctor => {
      const doctorString = `${doctor.doctorId} ${doctor.firstName} ${doctor.lName} ${doctor.email}`.toLowerCase();
      return searchTerms.every(term => doctorString.includes(term));
    });
  }



  displayFn = (doctorId: string) => {

    console.log("DisplayFn called with:", doctorId, this.doctors);
    if (!doctorId || !this.doctors) return '';
    const doctor = this.doctors.find(d => {
      console.log("reh doc", d);
      return d.doctorId == doctorId
    });
    console.log("Found doctor:", doctor);
    if (doctor) {
      console.log("Returning formatted string");
      return `${doctor.doctorId} - ${doctor.firstName} ${doctor.lName} - ${doctor.email}`;
    }
    return '';
  }

  openAddEditSession() {
    this.showAdddEditSessionPopup = true;
  }

  closeAddEditSession(): void {
    this.showAdddEditSessionPopup = false;
    this.sessionForm.reset();
    this.sessions.clear();
    this.selectedDays = [];
    this.addSession();
    this.IsEditing= false;
  }

  get sessions(): FormArray {
    return this.sessionForm.get('sessions') as FormArray;
  }

  // addSession(): void {
  //   const slotDuration = +this.sessionForm.get('slotDuration')?.value || 30;

  //   // Force update of all previous sessions to ensure end times are correct
  //   this.updateSessionTimings();

  //   let startHour = 0;
  //   let startMinute = 0;

  //   if (this.sessions.length > 0) {
  //     const prev = this.sessions.at(this.sessions.length - 1);
  //     startHour = +prev.get('endHour')?.value;
  //     startMinute = +prev.get('endMinute')?.value;
  //   }

  //   const sessionGroup = this.fb.group({
  //     startHour: [startHour, Validators.required],
  //     startMinute: [startMinute, Validators.required],
  //     endHour: [0, Validators.required],
  //     endMinute: [0, Validators.required]
  //   });

  //   // Add reactive update listeners
  //   sessionGroup.get('startHour')?.valueChanges.subscribe(() => {
  //     const idx = this.sessions.length - 1;
  //     this.updateSessionTimings(idx);
  //   });
  //   sessionGroup.get('startMinute')?.valueChanges.subscribe(() => {
  //     const idx = this.sessions.length - 1;
  //     this.updateSessionTimings(idx);
  //   });
  // setTimeout(() => {
  //   this.sessions.push(sessionGroup);
  //   this.updateSessionTimings(this.sessions.length - 1);
  // }, 1);

  // }
  addSession(): void {
    let startHour = 9;
    let startMinute = 0;

  if (this.sessions.length > 0) 
    {
      const last = this.sessions.at(this.sessions.length - 1);
      startHour = +last.get('endHour')?.value || 0;
      startMinute = +last.get('endMinute')?.value || 0;
    }

    const sessionGroup = this.fb.group({
      startHour: [startHour, Validators.required],
      startMinute: [startMinute, Validators.required],
      endHour: [startHour + 1 <= 23 ? startHour + 1 : 23, Validators.required],
      endMinute: [startMinute, Validators.required]
    });


    sessionGroup.get('endHour')?.valueChanges.subscribe(() => this.syncNextSessions());
    sessionGroup.get('endMinute')?.valueChanges.subscribe(() => this.syncNextSessions());





  this.sessions.push(sessionGroup);
}
syncNextSessions(): void
 {
    const sessions = this.sessions;
  for (let i = 1; i < sessions.length; i++) 
    {
      const prev = sessions.at(i - 1);
      const current = sessions.at(i);

      const prevEndHour = +prev.get('endHour')?.value;
      const prevEndMinute = +prev.get('endMinute')?.value;

    current.patchValue({
      startHour: prevEndHour,
      startMinute: prevEndMinute
    }, { emitEvent: false });
  }
}
formatTime(hour: number, minute: number): string {
  const h = hour % 12 || 12;
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const m = minute.toString().padStart(2, '0');
  return `${h}:${m} ${ampm}`;
}



 

  removeSession(index: number): void {
    this.sessions.removeAt(index);
    for (let i = index; i < this.sessions.length; i++) {
      this.updateSessionTimings(i);
    }
  }


  toggleAllDays(event: any): void {
    if (event.target.checked) {
      this.selectedDays = [1, 2, 3, 4, 5, 6, 7];
    } else {
      this.selectedDays = [];
    }
  }

  onDaySelect(event: any): void
   {
    const value = parseInt(event.target.value, 10);
    if (event.target.checked) {
      if (!this.selectedDays.includes(value)) this.selectedDays.push(value);
    }
    else {
      this.selectedDays = this.selectedDays.filter(d => d !== value);


    }
  }

  submitForm(): void 
  {
    this.ValidSesion()
    if (this.sessionForm.invalid || this.selectedDays.length === 0)
       {
      alert("Please fill all required fields and select days.");
      return;
    }

    const formValue = this.sessionForm.value;
    const sessionsFormatted = formValue.sessions.map((s: any, index: number) => 
      {
      const start = `${s.startHour.toString().padStart(2, '0')}:${s.startMinute.toString().padStart(2, '0')}`;
      const end = `${s.endHour.toString().padStart(2, '0')}:${s.endMinute.toString().padStart(2, '0')}`;
      return {
        sessionName: `${index + 1}`,
        starttime: `${start}`,
        endtime: `${end}`
      };
    });

    const payload = {
      doctorId: formValue.doctorId,
      timeSlot: formValue.slotDuration,
      days: this.selectedDays,
      sessions: sessionsFormatted,
      flag: 'I',
            IsEditing:this.IsEditing 
      //OldPayload : this.OldPayload

    };

    const OldPayload =
    {
      OldPayload : this.OldPayload
    }


    try {
       const response = this.doctorservice.DoctorSessions(payload ,OldPayload).subscribe({
        next: (response: any) => {
          console.log(response);
          if (response.status == 200)
             {
            this.showToast('success', 'Your session was successfully added!', '');
            this.closeAddEditSession();
            this.GetDoctorSessions();

          } else if (response.status == 403) 
            {
            this.showToast('error', 'Session overlap', '');
          }else if (response.status == 500 ) 
            {
            this.showToast('error', 'Internal server error', '');
          }
        },
        error: (error: any) => 
          {
          console.error('Error:', error);
        }


      });


    } catch (error: any) {
      console.error('Error:', error);
      //  this.ErrorMsg = "An error occurred while submitting the form.";
    }
  }

 DeleteDoctorSession(item:any)
{
  //  this.EditSession(item) ; 
    const formValue = this.sessionForm.value;
    const sessionsFormatted = formValue.sessions.map((s: any, index: number) => {
      const start = `${s.startHour.toString().padStart(2, '0')}:${s.startMinute.toString().padStart(2, '0')}`;
      const end = `${s.endHour.toString().padStart(2, '0')}:${s.endMinute.toString().padStart(2, '0')}`;
      return {
        sessionName: `${index + 1}`,
        starttime: `${start}`,
        endtime: `${end}`
      };
    });


    const payload = {
      doctorId: formValue.doctorId,
      timeSlot: formValue.slotDuration,
      days: this.selectedDays,
      sessions: sessionsFormatted,
      flag: 'I'
      //OldPayload:this.OldPayload || null
    };

    console.log('Final Payload for Delete:', JSON.stringify(payload));



    try {
      // Send formData to the backend API
      const response = this.doctorservice.DeleteDoctorSessions(payload ).subscribe({
        next: (response: any) => {
          console.log(response);
          if (response.status == 200) 
            {
            this.showToast('success', 'Your session has been deleted!', '');
                this,this.GetDoctorSessions();
              
       
          } else if (response.status == 500)
             {
            this.showToast('error', 'Internal server error', '');
            }
        },
        error: (error: any) => {
          console.error('Error:', error);
        }


      });


    } catch (error: any) {
      console.error('Error:', error);
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


getAvailableStartHours(i: number): number[] 
{
   
  if (i === 0) return this.hours;

    const prev = this.sessions.at(i - 1);
    const prevEndHour = +prev.get('endHour')?.value;
    const prevEndMinute = +prev.get('endMinute')?.value;

    this.syncNextSessions();
    return this.hours.filter(h => h > prevEndHour || (h === prevEndHour));
  }


getAvailableStartMinutes(i: number): number[]
 {
    if (i === 0) return this.minutes;

    const prev = this.sessions.at(i - 1);
    const prevEndHour = +prev.get('endHour')?.value;
    const prevEndMinute = +prev.get('endMinute')?.value;

    const current = this.sessions.at(i);
    const selectedHour = +current.get('startHour')?.value;

    if (selectedHour > prevEndHour) return this.minutes;
    return this.minutes.filter(m => m >= prevEndMinute);
  }

getAvailableEndHours(i: number): number[]
 {
    const session = this.sessions.at(i);
    const startHour = +session.get('startHour')?.value;
    const startMinute = +session.get('startMinute')?.value;
  if (isNaN(startHour) || isNaN(startMinute))
    {
      return [];
    }

    return this.hours.filter(h => h > startHour || (h === startHour));
  }

getAvailableEndMinutes(i: number): number[] 
{
    const session = this.sessions.at(i);
    const startHour = +session.get('startHour')?.value;
    const startMinute = +session.get('startMinute')?.value;
    const endHour = +session.get('endHour')?.value;

    if (isNaN(startHour) || isNaN(startMinute) || isNaN(endHour)) return [];

    if (endHour === startHour) {
      return this.minutes.filter(m => m > startMinute);
    }
    return this.minutes;
  }


ErrorMesage:any ;
ErrorSessionNumber:any;
ValidSesion()
{

    const formValue = this.sessionForm.value;
    const sessionsFormatted = formValue.sessions.map((s: any, index: number) => 
      {

      const startHour = `${s.startHour.toString().padStart(2, '0')}:${s.startMinute.toString().padStart(2, '0')}`;
      const endHour = `${s.endHour.toString().padStart(2, '0')}:${s.endMinute.toString().padStart(2, '0')}`;



        if( s.endHour < s.startHour)
        {
            this.ErrorMesage = ` Invalid Session at session${index + 1 } End hour is greater an start hour `
        this.ErrorSessionNumber = +index;
        return;
      }


    });


  }



updateSessionTimings(i: number = 0): void 
{
    const slot = +this.sessionForm.get('slotDuration')?.value || 30;

    for (let j = i; j < this.sessions.length; j++) {
      const session = this.sessions.at(j);
      let sh = 0;
      let sm = 0;

      if (j === 0) {
        sh = +session.get('startHour')?.value || 0;
        sm = +session.get('startMinute')?.value || 0;
      } else {
        const prev = this.sessions.at(j - 1);
        sh = +prev.get('endHour')?.value;
        sm = +prev.get('endMinute')?.value;

        session.patchValue({
          startHour: sh,
          startMinute: sm
        }, { emitEvent: false });
      }

      const st = new Date(0, 0, 0, sh, sm);
      const et = new Date(st.getTime() + slot * 60000);

      session.patchValue({
        endHour: et.getHours(),
        endMinute: et.getMinutes()
      }, { emitEvent: false });
    }
  }




  async GetAllDoctors() {
    try {
      const response = await this.doctorservice.GetAllDoctors();
      console.log(response);

      if (response?.status === 200) {
        this.doctors = response.doctorsData || [];
        console.log("After assigning", this.doctors);

        this.filteredDoctors = this.sessionForm.get('doctorId')!.valueChanges.pipe(
          startWith(''),
          map(value => {
            if (typeof value === 'string') {
              return this._filterDoctors(value);
            }
            return this.doctors;
          })
        );


      }
      if (response.status == 401) {
        this.router.navigate(['/login']);
        return;
      }
    } catch (error: any) {
      if (error.status === 401 || error?.error?.status === 401) {
        this.router.navigate(['/login']);
        return;
      }
    }
  }



  GetDoctorSessions() {

    try {
      this.doctorservice.GetDoctorSessions().subscribe({
        next: (response: any) => {
          if (response.status === 200) {
            this.doctorSessions = response.data.getDocotorSessionsClubedByDays;


          }
        },
        error: (error: any) => {

          console.log(error);
          if (error.status === 401) {
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


  OldPayload: any = {}
IsEditing:boolean = false;
  EditSession(item: any) 
  {
    this.showToast('warning', 'Editing session', '');
    this.IsEditing = true;
    this.OldPayload =  (item) ;

    this.sessionForm.patchValue({
    slotDuration:Number(item.timeSlot),
    doctorId:item.doctorId
    });


    this.selectedDays = item.dayId;

    this.selectedDays = (typeof item.dayId === 'string') ? item.dayId.split(',').map(Number) : Array.isArray(item.dayId) ? item.dayId   : [];


    this.sessions.clear();
  if (item.startTime && item.endTime)
     {
      const [startHour, startMinute] = item.startTime.split(':').map(Number);
      const [endHour, endMinute] = item.endTime.split(':').map(Number);

      this.sessions.push(this.fb.group({
        startHour: [startHour, Validators.required],
        startMinute: [startMinute, Validators.required],
        endHour: [endHour, Validators.required],
        endMinute: [endMinute, Validators.required]
      }));
    } else {
      // fallback: add a blank session if data is missing
      this.addSession();
    }


    this.openAddEditSession();



  }

}
