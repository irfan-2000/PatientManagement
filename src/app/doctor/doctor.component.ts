import { Component } from '@angular/core';
import { FormArray, FormsModule } from '@angular/forms';  // <-- Import FormsModule
import { FormBuilder,FormGroup,FormControl,Validators } from '@angular/forms';
import { MultiSelectModule } from '@syncfusion/ej2-angular-dropdowns'
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { get } from 'http';
import { json } from 'stream/consumers';
import { DoctorServiceService } from '../doctor-service.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-doctor',
  standalone: false,
  
  templateUrl: './doctor.component.html',
  styleUrl: './doctor.component.css'
})
export class DoctorComponent 
{
  showForm = false;
  IsEdition: boolean = false; // Default is false

  filters = { id: '', name: '', clinic: '', email: '', mobile: '', specialization: '', status: '' };

  doctors = [
    {
      id: 1,
      name: 'Dr. John Doe',
      img: 'doctors/d1.jpg',
      clinic: 'City Health Clinic',
      email: 'john.doe@example.com',
      mobile: '+1234567890',
      specialization: 'Cardiologist,Neurologist',
      qualifications: ['MBBS', 'MD', 'FACC'],
      status: 'Active'
    },
    {
      id: 2,
      name: 'Dr. Sarah Smith',
      img: 'doctors/d2.jpg',
      clinic: 'Green Valley Hospital',
      email: 'sarah.smith@example.com',
      mobile: '+0987654321',
      specialization: 'Dermatologist,Neurologist',
      qualifications: ['MBBS', 'MD'],
      status: 'InActive'
    },
    {
      id: 3,
      name: 'Dr. Alex Johnson',
      img: 'doctors/d3.jpg',
      clinic: 'Sunrise Medical Center',
      email: 'alex.johnson@example.com',
      mobile: '+1122334455',
      specialization: 'Neurologist',
      qualifications: ['MBBS', 'DM (Neurology)'],
      status: 'Active'
    }
  ];

  doctorId:any
 // constructor(,private fb:FormGroup){}

  countries = [
    { name: 'United States', code: 'US' },
    { name: 'Canada', code: 'CA' },
    { name: 'United Kingdom', code: 'UK' },
    { name: 'Australia', code: 'AU' },
    { name: 'India', code: 'IN' },
    // Add more countries as needed
  ];

  ErrorMsg:string = ""
  years: number[] = [];

 
  specializations: { specializationId: string; name: string; hospitalId: string; status: string }[] = [];
  doctorForm: FormGroup;
  Allitems: { specializationId: string; name: string; hospitalId: string; status: string; }[] = [];

    constructor( private doctorservice:DoctorServiceService,private fb:FormBuilder, private toastr: ToastrService) 
    {

      const currentYear = new Date().getFullYear();

      this.years = Array.from(
        { length: currentYear - 1979 }, (_, i) => 1980 + i);
    

      this.doctorForm = new FormGroup({
        FirstName: new FormControl('', Validators.required),
        LastName: new FormControl('', Validators.required),
        Email: new FormControl('', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")
        ]),
        Mobile: new FormControl('', [
          Validators.required,
          Validators.pattern('^[0-9]{10}$'),  // Only allows 10 digits
          Validators.maxLength(10)
        ]),
        Dob: new FormControl(new Date().toISOString().split('T')[0], [
          Validators.required,
          this.DateValidator
        ]),
        Gender: new FormControl('', Validators.required),
        Age: new FormControl('', Validators.required),
        Country: new FormControl('', Validators.required),
        IsActive: new FormControl(true, Validators.required), // Default to true (Active)
        PostalCode: new FormControl('', Validators.required),
        Experience: new FormControl('', [
          Validators.required,
          Validators.min(0),
          Validators.pattern('^[0-9]+$')
        ]),
        Full_Address: new FormControl('', Validators.required),
        City: new FormControl('', Validators.required),
        Specialization: new FormControl<string[]>([], Validators.required),
        Qualifications: new FormArray([
          this.createQualification()
        ]),
        IsAgreedTerms: new FormControl(false, Validators.requiredTrue),
        ProfileImage: new FormControl('') 
      });
     
    }
  
   ngOnInit()
      {
        this. GetSpecialization();

      }

createQualification(q:any= ""): FormGroup
{
  
if(q != "" && q != undefined)
{
  
  return new FormGroup({
    qualification: new FormControl(q.qualificationName, Validators.required),
    institution: new FormControl(q.institution, Validators.required),
    yearOfGraduation: new FormControl(q.yearOfCompletion, [Validators.required]) // Must be a 4-digit year
  });
}

    return new FormGroup({
      qualification: new FormControl('', Validators.required),
      institution: new FormControl('', Validators.required),
      yearOfGraduation: new FormControl('', [Validators.required]) // Must be a 4-digit year
    });
 
}
 get qualificationsArray()
   {
    return this.doctorForm.get('Qualifications') as FormArray;
  }

  addQualification()
   {
    const qualifications = this.doctorForm.get('Qualifications') as FormArray;
    qualifications.push(this.fb.group({
      qualification: ['', Validators.required],
      institution: ['', Validators.required],
      yearOfGraduation: ['', Validators.required]
    }));
  }
  
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


  onSpecializationChange(selectedItems: string[]) 
  {
    
    this.GetSpecialization()
    this.doctorForm.controls['Specialization'].setValue(selectedItems);
  }
  removeQualification(index: number) {

    console.log('Before removing:', this.qualificationsArray.value);
  
    if (this.qualificationsArray.length > 3)
       {
      this.qualificationsArray.removeAt(index);
      console.log('After removing:', this.qualificationsArray.value);
    } else {
      console.warn("Cannot remove, must keep at least 3 qualifications.");
    }
  }
  
  // Handle file selection for profile image
  onFileImport(event: any) 
  {
    
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profileImagePreview = e.target.result; // Update the preview image

        this.doctorForm.patchValue({ ProfileImage: e.target.result });
      };
      reader.readAsDataURL(file);
    }
  }

SubmitDoctorForm: object = {}

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


async submitForm()
 {
  this.ErrorMsg = "";

  // Check if the form is valid
  if (this.doctorForm.valid)
     {

    // Create a FormData object
    const formData = new FormData();

    // Manually append form values
 formData.append('Firstname', this.doctorForm.get('FirstName')?.value || '');
formData.append('LastName', this.doctorForm.get('LastName')?.value || '');
formData.append('Email', this.doctorForm.get('Email')?.value || '');
formData.append('Mobile', this.doctorForm.get('Mobile')?.value || '');
formData.append('Dob', this.doctorForm.get('Dob')?.value || '');
formData.append('Age', this.doctorForm.get('Age')?.value || '');
formData.append('Gender', this.doctorForm.get('Gender')?.value || '');
formData.append('Experience', this.doctorForm.get('Experience')?.value || '0');
debugger
formData.append('Full_Address', this.doctorForm.get('Full_Address')?.value || '');
formData.append('City', this.doctorForm.get('City')?.value || '');
formData.append('Country', this.doctorForm.get('Country')?.value || '');
formData.append('PostalCode', this.doctorForm.get('PostalCode')?.value || '');
formData.append('IsActive', this.doctorForm.get('IsActive')?.value ? 'true' : 'false');   
    // Append Qualifications (Assuming it's an array)
//     const qualifications = this.doctorForm.get('Qualifications')?.value || [];
// qualifications.forEach((qual: string | null, index: number) => {
//   formData.append(`Qualifications[${index}]`, qual ?? ""); // Use empty string if null
// });
console.log("Raw Qualifications:", this.qualificationsArray.value);
console.log("Type of Qualifications:", typeof this.qualificationsArray.value);
console.log("JSON.stringify(Qualifications):", JSON.stringify(this.qualificationsArray.value));
formData.append("Qualifications", JSON.stringify(this.qualificationsArray.value));

if (this.doctorId !== undefined && this.doctorId !== null)
  {
  formData.append("DoctorId",this.doctorId.toString())
}
const selectedSpecializationNames = this.doctorForm.get('Specialization')?.value || [];

const specializationIds = selectedSpecializationNames
  .map((name: string) => {
    const specialization = this.specializations.find(spec => spec.name === name);
    return specialization ? specialization.specializationId : null;
  })
 // .filter((id: null) => id !== null); // Remove null values

// Option 1: Send as a comma-separated string

// Option 2: Send as a JSON array (Recommended)
formData.append("Specialization", (specializationIds));

    // Append Profile Image (if any)
  // Append Profile Image (if any)

  const fileInput = document.getElementById('profileImage') as HTMLInputElement;

if (fileInput && fileInput.files && fileInput.files.length > 0)
{
  formData.append('ProfileImage', fileInput.files[0]);
}


if(!(fileInput.files && fileInput.files.length > 0)) 
{

  if(this.profileImagePreview != null && this.profileImagePreview != undefined )
    {
      const url = "https://localhost:7203/Uploads/DoctorImages/638775881075810250.png";
    const image = this.profileImagePreview.toString();
    
      const imageName = image.split("DoctorImages/")[1];
      console.log(imageName); // Output: "638775881075810250.png"
      formData.append('PreviewImage', imageName.toString() || "");
    
    }
}

    // Append Hospital ID
    const hospitalId = localStorage.getItem('HospitalId');
    if (hospitalId) 
      {
      formData.append('HospitalId', hospitalId);
    }

    console.log('Form Data:', this.doctorForm.value);

    // Log FormData for debugging
    for (let [key, value] of formData.entries()) 
      {
      console.log(key, value);
    }

    try {
      // Send formData to the backend API
      const response = await this.doctorservice.SubmitDoctorDetails(formData);

      if (response.status === 200) 
      {
        this.showToast('success','Add Success!!','Add');
        window.location.reload()
        // Success logic here
      }
      if (response.status == 401) {
        return;
      }
    } catch (error: any) {
      console.error('Error:', error);
      this.ErrorMsg = "An error occurred while submitting the form.";
    }
  } else 
  {
    this.ErrorMsg = "Please fill all the fields.";

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


UpdateDoctorDetails(doctorform :any)
{
  console.log(doctorform);
  this. GetDoctorDetails(doctorform.id);

}

// Helper function to get error messages
getErrorMessage(control: FormControl, controlName: string): string
 {
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

  displayErrorMessages(errorMessages: { [key: string]: string }) 
  {
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
    if (file)
   {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profileImagePreview = e.target.result; // Update the preview image

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
  
 async GetDoctorDetails(DoctorId :number)
 {
  
  this.IsEdition = true;
  try {
    // Send formData to the backend API
    const response = await this.doctorservice.GetDoctorDetails(DoctorId);
    console.log(response)
    const doctordata = response.doctordata[0];
    if (response.status == 200) 
      {
        this.doctorId = doctordata.doctorId; 

        const specializationData = doctordata.specializationId
        ?.split(',')
        .map((id: any) => this.specializations.find((spec: any) => spec.specializationId === id))
        this.Allitems = this.specializations;
        this.specializations = specializationData;
          this.doctorForm.patchValue({
            FirstName: doctordata.firstName,
            LastName: doctordata.lName,
            Email: doctordata.email ,
            Mobile: doctordata.mobile,
            Dob:doctordata.dob,
            Age:doctordata.age,
            Gender: doctordata.gender,
            Country: doctordata.country,
            IsActive: doctordata.status,
            PostalCode: doctordata.postalCode,
            Experience: doctordata.experience,
            Full_Address: doctordata.fullAddress,
            City: doctordata.city,
            Specialization : specializationData
            
            //Specialization: new FormControl<string[]>([], Validators.required),
          //  Qualifications: new FormArray([
              //this.createQualification()
            //]),
            //IsAgreedTerms: true,
            
        

          });
         this.profileImagePreview = doctordata.image;
         
        this.doctorForm.controls['Specialization'].setValue(specializationData); 
        const qualificationsArray = this.doctorForm.get('Qualifications') as FormArray;

        // Clear existing values if needed
        qualificationsArray.clear();
   if(doctordata.qualificationList.length >0 )
    {
      
      doctordata.qualificationList.forEach((item:any)=>
        {
      (this.doctorForm.get('Qualifications') as FormArray).push(this.createQualification(item));


    })
    }
        console.log("editing",specializationData);
            this.showForm =true;       
      }
    
  } catch (error: any) {
    console.error('Error:', error);
    this.ErrorMsg = "An error occurred while submitting the form.";
  }
 }


 async GetAllDoctors()
 {
  
  try {
    const response = await this.doctorservice.GetAllDoctors();
     console.log(response);

    if (response?.status === 200) 
      {
        const Doctorsdata = response.doctorsData?.map((data: any) => ({
          id: data.doctorId,
          name: `Dr. ${data.firstName} ${data.lName}`,
          image:data.image,
          mobile: data.mobile,
          email: data.email,
          specialization: data.specializationId?.split(',').map((id: any) => this.specializations.find((spec: any) => spec.specializationId === id)?.name)
            .filter(Boolean)
            .join(','),
          status: (data.status == '1')? 'Active' : 'InActive'
        }));
        

        this.doctors = Doctorsdata;
        console.log("After assinging",this.doctors);
        
    }
    if (response.status == 401) 
      {
      return;
    }
  } catch (error: any) {
    console.error('Error:', error);
    this.ErrorMsg = "An error occurred while submitting the form.";
  }
 }


 
 async GetSpecialization()
 {
  
  try {
    const response = await this.doctorservice.GetSpecialization();
     console.log(response)
    if (response.status === 200) 
      {
        console.log("soecialization",response);
        this.specializations = response.specializationData;
        console.log(this.specializations);
        this.GetAllDoctors();
    }

    if (response.status == 401) 
      {
      return;
    }
  } catch (error: any) {
    console.error('Error:', error);
    this.ErrorMsg = "An error occurred while submitting the form.";
  }

 }



 
 async DeleteDoctor(Id:number)
 {
  
  try {
    const response = await this.doctorservice.DeleteDoctor(Id);
     console.log(response)
    if (response.status === 200) 
      {

       // (type: 'success' | 'error' | 'warning' | 'info', message: string, title: string)
        this.showToast('success','Delete Success!!','Deleted');
    }

    if (response.status == 500 ) 
      {
        this.showToast('error','Error deleting data','Error');
    }
  } catch (error: any) {
    console.error('Error:', error);
    this.ErrorMsg = "An error occurred while submitting the form.";
  }

 }




}
