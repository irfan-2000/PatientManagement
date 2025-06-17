import { Component } from '@angular/core';
import { DoctorServiceService } from '../doctor-service.service';
import { Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { json } from 'stream/consumers';

@Component({
  selector: 'app-doctor-sessions',
  standalone: false,
  templateUrl: './doctor-sessions.component.html',
  styleUrl: './doctor-sessions.component.css'
})
export class DoctorSessionsComponent {
  sessionForm!: FormGroup;
  showAdddEditSessionPopup = false;
doctors: any[] = [];

doctorSessions:any = {}
  daysOfTheWeek = ['','Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  selectedDays: number[] = [];

  hours = Array.from({ length: 24 }, (_, i) => i); // 0 - 23
minutes = Array.from({length: 12}, (_, i) => i *5);
   constructor( private doctorservice: DoctorServiceService, private router: Router, private fb: FormBuilder) 
{
  this.GetAllDoctors();
this.GetDoctorSessions();
  this.sessionForm = this.fb.group({
    doctorId: [null, Validators.required],
    slotDuration: [30, Validators.required],
    sessions: this.fb.array([])
  });

this.sessionForm.get('slotDuration')?.valueChanges.subscribe(() => {
    //this.updateSessionTimings();
  });

  this.addSession();
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


 
  ngOnInit(): void {
     
  }
 
 

  get sessions(): FormArray {
    return this.sessionForm.get('sessions') as FormArray;
  }

  addSession(): void 
  {
    let startHour = 0, startMinute = 0;
  if (this.sessions.length > 0) {
    const prev = this.sessions.at(this.sessions.length - 1).value;
    startHour = prev.endHour;
    startMinute = prev.endMinute;
  }
  const slotDuration = this.sessionForm.get('slotDuration')?.value || 30;
  let endHour = startHour;
  let endMinute = startMinute + slotDuration;
  if (endMinute >= 60) {
    endHour += Math.floor(endMinute / 60);
    endMinute = endMinute % 60;
  }
     this.sessions.push(this.fb.group({
      startHour: [0, Validators.required],
      startMinute: [0, Validators.required],
      endHour: [0, Validators.required],
      endMinute: [0, Validators.required]
    }));
  //this.updateSessionTimings(); // Auto-adjust timings

  }

  removeSession(index: number): void 
  {
    debugger

    this.sessions.removeAt(index);
  }

  toggleAllDays(event: any): void
   {
    if (event.target.checked) {
      this.selectedDays = [1,2,3,4,5,6,7];
    } else {
      this.selectedDays = [];
    }
  }

  onDaySelect(event: any): void 
  {
    const value = parseInt(event.target.value, 10);
    if (event.target.checked) {
      if (!this.selectedDays.includes(value)) this.selectedDays.push(value);
    } else {
      this.selectedDays = this.selectedDays.filter(d => d !== value);
    }
  }

  submitForm(): void 
  {
    if (this.sessionForm.invalid || this.selectedDays.length === 0) {
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
debugger
    const payload = {
      doctorId: formValue.doctorId,
      timeSlot: formValue.slotDuration,
      days: this.selectedDays,
      sessions: sessionsFormatted,
      flag:'I'
    };

    console.log('Final Payload:', JSON.stringify(payload));

 try {
        // Send formData to the backend API
        const response = this.doctorservice.DoctorSessions( payload).subscribe({
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


      } catch (error: any) 
      {
        console.error('Error:', error);
      //  this.ErrorMsg = "An error occurred while submitting the form.";
      }

 
  } 

 getAvailableStartHours(i: number): number[] 
 {
  if (i === 0) return this.hours;

  const prevSession = this.sessions.at(i - 1);
  const prevEndHour = +prevSession.get('endHour')?.value;

  const minStartHour = prevEndHour + 1;

  return this.hours.filter(hour => hour >= minStartHour);
}



updateSessionTimings(i: number) {
  const session = this.sessions.at(i);
  const slotDuration = this.sessionForm.get('slotDuration')?.value || 30;

  const startHour = +session.get('startHour')?.value;
  const startMinute = +session.get('startMinute')?.value;

  const startTime = new Date(0, 0, 0, startHour, startMinute);
  const endTime = new Date(startTime.getTime() + slotDuration * 60000);

  // Update current session's end time
  session.patchValue({
    endHour: endTime.getHours(),
    endMinute: endTime.getMinutes()
  });

  // If there's a next session, update its start time to be 1 hour after previous session END
  if (i + 1 < this.sessions.length) {
    const nextSession = this.sessions.at(i + 1);
    const nextStartTime = new Date(endTime.getTime() + 60 * 60000); // Add 1 hour (60 minutes)

    nextSession.patchValue({
      startHour: nextStartTime.getHours(),
      startMinute: nextStartTime.getMinutes()
    });

    const nextEndTime = new Date(nextStartTime.getTime() + slotDuration * 60000);
    nextSession.patchValue({
      endHour: nextEndTime.getHours(),
      endMinute: nextEndTime.getMinutes()
    });
  }
}


  
 async GetAllDoctors()
  {

    try {
      const response = await this.doctorservice.GetAllDoctors();
      console.log(response);

      if (response?.status === 200)
         { 
           
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

  if (error.status === 401 || error?.error?.status === 401)
     {
    this.router.navigate(['/login']);
    return;
  }

  }
  }



 GetDoctorSessions()
 { 

 try {
        this.doctorservice.GetDoctorSessions().subscribe({
          next: (response: any) => {
            if (response.status === 200) 
           {               
             this.doctorSessions =response.data.getDocotorSessionsClubedByDays;

                             
            }
          },
          error: (error: any) => {

            console.log(error);
            if (error.status === 401)
               { 
                this.router.navigate(['/']);

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



}
