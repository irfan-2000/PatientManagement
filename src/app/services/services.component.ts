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

  tabs = [
    { id: 'specializations', label: 'Specializations' },
    { id: 'categories', label: 'Categories' },
    { id: 'services', label: 'Services' }
    
  ];
  activeTab = 'specializations';
  ShowSpecialization:boolean = false;
  isAdding: boolean = false;
  isAddingService:boolean = false;
  isAddingServiceCategory:boolean = false;
  ShowServicePopup:boolean = false;
  showCategoryForm:boolean = false;
  IsEditingService:boolean = false;
  ServideId:any;
  ErrorMsg:string = ""
  SuccessMsg:string = ""
  specializations: { specializationId: string; name: string; hospitalId: string; status: string }[] = [];
  specializationId:number | undefined ;
  ServicesCategories:any ={}
  MainserviceCategories:any ={};
  MainServiceCategoriesForm:FormGroup;
  Specializationform: FormGroup;
  serviceForm:FormGroup;
  filteredDoctors:any = [];
  serviceId: any;
  isFormVisible: boolean = true;
  MainServiceflag: string = 'G'; // Default to 'G' for Get operation
  Mainserviceid:any ;
  
 
 services:any =  {};
hours = Array.from({length: 24}, (_, i) => i.toString().padStart(2, '0'));

minutes = Array.from({length: 60}, (_, i) => i.toString().padStart(2, '0'));

doctors :any = {}
  constructor(private fb:FormBuilder,private  router:
    Router,private doctorservice:DoctorServiceService,
    private hospservice:HospitalServiceService,
    private toastr: ToastrService)
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
    this.GetSpecialization();
    this.GetAllDoctors();
    this.GetServices();
    this.GetServiceCategories();
    this.GetMainServiceCategories();
    this.MainServiceCategoriesForm = new FormGroup({
       Name: new FormControl('', Validators.required),
       Description: new FormControl('',Validators.required),
      Status: new FormControl('1', Validators.required)

    });
 
    
}


ngOninit()
{
  
}
CallTabsMethod(tab:any)
{
  console.log(tab);
   
  this.activeTab = tab.id;
  if(this.activeTab == 'categories')
  {
    this.GetServiceCategories();
  }
if(this.activeTab == 'services')
{
this.GetServices();
this.GetServiceCategories();
}

if(this.activeTab == 'specializations')
{
  this.GetSpecialization();
}


}

// Modal
showServicesDeleteModal:any = false;
serviceToDelete: any = null;
showCategoriesDeleteModal: any = false;
categoryToDelete: any = null;
showSpecializationDeleteModal: any = false;
specializationToDelete: any = null;


//Main Servcie Categories
openCategoryForm(Operation: string, item: any = "")
{
this.ErrorMsg = '';
   this.MainServiceCategoriesForm.reset();
  
  this.showCategoryForm = true;
   
  if(Operation =='Add')
    {
     this.isAddingServiceCategory = true; 
  }
  if(Operation == 'Update')
    {
    // Update service category
    this.isAddingServiceCategory = false;
    this.Mainserviceid = item.categoryId;
    this.MainServiceCategoriesForm.patchValue({
      Name: item.categoryname,
      Description: item.description,
      Status: item.status  
    })
  }
}
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
        if (error.status == 401) {
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
 
IsloadingCategory:boolean =false;
AddUpdateMainServiceCategory()
{ 

const Categoryname = this.MainServiceCategoriesForm.get('Name')?.value;
const Description = this.MainServiceCategoriesForm.get('Description')?.value;
const Status = this.MainServiceCategoriesForm.get('Status')?.value;
 this.IsloadingCategory =true;

if (!Categoryname || Categoryname.trim() == '')
  {
    this.ErrorMsg = 'Please enter the category name'; 
    this.IsloadingCategory = false;
    return
  }

  if(Description == null || Description == undefined || Description.trim() == '')
  {
    this.ErrorMsg = 'Please enter the description'; 
    this.IsloadingCategory = false;
    return;
  }

if (Status == null || Status == "null" || Status == undefined || Status == '')
   {
    this.ErrorMsg = 'Please select the status';
    this.IsloadingCategory = false;
    return;
  }

  if(this.MainServiceflag == 'U' && !this.Mainserviceid) 
    {
    this.ErrorMsg = 'Service ID is required for update';
    this.IsloadingCategory = false;
  
    return;     
  }
   
  let flag = '';
  if(this.isAddingServiceCategory)
  {
    flag = 'I';
  }
  else
  {
    flag = 'U';
  }

  
  try {
    this.hospservice. AddUpdateMainServiceCategory(Categoryname,Description,Status,this.Mainserviceid,flag).subscribe({
      next: (response: any) => 
        {
         this.IsloadingCategory = false;
        if (response.status == 200)
           {
          
            this.showToast('success', 'Service Category Saved!! ', '');
            this.ErrorMsg = '';
             this.GetMainServiceCategories(); // Refresh the list after saving
         }

        if(response.status == 403)
          {
             this.showToast('error', 'Same Category Already Exist', '');
          }


      },
      error: (error: any) => 
        {
          this.IsloadingCategory = false;
        if (error.status == 401) 
          {
          this.router.navigate(['/login']);
        } else {
          console.error('Error saving service:', error);
          this.ErrorMsg = 'Something went wrong while saving the service.';
        }
      }
    });
  } catch (error: any) {
    this.IsloadingCategory = false;
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
          if(response.data){
            this.ErrorMsg = '';
            this.showCategoriesDeleteModal = false;
            this.showToast('success', 'Category deleted.','')
            this.GetMainServiceCategories(); // Refresh the list after saving
          }else{
            this.showToast("error", "Error MEssage", '')
          }
         
        }
      },
      error: (error: any) => {
        if (error.status == 401) {
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


//Services

CancelServiceForm()
 {
  this.serviceForm.reset();
  this.ShowServicePopup = false;
}


  GetServices()
  {
    
  try {
    this.hospservice.GetServices( ).subscribe({
      next: (response: any) => {
        if (response.status == 200) 
          {
          
          this.ErrorMsg = '';
            this.services = response.result;
              
        }

          
      },
      error: (error: any) => {
        if (error.status ==401) {
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
 
AddUpdateServices(Operation: string, item: any = "") 
{
   
  this.ErrorMsg = "";
  this.ShowServicePopup = true;
   
  this.isAddingService = false;
  

  if (Operation == 'Add')
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
      Status: '1'
    });
  }
 
  if (Operation == 'Update') 
    {
      this.isAddingService = false;
    this.IsEditingService = true;
    this.serviceId = item.serviceId;  
         

    const [hours, minutes] = item.duration.split(':');
    console.log('doctorIds:', item.doctorIds);
    // Patch values with existing data
    this.serviceForm.patchValue({
      Name: item.name,
      Doctor: item.doctorId,
     DoctorIds: item.doctorIds
    ? item.doctorIds.split(',').map((id: string) => id.trim())  : [],
          hours: hours,
      minutes: minutes,
      Charges: item.charges,
      Category: item.category,
      Status: item.status,

     });


  }
}



 
 async GetSpecialization()
 {
  
  try {
    const response = await this.doctorservice.GetSpecialization();
     
    console.log(response)
    if (response.status == 200) 
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
    // this.GetSpecialization();
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
  

    cancelForm() {
      this.Specializationform.reset();
      this.ShowSpecialization = false;
    }


IsLoadingSpecialization:boolean = false;
async submitForm()
{
  this.ErrorMsg = "";
  if(this.Specializationform.valid)
  {
    const formData = new FormData();

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
    this.IsLoadingSpecialization = true;
    this.hospservice. AddUpdateSpecialization( formData).subscribe({
      next: (response: any) => 
        { 
          this.IsLoadingSpecialization = false;

         if (response.status == 200) 
          {
          
          this.ErrorMsg = '';
            this.showToast('success','Specialization has been saved!!','') 
            this.GetSpecialization();
         } 
          if (response.status == 403) 
          {
          
             this.ErrorMsg = '';
            this.showToast('error','Specialization already Exist!!','') 
            this.GetServices();

         } 
      },
      error: (error: any) => 
        {
            this.IsLoadingSpecialization = false;

        if (error.status == 401) {
          this.router.navigate(['/login']);
        } else {
          console.error('Error saving service:', error);
          this.ErrorMsg = 'Something went wrong while saving the service.';
        }
      }
    });
  } catch (error: any) { this.IsLoadingSpecialization = false;
    console.error('Exception:', error);
    this.ErrorMsg = 'Unexpected error occurred.';
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

    if (response.status == 200) 
    {
      if(response.data){
        this.showToast('success','Delete Success!!','Deleted');
        this.GetSpecialization(); // Refresh the list after deletion
      }else{
        this.showToast('error','Error Message','')
      }
      
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
  this.ShowSpecialization = true;
  this.isAdding = true;
 
 

  if (Operation == 'Add')
    
    {
    this.Specializationform.setValue({
      Name: "",
      Status: "" // Set appropriate default value (e.g., null or 0)
    });
  }

  if (Operation == 'Update')
     {
    this.isAdding = false;
      this.specializationId = item.specializationId;
    this.Specializationform.patchValue({
      Name: item.name,
      Status: item.status 
    });
  }
}


 DelteServices(item:any)
 {

  try {
    this.hospservice.DelteServices(item.serviceId).subscribe({
      next: (response: any) => 
        { 
         if (response.status == 200) 
          {
            if(response.data){
              this.ErrorMsg = '';
              this.showToast('success','Services has been Deleted!!','') 
              this.showServicesDeleteModal = false;
              this.GetServices();
            }else{
              this.showToast('error','Error Message Here','')  
            }
         
         } 
      },
      error: (error: any) => 
        {
            

        if (error.status == 401) {
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

get duration(): string {
  return `${this.serviceForm.value.hours}:${this.serviceForm.value.minutes}`;
}




IsloadingService:boolean =false;

onSubmitServiceForm(ServiceId: any = '') 
{
  this.ErrorMsg = '';

  this.IsloadingService = true;
  const docIds = this.serviceForm.get('DoctorIds')?.value || [];
  if(docIds.length == 0)
     {
    this.ErrorMsg = 'Please select at least one doctor.'; 
    
  this.IsloadingService = false;
    return;
 
  }
   
  // Manual validation checks
  const name = this.serviceForm.get('Name')?.value;
  const doctorId = this.serviceForm.get('Doctor')?.value;
  const charges = this.serviceForm.get('Charges')?.value;
  const hours = this.serviceForm.get('hours')?.value;
  const minutes = this.serviceForm.get('minutes')?.value;
  const category = this.serviceForm.get('Category')?.value;
  const status = this.serviceForm.get('Status')?.value;

  if (!name || name.trim() == '') 
    {
    this.ErrorMsg = 'Please enter the service name';
      this.IsloadingService = false;

    return;
  }
 
  if (charges == null || charges == undefined || charges == '' || isNaN(charges) || parseFloat(charges) <= 0) {
    this.ErrorMsg = 'Please enter the charges';
      this.IsloadingService = false;

    return;
  }

  if (
    (hours == null || hours == undefined || hours == '' ) &&
    (minutes == null || minutes == undefined || minutes == '') || (hours == '00' && minutes == '00')
  ) {
    this.ErrorMsg = 'Please enter the duration (hours or minutes)';
      this.IsloadingService = false;

    return;
  }

  if (!category || category.trim() == '') {
    this.ErrorMsg = 'Please select the category';
      this.IsloadingService = false;

    return;
  }

  if (status == null || status == undefined || status == '') {
    this.ErrorMsg = 'Please select the status';
      this.IsloadingService = false;

    return;
  }


  const formattedDuration = `${String(hours || 0).padStart(2, '0')}:${String(minutes || 0).padStart(2, '0')}:00`;


  const payload =
   {
    ServiceId: this.serviceId  || '',
    Name: name.trim() || null,    
    Charges: parseFloat(charges) || null,
    Duration: formattedDuration || null ,
    Category: category.trim() || null,
    Status:  status || null,
     Flag: !this.isAddingService ? 'U' : 'I',
     CommaSeparatedDoctorIds:this.serviceForm.get('DoctorIds')?.value ? this.serviceForm.get('DoctorIds')?.value.join(',') : '',
 
    };
  
  try {
    this.hospservice.AddUpdateServices(payload).subscribe({
      next: (response: any) => 
        {
            this.IsloadingService = false;

         if (response.status == 200) 
          {
          
          this.ErrorMsg = '';
            this.showToast('success','Services has been saved!!','')

          this.CancelServiceForm();
          this.GetServices();
         }
 
          if(response.status == 403)
          {
             this.showToast('error', 'Same service Already Exist', '');
          }


      },
      error: (error: any) => 
        {
            this.IsloadingService = false;

        if (error.status == 401) {
          this.router.navigate(['/login']);
        } else {
          console.error('Error saving service:', error);
          this.ErrorMsg = 'Something went wrong while saving the service.';
        }
      }
    });
  } catch (error: any) {
      this.IsloadingService = false;

    console.error('Exception:', error);
    this.ErrorMsg = 'Unexpected error occurred.';
  }
}




doctorSearchText: string = '';
 
  filterDoctors(searchTerm: string) 
  {
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

      if (response?.status == 200) 
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

 

  GetServiceCategories(CategoryId:any = '')
  {
    
  try {
    this.hospservice.GetServiceCategories( CategoryId ).subscribe({
      next: (response: any) => {
        if (response.status == 200) {
          
          this.ErrorMsg = '';
           this.ServicesCategories = response.data; 
            
        }
      },
      error: (error: any) => {
        if (error.status == 401) {
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

showDeleteServiceModal(service: any) {
  this.serviceToDelete = service;
  this.showServicesDeleteModal = true;
}

showDeleteCategoryModal(category: any) {
  this.categoryToDelete = category;
  this.showCategoriesDeleteModal = true;
}

showDeleteSpecializationModal(spec: any) {
  this.specializationToDelete = spec;
  this.showSpecializationDeleteModal = true;
}

}
