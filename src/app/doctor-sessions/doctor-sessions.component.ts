import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { DoctorServiceService } from '../doctor-service.service';
import { Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { json } from 'stream/consumers';
import { findIndex } from 'rxjs';
import { Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

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
  filteredDoctors: Observable<any[]> = of([]);
  selectedDoctor: any = null;

  doctorSessions: any = {}
  daysOfTheWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  selectedDays: number[] = [];

  hours = Array.from({ length: 24 }, (_, i) => i); // 0 - 23
  minutes = Array.from({ length: 12 }, (_, i) => i * 5);

  constructor(private doctorservice: DoctorServiceService, private router: Router, private fb: FormBuilder) {
    this.sessionForm = this.fb.group({
      doctorId: [null, [Validators.required, this.validateDoctorSelection.bind(this)]],
      slotDuration: [30, Validators.required],
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

  onDoctorSelected(event: any): void {
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

  displayFn(doctorId: string): string 
  {
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

  onDaySelect(event: any): void {
    const value = parseInt(event.target.value, 10);
    if (event.target.checked) {
      if (!this.selectedDays.includes(value)) this.selectedDays.push(value);
    }
    else {
      this.selectedDays = this.selectedDays.filter(d => d !== value);


    }
  }

  submitForm(): void {
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
      flag: 'I'
    };

    console.log('Final Payload:', JSON.stringify(payload));

    try {
      // Send formData to the backend API
      const response = this.doctorservice.DoctorSessions(payload).subscribe({
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



  getAvailableStartHours(i: number, request: string): number[] {
    if (request === 'Start') {
      if (i === 0) {
        return this.hours;
      }

      // Get the previous session's end hour
      const prevSession = this.sessions.at(i - 1);
      const prevEndHour = prevSession.get('endHour')?.value;

      // If previous session ends at 23, return empty array
      if (prevEndHour >= 23) {
        return [];
      }

      // Return only hours that are after the previous session's end hour
      return this.hours.filter(hour => hour > prevEndHour);
    }

    if (request === 'End') {
      const currentSession = this.sessions.at(i);
      const startHour = currentSession.get('startHour')?.value;
      if (i == 0) {
        return this.hours.filter(hour => hour >= startHour);
      }

      // If no start hour is selected or no hours are available after start hour
      if (!startHour || startHour >= 23) {
        return [];
      }

      // Check if this is the last session and if previous session ends at 23
      if (i > 0) {
        const prevSession = this.sessions.at(i - 1);
        const prevEndHour = prevSession.get('endHour')?.value;
        if (prevEndHour >= 23) {
          return [];
        }
      }

      return this.hours.filter(hour => hour >= startHour);
    }

    return this.hours;
  }

  // Add a new method to get available minutes
  getAvailableMinutes(i: number, request: string): number[] {
    const currentSession = this.sessions.at(i);
    const startHour = currentSession.get('startHour')?.value;
    const endHour = currentSession.get('endHour')?.value;
    const startMinute = currentSession.get('startMinute')?.value;

    // If no hours are available, return empty array for minutes
    if (request === 'Start' && i > 0) {
      const prevSession = this.sessions.at(i - 1);
      const prevEndHour = prevSession.get('endHour')?.value;
      if (prevEndHour >= 23) {
        return [];
      }
    }

    if (request === 'End') {
      if (i == 0) {
        return this.minutes;
      }
      // If start hour is not selected or is 23, return empty array
      if (!startHour || startHour >= 23) {
        return [];
      }

      // Check if this is the last session and if previous session ends at 23
      if (i > 0) {
        const prevSession = this.sessions.at(i - 1);
        const prevEndHour = prevSession.get('endHour')?.value;
        if (prevEndHour >= 23) {
          return [];
        }
      }

      // If start hour equals end hour, only show minutes after start minute
      if (startHour === endHour) {
        return this.minutes.filter(minute => minute > startMinute);
      }
    }

    return this.minutes;
  }

  updateSessionTimings(i: number): void {
    const session = this.sessions.at(i);
    const slotDuration = this.sessionForm.get('slotDuration')?.value || 30;

    // Update current session's end time based on start time and slot duration
    const startHour = +session.get('startHour')?.value;
    const startMinute = +session.get('startMinute')?.value;

    const startTime = new Date(0, 0, 0, startHour, startMinute);
    const endTime = new Date(startTime.getTime() + slotDuration * 60000);

    session.patchValue({
      endHour: endTime.getHours(),
      endMinute: endTime.getMinutes()
    });

    // Update subsequent sessions
    for (let j = i + 1; j < this.sessions.length; j++) {
      const nextSession = this.sessions.at(j);
      const prevSession = this.sessions.at(j - 1);

      // Set start time to be 1 minute after previous session's end time
      const prevEndHour = prevSession.get('endHour')?.value;
      const prevEndMinute = prevSession.get('endMinute')?.value;

      nextSession.patchValue({
        startHour: prevEndHour,
        startMinute: prevEndMinute
      });

      // Update end time based on new start time
      const newStartTime = new Date(0, 0, 0, prevEndHour, prevEndMinute);
      const newEndTime = new Date(newStartTime.getTime() + slotDuration * 60000);

      nextSession.patchValue({
        endHour: newEndTime.getHours(),
        endMinute: newEndTime.getMinutes()
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