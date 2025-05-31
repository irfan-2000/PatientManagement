import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DoctorComponent } from '../doctor/doctor.component';
import { DoctorServiceService } from '../doctor-service.service';
import { HospitalServiceService } from '../hospital-service.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-services',
  standalone: false,
  templateUrl: './services.component.html',
  styleUrl: './services.component.css'
})
export class ServicesComponent 
{
  filters = { id: '', name: '', status: '' };

  ShowSpecialization:boolean = false;
  isAdding: boolean = false;
  isAddingService:boolean = false;
  ShowServicePopup:boolean = false;

  ErrorMsg:string = ""
  SuccessMsg:string = ""
  specializations: { specializationId: string; name: string; hospitalId: string; status: string }[] = [];
  specializationId:number | undefined ;


ngOninit()
{
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



 


  openSpecializationModal() 
  {
    this.ShowSpecialization = true;
    this.isAdding = false;
    this.GetSpecialization();
  }
  
  closeModal() {
    this.ShowSpecialization = false;
    this.isAdding = false;
  }
  

  SpecializationData = [
    {
      SpecializationId:1,
      Name:'Genral',
      Status :'Active'    
    },
    {
      SpecializationId:2,
      Name:'gg',
      Status:'Inactive'  
    }
  ]
  
hours = Array.from({length: 24}, (_, i) => i.toString().padStart(2, '0'));

minutes = Array.from({length: 60}, (_, i) => i.toString().padStart(2, '0'));

doctors = ['Dr. Sarah Johnson', 'Dr. Michael Chen', 'Dr. Emily Rodriguez'];


  Specializationform: FormGroup;
  serviceForm:FormGroup;
  constructor(private fb:FormBuilder,private doctorservice:DoctorServiceService,private hospservice:HospitalServiceService,private toastr: ToastrService)
  {      
     this.Specializationform = new FormGroup(
      { 
        Name: new FormControl('', Validators.required),
        Status : new FormControl('',Validators.required)
      } )

      this.serviceForm = this.fb.group({
        Name: ['', Validators.required],
        Doctor: ['', Validators.required],
        hours: ['00', Validators.required],
        minutes: ['00', Validators.required],
        Charges: ['', [Validators.required, Validators.min(0)]],
        Category: ['', Validators.required],
        Status: ['Active', Validators.required]
    });
  
  
    }

    cancelForm() {
      this.Specializationform.reset();
      this.ShowSpecialization = false;
    }



async submitForm()
{
  this.ErrorMsg = "";
  if(this.Specializationform.valid)
  {
    const formData = new FormData();

    this.isAdding = false;

    formData.append('Name',this.Specializationform.get('Name')?.value ||'');
    formData.append('Status',this.Specializationform.get('Status')?.value ||'0');

    if (this.specializationId !== undefined && this.specializationId !== null)
    {
      formData.append('SpecializationId',this.specializationId.toString());

    }    
    const hospitalId = localStorage.getItem('HospitalId');
    if (!hospitalId) 
    {
     alert("Error Adding Specialization.. kindly Reload"); 
    }else{
      formData.append('HospitalId',hospitalId.toString())
    }

    try {
      console.log(JSON.stringify(formData))
     const response = await this.hospservice.AddUpdateSpecialization(formData);

      if (response.status === 200) 
      {
        this.showToast('success','Add Success!!','Add');
      }
      if (response.status == 401) {
        return;
      }
    } catch (error: any) {
      console.error('Error:', error);
      this.ErrorMsg = "An error occurred while submitting the form.";
    }


  }
  else
  {
    if (!this.Specializationform.get('Name')?.value)
     {
    this.ErrorMsg = "Please Enter the Specialization";
    return;
  }
  
  if (!this.Specializationform.get('Status')?.value) {  // assuming non-selection returns a falsy value (e.g., empty string, null, or 0)
    this.ErrorMsg = "Please Select the Status";
    return;
  }
  
  }
}



async DeleteSpecialization(specializationId:any)
{
  
  try {
    console.log(JSON.stringify(specializationId))
   const response = await this.hospservice.DeleteSpecialization(specializationId);

    if (response.status === 200) 
    {
      this.showToast('success','Delete Success!!','Deleted');
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

AddUpdateSpecialization(Operation: string, item: any = "") 
{
  this.ErrorMsg = "";

  this.isAdding = true;
  console.log(item);

  if (Operation === 'Add')
    
    {
    this.Specializationform.setValue({
      Name: "",
      Status: "" // Set appropriate default value (e.g., null or 0)
    });
  }

  if (Operation === 'Update')
     {
      this.specializationId = item.specializationId;
    this.Specializationform.patchValue({
      Name: item.name,
      Status: item.status == 'Active'?1:0 
    });
  }
}


errorMessages: { [key: string]: string } = {}; // Variable to store error messages

displayErrorMessages(errorMessages: { [key: string]: string }) 
{
  this.errorMessages = errorMessages; // Update the errorMessages variable
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

// Sample data array with 6 items
services:any = [
  {
    ID: 'S001',
    ServiceID: 'SRV-2023-001',
    Name: 'General Checkup',
    Doctor: 'Dr. Sarah Johnson',
    Charges: 120,
    Duration: '00:30',
    Category: 'Primary Care',
    Status: 'Active'
  },
  {
    ID: 'S002',
    ServiceID: 'SRV-2023-002',
    Name: 'Dental Cleaning',
    Doctor: 'Dr. Michael Chen',
    Charges: 150,
    Duration: '00:45',
    Category: 'Dentistry',
    Status: 'Active'
  },
  {
    ID: 'S003',
    ServiceID: 'SRV-2023-003',
    Name: 'Physical Therapy',
    Doctor: 'Dr. Emily Rodriguez',
    Charges: 95,
    Duration: '01:00',
    Category: 'Rehabilitation',
    Status: 'Pending'
  },
  {
    ID: 'S004',
    ServiceID: 'SRV-2023-004',
    Name: 'Eye Exam',
    Doctor: 'Dr. David Wilson',
    Charges: 80,
    Duration: '00:20',
    Category: 'Optometry',
    Status: 'Inactive'
  },
  {
    ID: 'S005',
    ServiceID: 'SRV-2023-005',
    Name: 'Vaccination',
    Doctor: 'Dr. Jessica Lee',
    Charges: 65,
    Duration: '00:15',
    Category: 'Immunization',
    Status: 'Active'
  },
  {
    ID: 'S006',
    ServiceID: 'SRV-2023-006',
    Name: 'MRI Scan',
    Doctor: 'Dr. Robert Smith',
    Charges: 300,
    Duration: '01:30',
    Category: 'Radiology',
    Status: 'Pending'
  }
];


get duration(): string {
  return `${this.serviceForm.value.hours}:${this.serviceForm.value.minutes}`;
}


AddUpdateServices(Operation: string, item: any = "") 
{
  this.ErrorMsg = "";
  this.ShowServicePopup = true;
   
  this.isAddingService = false;


  if (Operation === 'Add')
  {
    this.isAddingService =true
    // Reset form with empty values
    this.serviceForm.reset({
      Name: '',
      Doctor: '',
      hours: '00',
      minutes: '00',
      Charges: '',
      Category: '',
      Status: 'Active'
    });
  }

  if (Operation === 'Update') 
    {
    // Split duration into hours and minutes
    const [hours, minutes] = item.Duration.split(':');
    
    // Patch values with existing data
    this.serviceForm.patchValue({
      Name: item.Name,
      Doctor: item.Doctor,
      hours: hours,
      minutes: minutes,
      Charges: item.Charges,
      Category: item.Category,
      Status: item.Status
    });
  }
}


onSubmitServiceForm()
{
  if(this.serviceForm.valid)
  {

    console.log(this.serviceForm);

  }else
  {

    
    if (!this.serviceForm.get('Name')?.value)
      {
     this.ErrorMsg = "Please Enter the Name";
     return;
   }
   
  
   if (!this.serviceForm.get('Doctor')?.value)
    {
   this.ErrorMsg = "Please select the Doctor";
   return;
 }
 
 if (!this.serviceForm.get('Charges')?.value)
  {
 this.ErrorMsg = "Please Enter the Name";
 return;
}

if (!this.serviceForm.get('hours')?.value && !this.serviceForm.get('minutes')?.value)
  {
 this.ErrorMsg = "Please Enter the Duration";
 return;
}

if (!this.serviceForm.get('Category')?.value)
  {
 this.ErrorMsg = "Please Select the Name";
 return;
}

if (!this.serviceForm.get('Status')?.value)
  {
 this.ErrorMsg = "Please Enter the Name";
 return;
}



  }


}


CancelServiceForm()
 {
  this.serviceForm.reset();
  this.ShowServicePopup = false;
}










}
