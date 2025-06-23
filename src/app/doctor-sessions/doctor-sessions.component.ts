import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { DoctorServiceService } from '../doctor-service.service';
import { Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { json } from 'stream/consumers';
import { findIndex } from 'rxjs';
import { Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

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
      //this.updateSessionTimings();
    });

    this.addSession();

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



  displayFn = (doctorId: string): string => {

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
  }

  get sessions(): FormArray {
    return this.sessionForm.get('sessions') as FormArray;
  }

  addSession(): void {
    const slotDuration = this.sessionForm.get('slotDuration')?.value || 30;

    // Calculate start time for new session
    let startHour = 0;
    let startMinute = 0;

    if (this.sessions.length > 0) {
      const prevSession = this.sessions.at(this.sessions.length - 1);
      const prevEndHour = prevSession.get('endHour')?.value;
      console.log("reh prevEndHour", prevEndHour);
      // Set start time to be the next hour after previous session's end time
      startHour = +prevEndHour + 1;
      startMinute = 0;

      // Handle case where end hour is 23
      if (startHour > 23) {
        startHour = 0;
      }
    }
    console.log("reh startHour", startHour);

    this.sessions.push(this.fb.group({
      startHour: [startHour, Validators.required],
      startMinute: [startMinute, Validators.required],
      endHour: [0, Validators.required],
      endMinute: [30, Validators.required]
    }));

    // Update timings for the new session
    this.updateSessionTimings(this.sessions.length - 1);
  }

  removeSession(index: number): void {
    this.sessions.removeAt(index);

    // Update timings for all subsequent sessions
    if (index < this.sessions.length) {
      this.updateSessionTimings(index);
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
    if (this.sessionForm.invalid || this.selectedDays.length === 0)
       {
      alert("Please fill all required fields and select days.");
      return; 
      }

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
      flag: 'I',
            IsEditing:this.IsEditing 
      //OldPayload : this.OldPayload
      
     };

     debugger
     const OldPayload =
      {
      OldPayload : this.OldPayload
     }
    
 
    try {
      // Send formData to the backend API
      const response = this.doctorservice.DoctorSessions(payload ,OldPayload).subscribe({
        next: (response: any) => {
          console.log(response);
          if (response.status == 200) {
            //this.showToast('success', 'Add Success!!', 'Add');
            // window.location.reload();
          } else if (response.status === 401) {
            // this.showToast('error', 'Unauthorized access', 'Error');
          }
        },
        error: (error: any) => {
          console.error('Error:', error);
          //this.ErrorMsg = "An error occurred while submitting the form.";
        }


      });


    } catch (error: any) {
      console.error('Error:', error);
      //  this.ErrorMsg = "An error occurred while submitting the form.";
    }
  }

 DeleteDoctorSession(item:any)
{
   this.EditSession(item) ; 
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
      const response = this.doctorservice.DeleteDoctor(payload ).subscribe({
        next: (response: any) => {
          console.log(response);
          if (response.status == 200) 
            {
       
          } else if (response.status === 401) {
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


 // Simplified and corrected session dropdown logic

getAvailableStartHours(i: number, type: string): number[]
 {  if (i === 0) return this.hours;

  const prev = this.sessions.at(i - 1);
  const prevEndHour = +prev.get('endHour')?.value;
  const prevEndMinute = +prev.get('endMinute')?.value;

  if (prevEndHour >= 23 && prevEndMinute >= 59) return [];

   return this.hours.filter(hour => hour > prevEndHour || (hour === prevEndHour && prevEndMinute < 59));

  }


getAvailableMinutes(i: number, type: string): number[] {
  const session = this.sessions.at(i);
  const startHour = session.get('startHour')?.value;
  const endHour = session.get('endHour')?.value;
  const startMinute = session.get('startMinute')?.value;

  if (type === 'End' && startHour === endHour) {
    return this.minutes.filter(m => m > startMinute);
  }
  return this.minutes;
}

updateSessionTimings(i: number): void {
  const session = this.sessions.at(i);
  const slot = +this.sessionForm.get('slotDuration')?.value || 30;
  const sh = +session.get('startHour')?.value;
  const sm = +session.get('startMinute')?.value;
  const st = new Date(0, 0, 0, sh, sm);
  const et = new Date(st.getTime() + slot * 60000);

  session.patchValue({
    endHour: et.getHours(),
    endMinute: et.getMinutes(),
  });

  for (let j = i + 1; j < this.sessions.length; j++) {
    const next = this.sessions.at(j);
    const prev = this.sessions.at(j - 1);
    const peh = +prev.get('endHour')?.value;
    const pem = +prev.get('endMinute')?.value;
    const nst = new Date(0, 0, 0, peh, pem);
    const net = new Date(nst.getTime() + slot * 60000);
    next.patchValue({
      startHour: peh,
      startMinute: pem,
      endHour: net.getHours(),
      endMinute: net.getMinutes()
    });
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
     this.selectedDays = (typeof item.dayId === 'string')
  ? item.dayId.split(',').map(Number)
  : Array.isArray(item.dayId)
    ? item.dayId
    : [];


      this.sessions.clear(); 
  if (item.startTime && item.endTime) {
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
