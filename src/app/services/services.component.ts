import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DoctorComponent } from '../doctor/doctor.component';
import { DoctorServiceService } from '../doctor-service.service';
import { HospitalServiceService } from '../hospital-service.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';


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
  IsEditingService:boolean = false;
  ServideId:any;
  ErrorMsg:string = ""
  SuccessMsg:string = ""
  specializations: { specializationId: string; name: string; hospitalId: string; status: string }[] = [];
  specializationId:number | undefined ;
    ServicesCategories:any ={}
    MainserviceCategories:any ={};


filteredDoctors:any = [];
  serviceId: any;

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

doctors :any = {}

MainServiceCategoriesForm:FormGroup;
  Specializationform: FormGroup;
  serviceForm:FormGroup;
  constructor(private fb:FormBuilder,private  router:Router,private doctorservice:DoctorServiceService,private hospservice:HospitalServiceService,private toastr: ToastrService)
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
        Status: ['Active', Validators.required],
        DoctorIds: new FormControl([], Validators.required),
    });
  
    this.GetAllDoctors();
    this.GetServices();
    this.GetServiceCategories();
    this.GetMainServiceCategories();
    this.MainServiceCategoriesForm = new FormGroup({
       Name: new FormControl('', Validators.required),
       Description: new FormControl('',Validators.required),
      Status: new FormControl('', Validators.required)

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
        this.GetSpecialization();
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
      this.GetSpecialization(); // Refresh the list after deletion
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
services:any =  {};

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
      
    this.IsEditingService = true;
    this.serviceId = item.serviceId;  
        debugger

    const [hours, minutes] = item.duration.split(':');
    // Patch values with existing data
    this.serviceForm.patchValue({
      Name: item.serviceCategoryId,
      Doctor: item.doctorId,
      DoctorIds: item.doctorId ? item.doctorId.split(',') : [], // Assuming doctorIds is a comma-separated string
      hours: hours,
      minutes: minutes,
      Charges: item.charges,
      Category: item.category,
      Status: item.status,

     });


  }
}


onSubmitServiceForm(ServiceId: any = '') {
  this.ErrorMsg = '';

  const docIds = this.serviceForm.get('DoctorIds')?.value || [];
  if(docIds.length === 0) {
    this.ErrorMsg = 'Please select at least one doctor.'; 
    return;
  }
  debugger
  // Manual validation checks
  const name = this.serviceForm.get('Name')?.value;
  const doctorId = this.serviceForm.get('Doctor')?.value;
  const charges = this.serviceForm.get('Charges')?.value;
  const hours = this.serviceForm.get('hours')?.value;
  const minutes = this.serviceForm.get('minutes')?.value;
  const category = this.serviceForm.get('Category')?.value;
  const status = this.serviceForm.get('Status')?.value;

  if (!name || name.trim() === '') {
    this.ErrorMsg = 'Please enter the service name';
    return;
  }

 
  if (charges === null || charges === undefined || charges === '' || isNaN(charges) || parseFloat(charges) <= 0) {
    this.ErrorMsg = 'Please enter the charges';
    return;
  }

  if (
    (hours === null || hours === undefined || hours === '' ) &&
    (minutes === null || minutes === undefined || minutes === '') || (hours === '00' && minutes === '00')
  ) {
    this.ErrorMsg = 'Please enter the duration (hours or minutes)';
    return;
  }

  if (!category || category.trim() === '') {
    this.ErrorMsg = 'Please select the category';
    return;
  }

  if (status === null || status === undefined || status === '') {
    this.ErrorMsg = 'Please select the status';
    return;
  }

  // Format duration in HH:mm:ss for backend
  const formattedDuration = `${String(hours || 0).padStart(2, '0')}:${String(minutes || 0).padStart(2, '0')}:00`;

  // Prepare payload
  const payload =
   {
    ServiceId: this.serviceId  || '',
    Name: name.trim() || null,
    
    Charges: parseFloat(charges) || null,
    Duration: formattedDuration || null ,
    Category: category.trim() || null,
    Status:  status || null,
     Flag: this.serviceId ? 'U' : 'I',
     CommaSeparatedDoctorIds:this.serviceForm.get('DoctorIds')?.value ? this.serviceForm.get('DoctorIds')?.value.join(',') : '',
 
    };

  debugger
   

  try {
    this.hospservice.AddUpdateServices(payload).subscribe({
      next: (response: any) => {
        if (response.status === 200) {
          
          this.ErrorMsg = '';
          console.log('Service saved successfully.');
        }
      },
      error: (error: any) => {
        if (error.status === 401) {
          this.router.navigate(['/login']);
        } else {
          console.error('Error saving service:', error);
          this.ErrorMsg = 'Something went wrong while saving the service.';
        }
      }
    });
  } catch (error: any) {
    console.error('Exception:', error);
    this.ErrorMsg = 'Unexpected error occurred.';
  }
}



CancelServiceForm()
 {
  this.serviceForm.reset();
  this.ShowServicePopup = false;
}

doctorSearchText: string = '';
 
  filterDoctors(searchTerm: string) {
    if (!searchTerm) {
      this.filteredDoctors = [...this.doctors];
      return;
    }
    
    const term = searchTerm.toLowerCase();
    this.filteredDoctors = this.doctors.filter((doctor:any) => 
      doctor.firstName.toLowerCase().includes(term) || 
      doctor.lName.toLowerCase().includes(term)
    );
  }

 removeDoctor(doctorId: any, event: Event)
{
  event.stopPropagation();
  const doctorIdsControl = this.serviceForm.get('DoctorIds');
  if (doctorIdsControl) {
    const currentValue = doctorIdsControl.value as any[] || [];
    doctorIdsControl.setValue(
      currentValue.filter(id => id !== doctorId)
    );
  }
}


convertTimeStringToReadable(duration: string): string {
  const [hours, minutes, seconds] = duration.split(':').map(Number);

  const h = hours > 0 ? `${hours}h` : '';
  const m = minutes > 0 ? `${minutes}m` : '';
  const s = seconds > 0 ? `${seconds}s` : '';

  // Join with space and filter out empty values
  return [h, m, s].filter(part => part).join(' ') || '0s';
}


 async GetAllDoctors() {

    try {
      const response = await this.doctorservice.GetAllDoctors();
      console.log(response);

      if (response?.status === 200) 
        { 

        this.doctors = response.doctorsData;
        console.log("After assinging", this.doctors);
              this.filteredDoctors = [...this.doctors];
           
      }
      if (response.status == 401) {
        return;
      }
    } catch (error: any) {
      console.error('Error:', error);
      this.ErrorMsg = "An error occurred while submitting the form.";
    }
  }



  GetServices()
  {
    
  try {
    this.hospservice.GetServices( ).subscribe({
      next: (response: any) => {
        if (response.status === 200) {
          
          this.ErrorMsg = '';
           this.services = response.result;
              
        }
      },
      error: (error: any) => {
        if (error.status === 401) {
          this.router.navigate(['/login']);
        } else {
          console.error('Error saving service:', error);
          this.ErrorMsg = 'Something went wrong while saving the service.';
        }
      }
    });
  } catch (error: any) {
    console.error('Exception:', error);
    this.ErrorMsg = 'Unexpected error occurred.';
  }
  }



  GetServiceCategories(CategoryId:any = '')
  {
    
  try {
    this.hospservice.GetServiceCategories( CategoryId ).subscribe({
      next: (response: any) => {
        if (response.status === 200) {
          
          this.ErrorMsg = '';
           this.ServicesCategories = response.data; 
        }
      },
      error: (error: any) => {
        if (error.status === 401) {
          this.router.navigate(['/login']);
        } else {
          console.error('Error saving service:', error);
          this.ErrorMsg = 'Something went wrong while saving the service.';
        }
      }
    });
  } catch (error: any) {
    console.error('Exception:', error);
    this.ErrorMsg = 'Unexpected error occurred.';
  }
  }



//Service category code new main
isFormVisible: boolean = true;
MainServiceflag: string = 'G'; // Default to 'G' for Get operation
Mainserviceid:any ;
  GetMainServiceCategories( )
  {
     
  try {
    this.hospservice.GetMainServiceCategories(   ).subscribe({
      next: (response: any) => {
         
        if (response.status == 200) {
          
          this.ErrorMsg = '';
           this.MainserviceCategories = response.data;
            
        }
      },
      error: (error: any) => {
        if (error.status === 401) {
          this.router.navigate(['/login']);
        } else {
          console.error('Error saving service:', error);
          this.ErrorMsg = 'Something went wrong while saving the service.';
        }
      }
    });
  } catch (error: any) {
    console.error('Exception:', error);
    this.ErrorMsg = 'Unexpected error occurred.';
  }
  }
 
toggleForm() 
{
    this.isFormVisible = !this.isFormVisible;
    if (!this.isFormVisible) {
      this.resetForm();
    }
  }

resetForm() 
{
    this.MainServiceCategoriesForm.reset({
      Name: '',
      Description: '',
      Status: ''
    });
}


editmaincategory(item:any)
{
   
  this.MainServiceflag = 'U'; // Set to 'U' for Update operation
  this.isFormVisible = true; // Show the form

  this.MainServiceCategoriesForm.patchValue({
    Name: item.categoryname,
    Description: item.description,
    Status: item.status //== 'Active' ? 1 : 0 // Assuming status is a boolean or string
  });
  this.Mainserviceid = item.categoryId; // Store the serviceId for update

}


AddUpdateMainServiceCategory()
{


const Categoryname = this.MainServiceCategoriesForm.get('Name')?.value;
const Description = this.MainServiceCategoriesForm.get('Description')?.value;
const Status = this.MainServiceCategoriesForm.get('Status')?.value;
let flag = 'I'

if (!Categoryname || Categoryname.trim() === '')
  {
    this.ErrorMsg = 'Please enter the category name'; 
    return
  }

  if(Description === null || Description === undefined || Description.trim() === '')
  {
    this.ErrorMsg = 'Please enter the description'; 
    return;
  }

if (Status === null || Status === undefined || Status === '') {
    this.ErrorMsg = 'Please select the status';
    return;
  }

  if(this.MainServiceflag === 'U' && !this.Mainserviceid) 
    {
    this.ErrorMsg = 'Service ID is required for update';
  
    return;     
  }
  debugger

  if(this.Mainserviceid)
  {
    flag = 'U'; // Set to 'U' for Update operation
  }
  


  try {
    this.hospservice. AddUpdateMainServiceCategory(Categoryname,Description,Status,this.Mainserviceid,flag).subscribe({
      next: (response: any) => {
         
        if (response.status == 200) {
          
          this.ErrorMsg = '';
          // this.MainserviceCategories = response.data;
            this.GetMainServiceCategories(); // Refresh the list after saving
        }
      },
      error: (error: any) => {
        if (error.status === 401) {
          this.router.navigate(['/login']);
        } else {
          console.error('Error saving service:', error);
          this.ErrorMsg = 'Something went wrong while saving the service.';
        }
      }
    });
  } catch (error: any) {
    console.error('Exception:', error);
    this.ErrorMsg = 'Unexpected error occurred.';
  }

}


deleteCategory(item:any)
{
  try {
    this.hospservice. DeleteMainServiceCategory(item).subscribe({
      next: (response: any) => {
         
        if (response.status == 200) {
          
          this.ErrorMsg = '';
          // this.MainserviceCategories = response.data;
            this.GetMainServiceCategories(); // Refresh the list after saving
        }
      },
      error: (error: any) => {
        if (error.status === 401) {
          this.router.navigate(['/login']);
        } else {
          console.error('Error saving service:', error);
          this.ErrorMsg = 'Something went wrong while saving the service.';
        }
      }
    });
  } catch (error: any) {
    console.error('Exception:', error);
    this.ErrorMsg = 'Unexpected error occurred.';
  }

}

}
