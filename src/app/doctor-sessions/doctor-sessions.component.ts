import { Component } from '@angular/core';

@Component({
  selector: 'app-doctor-sessions',
  standalone: false,
  templateUrl: './doctor-sessions.component.html',
  styleUrl: './doctor-sessions.component.css'
})
export class DoctorSessionsComponent {

  daysOfTheWeek = ['', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'];
  sessions: any[] = [];
  hours = Array.from({ length: 24 }, (_, i) => i);       // [0..23]
  minutes = Array.from({ length: 11 }, (_, i) => (i + 1) * 5); // [5, 10, ..., 55]
  showAdddEditSessionPopup = false;

  openAddEditSession() {
    this.showAdddEditSessionPopup = true;
  }

  closeAddEditSession() {
    this.showAdddEditSessionPopup = false;
    this.sessions = [];
  }

  addSession() {
    this.sessions.push({
      start: null,
      end: null
    });
  }

  removeSession(index: number) {
    this.sessions.splice(index, 1);
  }

  submitForm() {
    console.log(this.sessions);
    const sessionNameAdded = this.sessions.map((session, index) => {
      return {
        ...session,
        sessionName: `session ${index + 1}`,
      }
    });
    console.log(sessionNameAdded);
  }


  doctorSessions: any = [
    {
      id: 1,
      doctorName: 'Dr. John Doe',
      clinicName: 'Clinic 1',
      days: [1, 2, 3, 4, 5, 6, 7],
      timeSlot: 30,
      sessions: [
        {
          sessionName: "session 1",
          sessionTime: "10:00 AM - 11:00 AM"
        },
        {
          sessionName: "session 2",
          sessionTime: "11:00 AM - 12:00 PM"
        },
      ]
    },
    {
      id: 2,
      doctorName: 'Dr. Jane Doe',
      clinicName: 'Clinic 2',
      days: [1, 2, 3, 4, 5],
      timeSlot: 30,
      sessions: [{
        sessionName: "session 1",
        sessionTime: "10:00 AM - 11:00 AM"
      },
      {
        sessionName: "session 2",
        sessionTime: "11:00 AM - 12:00 PM"
      },
      ]
    }
  ];

}
