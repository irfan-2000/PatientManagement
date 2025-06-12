import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-edit-patient',
  standalone: false,
  templateUrl: './add-edit-patient.component.html',
  styleUrl: './add-edit-patient.component.css'
})
export class AddEditPatientComponent {
  patientId: string = '';
  
  constructor(private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      this.patientId = params['patientId'];
      console.log("Patient ID: ",this.patientId);
    });
  }
}
