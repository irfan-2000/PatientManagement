import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientService } from '../patient.service';
import { from } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

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

IsEditing: boolean = false;
errorMessages:any = {}
  constructor(private route: ActivatedRoute, private fb: FormBuilder, private PatientService: PatientService, private router: Router, private toastr: ToastrService) {
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
      doctorAssigned: [''],
      visitDateTime: [''],
      reasonForVisit: [''],
      diagnosis: [''],
      prescribedMedications: this.fb.array([]),
      labTestReports: this.fb.array([]),
      treatmentPlan: [''],
      followUpDate: [''],
      description:['']
    });

    this.route.queryParams.subscribe(params => {
      this.patientId = params['patientId'];
      console.log("Patient ID: ", this.patientId);
      this.IsEditing= params["IsEditing"];
      if (this.patientId) 
        {
        // Populate data Here
        this.title = 'Edit Patient';

      }
      this.GetPatientDetails();
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



AddUpdatePatient()
{ 
    const formData = new FormData();
    const successMessage = this.IsEditing?'Patient details updated successfully!':'Patient added successfully!'

    if(this.ValidateFormFields() == 0)
    {



    if(this.IsEditing)
      {
        formData.append('PatientId', this.patientId);
        formData.append('flag','UpdatePatient');

      }else
      {
        formData.append('PatientId', '');
         formData.append('flag','InsertPatient');
      }
 

      formData.append('PatientName', this.patientForm.get('fullName')?.value);
      formData.append('Dob', this.patientForm.get('dob')?.value); 
      formData.append('Gender', this.patientForm.get('gender')?.value);
      formData.append('PhoneNumber', this.patientForm.get('phone')?.value);
      formData.append('Email', this.patientForm.get('email')?.value || '');
      formData.append('Address', this.patientForm.get('address')?.value) ;
      formData.append('Height', this.patientForm.get('height')?.value || '');
      formData.append('Weight', this.patientForm.get('weight')?.value || '');
      formData.append('Description', this.patientForm.get('description')?.value || '');
      formData.append('BloodGroup', this.patientForm.get('bloodGroup')?.value || '');

       
    try {
        this.PatientService.AddUpdatePatient (formData ).subscribe({
          next: (response: any) => {
            if (response.status === 200) 
           {
 
            if(this.IsEditing) {
              this.showToast('success', 'Patient details updated successfully!', 'Success');
               this.router.navigate(['patients']);
              return
            }

            this.showToast('success', `Patient Id: ${response.result}`  , successMessage);
            this.router.navigate(['patients'])
            }
          },
          error: (error: any) => {
            this.showToast('error', 'Something went wrong' , '');
            console.log(error);
            if (error.status === 401) {
            } else if (error.status === 500 && error.error) {

            } else {
              console.error('Unhandled API error:', error);
            }
          },
        });
      } catch (error: any) {
        console.error('API error:', error);
        this.showToast('error', 'API error' , '');
      }
    }

 
}



ValidateFormFields()
{
  let errorcode = 0;
this.errorMessages = {};
  if (this.patientForm.get('fullName')?.value == '' || this.patientForm.get('fullName')?.value == undefined || this.patientForm.get('fullName')?.value == null) {
      this.errorMessages["fullName"] = '  Name is required!';
      errorcode = 1;
    }

if (this.patientForm.get('dob')?.value == '' || this.patientForm.get('dob')?.value == undefined || this.patientForm.get('dob')?.value == null) {
      this.errorMessages["dob"] = 'Date of Birth is required!';
      errorcode = 1;
    }
 
if(this.patientForm.get('gender')?.value == '' || this.patientForm.get('gender')?.value == undefined || this.patientForm.get('gender')?.value == null) {
      this.errorMessages['gender'] = 'Gender is required!';
      errorcode = 1;
}


if(this.patientForm.get('phone')?.value == '' || this.patientForm.get('phone')?.value == undefined || this.patientForm.get('phone')?.value == null) {
      this.errorMessages['phone'] = 'Phone number is required!';
      errorcode = 1;
    }


    if(this.patientForm.get('bloodGroup')?.value == '' || this.patientForm.get('bloodGroup')?.value == undefined || this.patientForm.get('bloodGroup')?.value == null) {
      this.errorMessages['bloodGroup'] = 'Blood Group is required!';
      errorcode = 1;
    }


    return errorcode;

}


 PatientDetails:any ={}

 showToast(type: 'success' | 'error' | 'warning' | 'info', message: string, title: string) 
 {

    const toastOptions = { timeOut: 15000 }; // 15 seconds

  switch (type) {
    case 'success':
      this.toastr.success(message, title,toastOptions);
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

GetPatientDetails(flag:any = 'GetPatientById',Tab = 'Details')
{
  
  this.patientId
      try {
        this.PatientService.GetPatientDetails(flag ,Tab,this.patientId).subscribe({
          next: (response: any) => {
            if (response.status === 200) 
              {
                 
                this.PatientDetails = response.result[0];
                // this.showToast('success', 'Patient details updated successfully!', 'Success');
             // window.location.reload();

                if(this.IsEditing)
                {
            
                  this.patientForm.patchValue({
                fullName :this.PatientDetails.patientName,
                dob:this.PatientDetails.dob,
                gender:this.PatientDetails.gender,
                bloodGroup:this.PatientDetails.bloodGroup,
                phone:this.PatientDetails.phoneNumber,
                email:this.PatientDetails.email,
                address:this.PatientDetails.address,
                height:this.PatientDetails.height,
                weight:this.PatientDetails.weight,
                description:this.PatientDetails.description 
                });

                }
            

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
}
