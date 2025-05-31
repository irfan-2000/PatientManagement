import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-patients',
  standalone: false,
  templateUrl: './patients.component.html',
  styleUrl: './patients.component.css'
})
export class PatientsComponent {
 
  patientForm: FormGroup;
  isAdding = false;
  doctors = ['Dr. Smith', 'Dr. Brown', 'Dr. Wilson', 'Dr. Taylor', 'Dr. Lee'];
  bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  hours = Array.from({length: 24}, (_, i) => i.toString().padStart(2, '0'));
  minutes = Array.from({length: 60}, (_, i) => i.toString().padStart(2, '0'));

  patients = [
    {
      patientId: 'P001',
      fullName: 'John Doe',
      dob: '1985-05-15',
      gender: 'Male',
      bloodGroup: 'A+',
      phone: '1234567890',
      email: 'johndoe@example.com',
      address: '123 Main Street, City, Country',
      heightWeight: '180cm/75kg',
      allergies: 'None',
      pastMedicalHistory: 'Asthma',
      surgicalHistory: 'Appendectomy in 2010',
      doctorAssigned: 'Dr. Smith',
      visitDateTime: '2025-02-20T09:30',
      reasonForVisit: 'Routine Checkup',
      diagnosis: 'Healthy',
      prescribedMedications: 'None',
      labTestReports: 'Normal',
      treatmentPlan: 'Regular exercise, balanced diet',
      followUpDate: '2025-08-20'
    },
    {
      patientId: 'P002',
      fullName: 'Jane Smith',
      dob: '1990-11-25',
      gender: 'Female',
      bloodGroup: 'B+',
      phone: '0987654321',
      email: 'janesmith@example.com',
      address: '456 Another St, City, Country',
      heightWeight: '165cm / 60kg',
      allergies: 'Penicillin',
      pastMedicalHistory: 'Hypertension',
      surgicalHistory: 'None',
      doctorAssigned: 'Dr. Brown',
      visitDateTime: '2025-02-19T14:00',
      reasonForVisit: 'Headache',
      diagnosis: 'Migraine',
      prescribedMedications: 'Pain relievers',
      labTestReports: 'MRI normal',
      treatmentPlan: 'Lifestyle changes',
      followUpDate: '2025-03-19'
    },
    {
      patientId: 'P003',
      fullName: 'Michael Johnson',
      dob: '1975-03-30',
      gender: 'Male',
      bloodGroup: 'O-',
      phone: '5551234567',
      email: 'michaelj@example.com',
      address: '789 Sample Rd, City, Country',
      heightWeight: '175cm / 80kg',
      allergies: 'None',
      pastMedicalHistory: 'Diabetes',
      surgicalHistory: 'Knee surgery in 2018',
      doctorAssigned: 'Dr. Wilson',
      visitDateTime: '2025-02-18T11:15',
      reasonForVisit: 'Follow-up',
      diagnosis: 'Diabetes under control',
      prescribedMedications: 'Metformin',
      labTestReports: 'Stable blood sugar',
      treatmentPlan: 'Diet and exercise',
      followUpDate: '2025-05-18'
    },
    {
      patientId: 'P004',
      fullName: 'Emily Davis',
      dob: '2000-07-12',
      gender: 'Female',
      bloodGroup: 'AB+',
      phone: '4445556666',
      email: 'emilyd@example.com',
      address: '321 Sample Ave, City, Country',
      heightWeight: '170cm / 65kg',
      allergies: 'Peanuts',
      pastMedicalHistory: 'None',
      surgicalHistory: 'None',
      doctorAssigned: 'Dr. Taylor',
      visitDateTime: '2025-02-17T10:00',
      reasonForVisit: 'Skin rash',
      diagnosis: 'Allergic reaction',
      prescribedMedications: 'Antihistamines',
      labTestReports: 'Positive allergy test',
      treatmentPlan: 'Avoid allergens',
      followUpDate: '2025-03-17'
    },
    {
      patientId: 'P005',
      fullName: 'David Wilson',
      dob: '1980-09-05',
      gender: 'Male',
      bloodGroup: 'A-',
      phone: '3332221111',
      email: 'davidw@example.com',
      address: '654 Demo Blvd, City, Country',
      heightWeight: '185cm / 85kg',
      allergies: 'None',
      pastMedicalHistory: 'High Cholesterol',
      surgicalHistory: 'None',
      doctorAssigned: 'Dr. Lee',
      visitDateTime: '2025-02-16T08:45',
      reasonForVisit: 'Cholesterol check',
      diagnosis: 'High cholesterol',
      prescribedMedications: 'Statins',
      labTestReports: 'Abnormal lipid profile',
      treatmentPlan: 'Diet modification',
      followUpDate: '2025-06-16'
    }
  ];

ShowPatient:Boolean= false


  selectedPatient: any = null;

  constructor(private fb: FormBuilder) {
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

  get prescribedMedications()
   {
    return this.patientForm.get('prescribedMedications') as FormArray;
  }

  get labTestReports() 
  {
    return this.patientForm.get('labTestReports') as FormArray;
  }

  addAllergy() 
  {
    this.allergies.push(this.fb.control('',Validators.required));
  }

  removeAllergy(index: number) {
    this.allergies.removeAt(index);
  }


  openPatientModal( patient?: any,operation: string = ''): void
  {
       
    if (operation === 'Add') 
      {
        this.ShowPatient = true;
    

      this.patientForm.reset();
      this.clearAllArrays();
    } else if(operation == 'History')
      {
        this.OpenHistoryPopup();


      }
      else{
      this.selectedPatient = patient;
      this.patchFormValues(patient);
    }
  }


 
  cancel()
   {
    this.ShowPatient = false
    this.patientForm.reset();
    this.selectedPatient = null;
  }
  editPatient(patient: any): void {
    // For demonstration, we'll just log the patient.
    console.log('Editing patient:', patient);
    // Implement your edit logic here.
  }


  // Complete array management methods
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

// Complete patchFormValues implementation
private patchFormValues(patient: any) 
{
  this.patientForm.patchValue({
    ...patient,
    height: patient.heightWeight.split('/')[0].trim().replace('cm', ''),
    weight: patient.heightWeight.split('/')[1].trim().replace('kg', ''),
    visitDateTime: this.formatDateTime(patient.visitDateTime),
    followUpDate: this.formatDate(patient.followUpDate)
  });

  // Handle all array controls
  this.patchArrayValues(patient.allergies, this.allergies);
  this.patchArrayValues(patient.pastMedicalHistory, this.pastMedicalHistory);
  this.patchArrayValues(patient.surgicalHistory, this.surgicalHistory);
  this.patchArrayValues(patient.prescribedMedications, this.prescribedMedications);
  this.patchArrayValues(patient.labTestReports, this.labTestReports);
}

private patchArrayValues(source: string | any[], target: FormArray) {
  const items = typeof source === 'string' ? source.split(',') : source;
  target.clear();
  items.forEach(item => 
    target.push(this.fb.control(item.trim(), Validators.required))
  );
}

// Complete date formatting helpers
private formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toISOString().slice(0, 16);
}

private formatDate(dateString: string): string {
  return dateString ? new Date(dateString).toISOString().split('T')[0] : '';
}

// Complete clearAllArrays implementation
private clearAllArrays() {
  [this.allergies, 
   this.pastMedicalHistory,
   this.surgicalHistory,
   this.prescribedMedications,
   this.labTestReports].forEach(array => {
    while (array.length !== 0) array.removeAt(0);
  });
}

// Complete form submission handler
onSubmit() {
  if (this.patientForm.valid) {
    const formValue = {
      ...this.patientForm.value,
      heightWeight: `${this.patientForm.value.height}cm / ${this.patientForm.value.weight}kg`,
      allergies: this.allergies.value,
      pastMedicalHistory: this.pastMedicalHistory.value,
      surgicalHistory: this.surgicalHistory.value,
      prescribedMedications: this.prescribedMedications.value,
      labTestReports: this.labTestReports.value
    };

    // Handle add/update logic
    if (this.isAdding) {
      // Generate new patient ID
      formValue.patientId = `P${(this.patients.length + 1).toString().padStart(3, '0')}`;
      this.patients.push(formValue);
    } else {
      const index = this.patients.findIndex(p => p.patientId === formValue.patientId);
      this.patients[index] = formValue;
    }

    this.cancel();
  } else {
    // Handle form validation errors
    this.patientForm.markAllAsTouched();
  }
}




isHistoryPopupOpen: boolean = false;
patient = {
  name: 'John Doe',
  allergies: 'Peanuts',
  pastDiseases: 'Diabetes',
  visits: [
    { date: '2024-01-10', doctor: 'Dr. Smith', diagnosis: 'Flu' },
    { date: '2024-02-15', doctor: 'Dr. Johnson', diagnosis: 'Allergy' }
  ]
};

OpenHistoryPopup() {
  this.isHistoryPopupOpen = true;
}

CloseHispotyPopup() {
  this.isHistoryPopupOpen = false;
}

viewDetails(visit: any) {
  alert(`Details for ${visit.date}:\nDoctor: ${visit.doctor}\nDiagnosis: ${visit.diagnosis}`);
}













}
