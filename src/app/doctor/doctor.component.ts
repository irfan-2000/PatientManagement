import { Component } from '@angular/core';
import { FormArray, FormsModule } from '@angular/forms';  // <-- Import FormsModule
import { FormGroup,FormControl,Validators } from '@angular/forms';
import { MultiSelectModule } from '@syncfusion/ej2-angular-dropdowns'
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { get } from 'http';
import { json } from 'stream/consumers';


@Component({
  selector: 'app-doctor',
  standalone: false,
  
  templateUrl: './doctor.component.html',
  styleUrl: './doctor.component.css'
})
export class DoctorComponent 
{
  showForm = false;

  filters = { id: '', name: '', clinic: '', email: '', mobile: '', specialization: '', status: '' };

  doctors = [
    {
      id: 1,
      name: 'Dr. John Doe',
      img: 'assets/doctors/d1.jpg',
      clinic: 'City Health Clinic',
      email: 'john.doe@example.com',
      mobile: '+1234567890',
      specialization: 'Cardiologist',
      qualifications: ['MBBS', 'MD', 'FACC'],
      status: 'Active'
    },
    {
      id: 2,
      name: 'Dr. Sarah Smith',
      img: 'assets/doctors/d2.jpg',
      clinic: 'Green Valley Hospital',
      email: 'sarah.smith@example.com',
      mobile: '+0987654321',
      specialization: 'Dermatologist',
      qualifications: ['MBBS', 'MD'],
      status: 'Inactive'
    },
    {
      id: 3,
      name: 'Dr. Alex Johnson',
      img: 'assets/doctors/d3.jpg',
      clinic: 'Sunrise Medical Center',
      email: 'alex.johnson@example.com',
      mobile: '+1122334455',
      specialization: 'Neurologist',
      qualifications: ['MBBS', 'DM (Neurology)'],
      status: 'Active'
    }
  ];


  countries = [
    { name: 'United States', code: 'US' },
    { name: 'Canada', code: 'CA' },
    { name: 'United Kingdom', code: 'UK' },
    { name: 'Australia', code: 'AU' },
    { name: 'India', code: 'IN' },
    // Add more countries as needed
  ];

  ErrorMsg:string = ""
  
  specializations = [
    {SpecializationId:1,Name: 'Cardiologist'},{ SpecializationId:2,Name:'Dermatologist'},{SpecializationId:2 ,Name:'Neurologist'}];
  
  
    doctorForm = new FormGroup({
      FirstName: new FormControl('adasd', Validators.required),
      LastName: new FormControl('irfan@gmail.com', Validators.required),
      Email: new FormControl('irfna@gmail.com', [Validators.required,Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
      Mobile: new FormControl('1234567899', [Validators.required,Validators.pattern('^[0-9]{10}$'),  // Only allows 10 digits
        Validators.maxLength(10)  
      ]),
      Dob: new FormControl('', [Validators.required, this.DateValidator]),
      Gender: new FormControl('M', Validators.required),
      Age: new FormControl('20', Validators.required),
      countryCode: new FormControl(['', Validators.required]), 
      IsActive: new FormControl(true, Validators.required), // Default to true (Active)  
      PostalCode: new FormControl('wwe', Validators.required),
      Experience: new FormControl('0', [Validators.required,Validators.min(0),Validators.pattern('^[0-9]+$')]),
      Full_Address: new FormControl('wqeqwe', Validators.required),
      City: new FormControl('qweqwe', Validators.required),
      Specialization: new FormControl<string[]>([], Validators.required),
      Qualifications: new FormArray([
        new FormControl('', Validators.required),
        new FormControl('', Validators.required),
        new FormControl('', Validators.required)
      ]),
      IsAgreedTerms: new FormControl(false, Validators.requiredTrue),
    ProfileImage: new FormControl('', [Validators.required])    });


    DateValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
  
    // If no value is provided, return null (valid).
    if (!value) {
      return null;
    }
  
    // Check if the value is a valid date
    if (isNaN(Date.parse(value))) {
      return { invalidDate: true }; // Invalid date error
    }
  
    // Check if the date is before the current year
    const currentYear = new Date().getFullYear();
    const inputDate = new Date(value);
  
    // Check if the input date is in the future (greater than the current year)
    if (inputDate.getFullYear() > currentYear) {
      return { futureDate: true }; // Future date error
    }
  
    // Return null if valid date
    return null;
  }
  
  // Getter for easy access to qualifications
  get qualificationsArray()
   {
    return this.doctorForm.get('Qualifications') as FormArray;
  }

  onSpecializationChange(selectedItems: string[]) {
    this.doctorForm.controls['Specialization'].setValue(selectedItems);
  }

  addQualification()
   {
    this.qualificationsArray.push(new FormControl('', Validators.required));
  }

  // Remove a qualification (keeping at least 3)
  removeQualification(index: number) {
    if (this.qualificationsArray.length > 3) {
      this.qualificationsArray.removeAt(index);
    }
  }

  // Handle file selection for profile image
  onFileImport(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.doctorForm.patchValue({ ProfileImage: e.target.result });
      };
      reader.readAsDataURL(file);
    }
  }

SubmitDoctorForm: object = {}

  submitForm() 
  {
   this.ErrorMsg= "";
    // Check if the form is valid
    if (this.doctorForm.valid)
       {
      // Create a FormData object
      const formData = new FormData();
  
      // Append form values to FormData
      Object.keys(this.doctorForm.controls).forEach(key => {
        const control = this.doctorForm.get(key);
  
        // Handle FormArray separately
        if (control instanceof FormArray) {
          const formArray = control as FormArray;
          formArray.controls.forEach((formControl, index) => {
            if (formControl instanceof FormControl) {
              formData.append(`${key}[${index}]`, formControl.value);
            }
          });
        } else if (control instanceof FormControl) {
          formData.append(key, control.value);
        }
      });

      

  
      // Append the file (if any)
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput.files && fileInput.files.length > 0) {
        formData.append('ProfileImage', fileInput.files[0]);
      }
  
      // Log the form data (for debugging)
      console.log('Form Data:', this.doctorForm.value);

      const temp = formData.get("Specialization"); // Example: "Cardiologist,Dermatologist"

      const specializationIds = temp 
          ? (temp as string).split(",") // Convert to array
              .map(name => {
                  const spec = this.specializations.find(spec => spec.Name === name.trim()); 
                  return spec ? spec.SpecializationId : null; // Map to ID, return null if not found
              })
              .filter(id => id !== null) // Remove null values
          : [];
      
      console.log(specializationIds);      
       
      try{

        this.SubmitDoctorForm={
          "Firstname":formData.get("FirstName"),
          "LName":formData.get("LName"),
          "Age":formData.get("Age"),
          "Email":formData.get("Email"),
          "Mobile":formData.get("Mobile"),
          "Status":formData.get("IsActive"),
          "Image" : this.UploadFile,
          "Dob":formData.get("Dob"),
          "Experience" : formData.get("Experience"),
          "Gender":formData.get("Gender"),
          "Full_Address":formData.get("Full_Address"),
          "Country":formData.get("countryCode"),
          "City":formData.get("City"),
          "PostalCode":formData.get("PostalCode"),
          "Qualification":formData.get("Qualification"),/// this will be array
          "specializationIds" :specializationIds // this will be array
          };

          console.log("Final Submit Form:", JSON.stringify(this.SubmitDoctorForm, null, 2));


      }catch(error)
      {
          console.log(error);
      }
     

  
      // Send formData to the backend API
      // Example: this.http.post('your-api-endpoint', formData).subscribe(...);
    } else 
    {
      this.ErrorMsg = "please Fill all the Fields";

      // Collect error messages for invalid fields
      const errorMessages: { [key: string]: string } = {};
      Object.keys(this.doctorForm.controls).forEach(key => {
        const control = this.doctorForm.get(key);
  
        // Handle FormArray separately
        if (control instanceof FormArray) {
          const formArray = control as FormArray;
          formArray.controls.forEach((formControl, index) => {
            if (formControl instanceof FormControl && formControl.invalid) {
              errorMessages[`${key}[${index}]`] = this.getErrorMessage(formControl, `${key}[${index}]`);
            }
          });
        } else if (control instanceof FormControl && control.invalid) {
          errorMessages[key] = this.getErrorMessage(control, key);
        }
      });
  
      // Log or display the error messages
      console.log('Form Errors:', errorMessages);
      this.displayErrorMessages(errorMessages); // Call a method to display errors in the UI
    }
  }
  




// Helper function to get error messages
getErrorMessage(control: FormControl, controlName: string): string {
  if (control.hasError('required')) {
    return `${controlName} is required.`;
  } else if (control.hasError('email')) {
    return 'Please enter a valid email.';
  } else if (control.hasError('invalidDate')) {
    return 'Please enter a valid date.';
  } else if (control.hasError('futureDate')) {
    return 'Date cannot be in the future.';
  } else if (control.hasError('pattern')) {
    return 'Please enter a valid value.';
  } else if (control.hasError('min')) {
    return `Value must be greater than or equal to ${control.errors?.['min'].min}.`;
  } else if (control.hasError('requiredTrue')) {
    return 'You must accept the terms & conditions.';
  }
  // Add more custom error messages as needed
  return 'Invalid value.';
}


  errorMessages: { [key: string]: string } = {}; // Variable to store error messages

  displayErrorMessages(errorMessages: { [key: string]: string }) {
    this.errorMessages = errorMessages; // Update the errorMessages variable
  }

  // Reset form to default values
  cancelForm() {
    this.doctorForm.reset();
    this.showForm = false;
  }

UploadFile:any;
  profileImagePreview: string | ArrayBuffer | null = null;  // Holds the image preview
  onFileChange(event: any) 
  {
    this.UploadFile = event.target.files[0];
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.doctorForm.patchValue({ ProfileImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  }
  
  
  onSelectionChange(selectedItems: string[]) {
    console.log('Selected Items:', selectedItems);
    // Handle the selected items here
  }


  numbersOnly(event: KeyboardEvent)
   {
    const input = event.key;

    if (!/^[0-9]$/.test(input)) 
      {
      event.preventDefault();
    }
  }
  

}
