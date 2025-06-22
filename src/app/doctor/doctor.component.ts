import { Component } from '@angular/core';
import { FormArray, FormsModule } from '@angular/forms';  // <-- Import FormsModule
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MultiSelectModule } from '@syncfusion/ej2-angular-dropdowns'
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { get } from 'http';
import { json } from 'stream/consumers';
import { DoctorServiceService } from '../doctor-service.service';
import { ToastrService } from 'ngx-toastr';
import { error } from 'console';
import { Router } from '@angular/router';
import { map, Observable, startWith } from 'rxjs';


@Component({
  selector: 'app-doctor',
  standalone: false,

  templateUrl: './doctor.component.html',
  styleUrl: './doctor.component.css'
})
export class DoctorComponent {
  showForm = false;
  IsEdition: boolean = false;

  filters = { id: '', name: '', clinic: '', email: '', mobile: '', specialization: '', status: '' };
  Doctorspecialization: any= {};

  doctors = [];
  errorMessages: any = {};
  doctorId: any
  OldselectedFile: any

  countries = [
    { name: 'United States', code: 'US' },
    { name: 'Canada', code: 'CA' },
    { name: 'United Kingdom', code: 'UK' },
    { name: 'Australia', code: 'AU' },
    { name: 'India', code: 'IN' },
    // Add more countries as needed
  ];

  ErrorMsg: any = {};
  years: number[] = [];

  specializations: { specializationId: string; name: string; hospitalId: string; status: string }[] = [];
  filteredSpecialization:any = Observable<any[]>
  doctorForm: FormGroup;
  Allitems: { specializationId: string; name: string; hospitalId: string; status: string; }[] = [];

  constructor(private doctorservice: DoctorServiceService, private fb: FormBuilder, private toastr: ToastrService,private router: Router) {

    const currentYear = new Date().getFullYear();

    this.years = Array.from(
      { length: currentYear - 1979 }, (_, i) => 1980 + i);


    this.doctorForm = new FormGroup({
      FirstName: new FormControl('mohd', Validators.required),
      LastName: new FormControl('irfan', Validators.required),
      Email: new FormControl('irfan@gmail.com', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")
      ]),
      Mobile: new FormControl('7847051616', [
        Validators.required,
        Validators.pattern('^[0-9]{10}$'),  // Only allows 10 digits
        Validators.maxLength(10)
      ]),//new Date().toISOString().split('T')[0]
      Dob: new FormControl(new Date().toISOString().split('T')[0], [
        Validators.required
      ]),
      JoiningDate: new FormControl('', Validators.required),
      Gender: new FormControl('M', Validators.required),
      Age: new FormControl('25', Validators.required),
      Country: new FormControl('IN', Validators.required),
      IsActive: new FormControl(true, Validators.required), // Default to true (Active)
      PostalCode: new FormControl('123', Validators.required),
      Experience: new FormControl('5', [
        Validators.required,
        Validators.min(0),
        Validators.pattern('^[0-9]+$')
      ]),

      Full_Address: new FormControl('', Validators.required),

      City: new FormControl('', Validators.required),

      Specialization: new FormControl<string[]>([], Validators.required),

      Qualifications: new FormArray([
        this.createQualification()
      ], Validators.required),

      IsAgreedTerms: new FormControl(true, Validators.requiredTrue),

      ProfileImage: new FormControl(null, Validators.required)
    });

  }

  private _filterSpecialization(value: string): any[] {
    if (!value) return this.specializations;
    const filterValue = value.toLowerCase().trim();
    // Replace hyphens with spaces for searching
    const searchTerms = filterValue.replace(/-/g, ' ').split(' ').filter(term => term.length > 0);

    return this.specializations.filter(spec => {
      const specString = `${spec.name}`.toLowerCase();
      return searchTerms.every(term => specString.includes(term));
    });
  }

  ngOnInit() {
    this.GetSpecialization();
    this.GetAllDoctors();

    this.filteredSpecialization = this.doctorForm.get('Specialization')!.valueChanges.pipe(
      startWith(''),
      map(value => {
        console.log("Filter value:", value);
        if (typeof value === 'string') {
          return this._filterSpecialization(value);
        }
        return this.doctors;
      })
    );

  }



  createQualification(q: any = ""): FormGroup 
  {

    if (q != "" && q != undefined) {

      return new FormGroup({
        qualificationId:  new FormControl(q.qualificationId || null), // Optional, can be null for new qualifications
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

  get qualificationsArray() {
    return this.doctorForm.get('Qualifications') as FormArray;
  }

  addQualification() {
    const qualifications = this.doctorForm.get('Qualifications') as FormArray;
    qualifications.push(this.fb.group({
      qualification: ['', Validators.required],
      institution: ['', Validators.required],
      yearOfGraduation: ['', Validators.required]
    }));
  }

  removeQualification(index: number) {
    console.log('Before removing:', this.qualificationsArray.value);

    if (this.qualificationsArray.length > 1) {
      this.qualificationsArray.removeAt(index);
      console.log('After removing:', this.qualificationsArray.value);
    } else {
      console.warn("Cannot remove, must keep at least 3 qualifications.");
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
 
UpdateDoctorDetails(doctorform :any)
{
   
  this.showForm =true;       

  console.log("this is the docotr form",doctorform);

  this. GetDoctorDetails(doctorform.id);

  }

  // Reset form to default values
  cancelForm() {
    this.doctorForm.reset();
    this.showForm = false;
  }

  UploadFile: any;
  profileImagePreview: string | ArrayBuffer | null = '/doctors/defaultImage.jpg';  // Holds the image preview

  onFileChange(event: any) {
    this.UploadFile = event.target.files[0];
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profileImagePreview = e.target.result; // Update the preview image

        this.doctorForm.patchValue({ ProfileImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  }

  numbersOnly(event: KeyboardEvent) {
    const input = event.key;

    if (!/^[0-9]$/.test(input)) {
      event.preventDefault();
    }
  }


  async GetAllDoctors() {

    try {
      const response = await this.doctorservice.GetAllDoctors();
      console.log(response);

      if (response?.status === 200) {
        const Doctorsdata = response.doctorsData?.map((data: any) => ({
          id: data.doctorId,
          name: `Dr. ${data.firstName} ${data.lName}`,
          image: data.image,
          mobile: data.mobile,
          email: data.email,
          specialization: data.specializationId?.split(',').map((id: any) => this.specializations.find((spec: any) => spec.specializationId === id)?.name)
            .filter(Boolean)
            .join(','),
          status: (data.status == '1') ? 'Active' : 'InActive'
        }));


        this.doctors = Doctorsdata;
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

  if (error.status === 401 || error?.error?.status === 401) {
    this.router.navigate(['/login']);
    return;
  }

  console.error('Error:', error);
  this.ErrorMsg = "An error occurred while submitting the form.";
}
  }

  async GetSpecialization() {

    try {
      const response = await this.doctorservice.GetSpecialization();
      console.log(response)
      if (response.status === 200) {

        this.specializations = response.specializationData;
        this.filteredSpecialization = this.doctorForm.get('Specialization')!.valueChanges.pipe(
          startWith(''),
          map(value => {
            console.log("Filter value:", value);
            if (typeof value === 'string') {
              return this._filterSpecialization(value);
            }
            return this.doctors;
          })
        );
     }

      if (response.status == 401) {
       }
    } catch (error: any) {
      console.error('Error:', error);
      this.ErrorMsg = "An error occurred while submitting the form.";
    }

  }


  async DeleteDoctor(Id: number) 
  {




      try {
        this.doctorservice.DeleteDoctor(Id).subscribe({
          next: (response: any) =>
             {
             if (response.status == 200)
               {
              this.showToast('success', "Doctor has been deleted","")
               this.GetAllDoctors()
              }

        if(response.status == 403)
              {
              this.showToast('error', "A doctor with this email or mobile already exists","User conflict")
            }

       if(response.status == 500)
              {
              this.showToast('error', "Internal server error","");
            }


          },
          error: (error: any) => {

           console.log(error);
          },
        });
      } catch (error: any) {
        console.error('API error:', error);
      }

    // try {
    //   const response = await this.doctorservice.DeleteDoctor(Id);
    //   console.log(response)
    //   if (response.status === 200)
    //      {

    //     // (type: 'success' | 'error' | 'warning' | 'info', message: string, title: string)
    //     this.showToast('success', 'Delete Success!!', 'Deleted');
    //   }

    //   if (response.status == 500) {
    //     this.showToast('error', 'Error deleting data', 'Error');
    //   }
    // } catch (error: any) {
    //   console.error('Error:', error);
    //   this.ErrorMsg = "An error occurred while submitting the form.";
    // }

  }



  //--------new code -----------
  FinalSubmitDoctorForm() {


    const selectedSpecializationNames = this.doctorForm.get('Specialization')?.value || [];

    const specializationIds = selectedSpecializationNames
      .map((name: string) => {
        const specialization = this.specializations.find(spec => spec.name === name);
        return specialization ? specialization.specializationId : null;
      })

   
console.log("doctorForm",JSON.stringify(this.doctorForm.value));

    console.log(" qualification", JSON.stringify(this.qualificationsArray.value));

    this.errorMessages = {}; // Reset error messages
    const errorCode = this.ValidateFormFields();

    if (errorCode > 0) {
      this.showToast('error', 'Please fill all the required fields correctly.', 'Form Validation Error');
      return;
    } else {

      const formData = new FormData();

      formData.append('Firstname', this.doctorForm.get('FirstName')?.value || '');
      formData.append('LastName', this.doctorForm.get('LastName')?.value || '');
      formData.append('Email', this.doctorForm.get('Email')?.value || '');
      formData.append('Mobile', this.doctorForm.get('Mobile')?.value || '');
      formData.append('Dob', this.doctorForm.get('Dob')?.value || '');
      formData.append('Age', this.doctorForm.get('Age')?.value || '');
      formData.append('Gender', this.doctorForm.get('Gender')?.value || '');
      formData.append('Experience', this.doctorForm.get('Experience')?.value || '0');
      formData.append('Full_Address', this.doctorForm.get('Full_Address')?.value || '');
      formData.append('City', this.doctorForm.get('City')?.value || '');
      formData.append('Country', this.doctorForm.get('Country')?.value || '');
      formData.append('PostalCode', this.doctorForm.get('PostalCode')?.value || '');
      formData.append('IsActive', this.doctorForm.get('IsActive')?.value ? 'true' : 'false');
      formData.append("Qualifications", JSON.stringify(this.qualificationsArray.value));

       
      if (this.doctorId !== undefined && this.doctorId !== null) {
        formData.append("DoctorId", this.doctorId.toString())
      }
      const selectedSpecializationNames = this.doctorForm.get('Specialization')?.value || [];
debugger
      const specializationIds = selectedSpecializationNames
        .map((name: string) => {
          const specialization = this.specializations.find(spec => spec.name === name);
          return specialization ? specialization.specializationId : null;
        })
      // .filter((id: null) => id !== null); // Remove null values

      formData.append("Specialization", JSON.stringify(selectedSpecializationNames));



      if (this.IsEdition) 
     {

        if (this.UploadFile instanceof File) 
          {
          formData.append('ProfileImage', this.UploadFile);
        }
        else
         {
          formData.append('OldProfileImage', this.OldselectedFile);
        }
      } else
       {
        formData.append('ProfileImage', this.UploadFile);
      }

      formData.append('JoiningDate', this.doctorForm.get('JoiningDate')?.value || '');

      

      formData.append("IsEditing", this.IsEdition.toString())




      try {
        this.doctorservice.AddUpdateDoctor(formData).subscribe({
          next: (response: any) =>
             {
             if (response.status == 200)
               {
              if(this.IsEdition)
                {
                this.showToast('success', 'Doctor details updated successfully!', 'Success');
              }else
              {
                this.showToast('success', 'Doctor added successfully!', 'Success');
              } 
              window.location.reload();
            }

        if(response.status == 403)
              {
              this.showToast('error', "A doctor with this email or mobile already exists","User conflict")
            }

       if(response.status == 500)
              {
              this.showToast('error', "Internal server error","");
            }


          },
          error: (error: any) => {

            console.log(error);
            if (error.status == 401) {
            } else if (error.status == 500 && error.error) {

            }
             else if(error.status == 403)
              {
              this.showToast('error', "A doctor with this email or mobile already exists","User conflict")
            }else {
              console.error('Unhandled API error:', error);
            }
          },
        });
      } catch (error: any) {
        console.error('API error:', error);
      }

    }




  }


parseCustomDate(dateStr: string): Date | null 
{
  
  if (!dateStr) return null;
  
  const [datePart] = dateStr.split(' ');
  const [day, month, year] = datePart.split('-').map(Number);

  // Validate parsed numbers
  if (!day || !month || !year) return null;
 
  return new Date(year, month , day); // JS Date uses 0-based month
}

  
  ValidateFormFields() {
    let errorcode = 0;

    if (this.doctorForm.get('FirstName')?.value == '' || this.doctorForm.get('FirstName')?.value == undefined || this.doctorForm.get('FirstName')?.value == null) {
      this.errorMessages["FirstName"] = 'First Name is required!';
      errorcode = 1;
    }
    if (this.doctorForm.get('LastName')?.value == '' || this.doctorForm.get('LastName')?.value == undefined || this.doctorForm.get('LastName')?.value == null) {
      this.errorMessages["LastName"] = 'Last Name is required!';
      errorcode = 1;
    }
    if (this.doctorForm.get('Email')?.value == '' || this.doctorForm.get('Email')?.value == undefined || this.doctorForm.get('Email')?.value == null) {
      this.errorMessages["Email"] = 'Email is required!';
      errorcode = 1;
    }

    if (this.ValidateEmail(this.doctorForm.get('Email')?.value) == false) {
      this.errorMessages["Email"] = 'Please enter a valid email address!';
      errorcode = 1;
    }

    if (this.doctorForm.get('Mobile')?.value == '' || this.doctorForm.get('Mobile')?.value == undefined || this.doctorForm.get('Mobile')?.value == null) {
      this.errorMessages["Mobile"] = 'Mobile is required!';
      errorcode = 1;
    }

    if (this.doctorForm.get('Mobile')?.value.length < 10) {
      this.errorMessages["Mobile"] = 'Mobile number must be 10 digits!';
      errorcode = 1;
    }
    if (this.doctorForm.get('Dob')?.value == '' || this.doctorForm.get('Dob')?.value == undefined || this.doctorForm.get('Dob')?.value == null) {
      this.errorMessages["Dob"] = 'Date of Birth is required!';
      errorcode = 1;
    }

    if (this.doctorForm.get('Age')?.value == '' || this.doctorForm.get('Age')?.value == undefined || this.doctorForm.get('Age')?.value == null) {
      this.errorMessages["Age"] = 'Age is required!';
      errorcode = 1;
    }

    if (this.doctorForm.get('Gender')?.value == '' || this.doctorForm.get('Gender')?.value == undefined || this.doctorForm.get('Gender')?.value == null) {
      this.errorMessages['Gender'] = 'Gender is required!';
      errorcode = 1;
    }

    if (!this.doctorForm.get('ProfileImage')?.valid && !this.IsEdition ) {
      this.errorMessages['ProfileImage'] = 'Profile Image is required!';
      errorcode = 1;
    }

    if (this.doctorForm.get('Country')?.value == '' || this.doctorForm.get('Country')?.value == undefined || this.doctorForm.get('Country')?.value == null) {
      this.errorMessages['Country'] = 'Country is required!';
      errorcode = 1;
    }

    if (this.doctorForm.get('PostalCode')?.value == '' || this.doctorForm.get('PostalCode')?.value == undefined || this.doctorForm.get('PostalCode')?.value == null) {
      this.errorMessages['PostalCode'] = 'Postal Code is required!';
      errorcode = 1;
    }

    const experienceValue = this.doctorForm.get('Experience')?.value;
    if (experienceValue === '' || experienceValue === null || experienceValue === undefined) {
      this.errorMessages['Experience'] = 'Experience is required else enter 0';
      errorcode = 1;
    }

    if (this.doctorForm.get('Full_Address')?.value == '' || this.doctorForm.get('Full_Address')?.value == undefined || this.doctorForm.get('Full_Address')?.value == null) {
      this.errorMessages['Full_Address'] = 'Full Address is required!';
      errorcode = 1;
    }

    if (this.doctorForm.get('City')?.value == '' || this.doctorForm.get('City')?.value == undefined || this.doctorForm.get('City')?.value == null) {
      this.errorMessages['City'] = 'City is required!';
      errorcode = 1;
    }

    if (this.doctorForm.get('Specialization')?.value.length == 0 || this.doctorForm.get('Specialization')?.value == undefined || this.doctorForm.get('Specialization')?.value == null) {
      this.errorMessages['Specialization'] = 'Please select at least one specialization!';
      errorcode = 1;
    }

    if (this.doctorForm.get('Qualifications')?.value.length < 1 || this.doctorForm.get('Qualifications')?.value == undefined || this.doctorForm.get('Qualifications')?.value == null) 
      {
      this.errorMessages['Qualifications'] = 'Please enter at least 1 qualifications!';
      errorcode = 1;
    }
  if (this.ValidateQualification() === 1) 
    {
    errorcode = 1;
  }

 

    if (this.doctorForm.get('IsAgreedTerms')?.value == '' || this.doctorForm.get('IsAgreedTerms')?.value == undefined || this.doctorForm.get('IsAgreedTerms')?.value == null) {
      this.errorMessages['IsAgreedTerms'] = 'You must agree to the terms and conditions!';
      errorcode = 1;
    }





    return errorcode;

  }

  ValidateEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  }

  ValidateQualification(): number 
  {
    const qualifications = this.doctorForm.get('Qualifications') as FormArray;

    if (!qualifications || qualifications.length === 0) {
      this.errorMessages['qualification'] = 'Please enter at least one qualification!';
      return 1;
    }

    for (let i = 0; i < qualifications.length; i++) {
      const control = qualifications.at(i);
      const qualification = control.get('qualification')?.value;
      const institution = control.get('institution')?.value;
      const year = control.get('yearOfGraduation')?.value;

      if (!qualification) {
        this.errorMessages['Qualifications'] = 'Qualification is required!';
        return 1;
      }

      if (!institution) {
        this.errorMessages['Qualifications'] = 'Institution is required!';
        return 1;
      }

      if (!year) {
        this.errorMessages['Qualifications'] = 'Year of graduation is required!';
        return 1;
      }
    }

    return 0; // All validations passed
  }


  async GetDoctorDetails(DoctorId: number) {
     
 
    try {
      // Send formData to the backend API
      const response = await this.doctorservice.GetDoctorDetails(DoctorId);
      const doctordata = response.doctordata.doctordata[0];
      const specializations = response.doctordata.specializationsdata;
      const specializationIds = specializations.map((spec: any) => spec.specializationId);     
      const Qualificationsdata = response.doctordata.qualifications;
      if (response.status == 200) 
        
        {
  
        this.doctorId = doctordata.doctorId;

        this.Doctorspecialization = this.specializations.filter(
          (specialization: any) => specializationIds.includes(specialization.specializationId)
           );
           
           this.IsEdition = true;
            this.showForm = true;

     //   this.Allitems = this.specializations;

      //  this.specializations = specializationData;
          this.OldselectedFile = doctordata.oldImageName;
           
        this.doctorForm.patchValue({
          FirstName: doctordata.firstName,
          LastName: doctordata.lName,
          Email: doctordata.email,
          Mobile: doctordata.mobile,
          Dob:   doctordata.dob?.split(' ')[0]?.split('-').reverse().join('-') || null,
           JoiningDate:  doctordata.joining_Date?.split(' ')[0]?.split('-').reverse().join('-') || null,
          Age: doctordata.age,
          Gender: doctordata.gender,
          Country: doctordata.country,
          IsActive: doctordata.status,
          PostalCode: doctordata.postalCode,
          Experience: doctordata.experience,
          Full_Address: doctordata.full_Address,
          City: doctordata.city 
          
         });
 

        this.profileImagePreview = doctordata.image;

        //this.doctorForm.controls['Specialization'].setValue(specializationData);
        const qualificationsArray = this.doctorForm.get('Qualifications') as FormArray;
        qualificationsArray.clear();


            Qualificationsdata.forEach((item: any) => {
          qualificationsArray.push(this.createQualification(item)); // qualificationId is included now
        });






      }

    } catch (error: any) {
      console.error('Error:', error);
      this.ErrorMsg = "An error occurred while submitting the form.";
    }


  }


  displayFn = (specializationId: string): string => {

    console.log("DisplayFn called with:", specializationId, this.specializations);
    if (!specializationId || !this.doctors) return '';
    const spec = this.specializations.find(d => {
      console.log("reh doc", d);
      return d.specializationId == specializationId
    });
    console.log("Found Specializa:", spec);
    if (spec) {
      console.log("Returning formatted string");
      return `${spec.name}`;
    }
    return '';
  }

  selectedSpecialization:any;
  OnspecilaizationSelected(event: any): void {
    console.log("Selection event:", event);
    const specializationId = event.option.value;
    this.selectedSpecialization = this.specializations.find(d => d.specializationId == specializationId);
    this.doctorForm.get('Specialization')?.setValue(specializationId);
  }

}


