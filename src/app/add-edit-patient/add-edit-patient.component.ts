import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientService } from '../patient.service';

@Component({
  selector: 'app-add-edit-patient',
  standalone: false,
  templateUrl: './add-edit-patient.component.html',
  styleUrl: './add-edit-patient.component.css'
})
export class AddEditPatientComponent {
  patientId: string = '';
  title: string = 'Add Patient';
  patientForm: FormGroup;
  bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private PatientService: PatientService, private router: Router) {
    this.patientForm = this.fb.group({
      patientId: [''],
      fullName: ['', Validators.required],
      dob: ['', Validators.required],
      gender: ['', Validators.required],
      bloodGroup: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      height: ['', [Validators.required, Validators.min(50), Validators.max(250)]],
      weight: ['', [Validators.required, Validators.min(10), Validators.max(300)]],
      allergies: this.fb.array([]),
      pastMedicalHistory: this.fb.array([]),
      surgicalHistory: this.fb.array([]),
      doctorAssigned: ['', Validators.required],
      visitDateTime: ['', Validators.required],
      reasonForVisit: [''],
      diagnosis: [''],
      prescribedMedications: this.fb.array([]),
      labTestReports: this.fb.array([]),
      treatmentPlan: [''],
      followUpDate: ['']
    });

    this.route.queryParams.subscribe(params => {
      this.patientId = params['patientId'];
      console.log("Patient ID: ", this.patientId);
      if (this.patientId) {
        // Populate data Here
        this.title = 'Edit Patient';
      }
    });
  }



  get allergies() {
    return this.patientForm.get('allergies') as FormArray;
  }

  get pastMedicalHistory() {
    return this.patientForm.get('pastMedicalHistory') as FormArray;
  }

  get surgicalHistory() {
    return this.patientForm.get('surgicalHistory') as FormArray;
  }

  get prescribedMedications() {
    return this.patientForm.get('prescribedMedications') as FormArray;
  }

  get labTestReports() {
    return this.patientForm.get('labTestReports') as FormArray;
  }

  addAllergy() {
    this.allergies.push(this.fb.control('', Validators.required));
  }

  removeAllergy(index: number) {
    this.allergies.removeAt(index);
  }
  addMedicalHistory() {
    this.pastMedicalHistory.push(this.fb.control('', Validators.required));
  }

  removeMedicalHistory(index: number) {
    this.pastMedicalHistory.removeAt(index);
  }

  addSurgicalHistory() {
    this.surgicalHistory.push(this.fb.control('', Validators.required));
  }

  removeSurgicalHistory(index: number) {
    this.surgicalHistory.removeAt(index);
  }

  addPrescribedMedication() {
    this.prescribedMedications.push(this.fb.control('', Validators.required));
  }

  removePrescribedMedication(index: number) {
    this.prescribedMedications.removeAt(index);
  }

  addLabTestReport() {
    this.labTestReports.push(this.fb.control('', Validators.required));
  }

  removeLabTestReport(index: number) {
    this.labTestReports.removeAt(index);
  }
}
