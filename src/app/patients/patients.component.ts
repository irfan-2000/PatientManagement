import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PatientService } from '../patient.service';
import { report } from 'process';
import { from } from 'rxjs';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';
import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-patients',
  standalone: false,
  templateUrl: './patients.component.html',
  styleUrl: './patients.component.css'
})
export class PatientsComponent {
 
  tabs: string[] = ['Patient Details', 'Patient Report Details', 'Extra Tab'];
  activeTab: string = this.tabs[0];
  showAddDiv: boolean = false;
  currentPatientIdForReportDetail: string = '';
  currentPatientDetails: any = null;
   ReportForm: FormGroup;
   PrescriptionForm: FormGroup;
  IsShowReportForm: boolean = false;
  IsShowPrescriptionForm: boolean = false;


PatientReportDetails:any = {}
   

  
  hideAddDiv() {
    this.showAddDiv = false;
    //clear all inputs
  }
  addReport() {
    console.log("Adding report...");
    // Add report
    this.showAddDiv = false;
  }
  navigateToReportDetails(patient: any) 
  {
    console.log("Navigating to report details: ",patient);
    this.activeTab = 'Patient Report Details';
    this.currentPatientIdForReportDetail = patient.patientId;
    this.currentPatientDetails = patient;
    this.GetPatientreports();
  }

  navigateToAddEditPatient(patient: any) {
    console.log("Navigating to add edit patient: ",patient);
    if(patient.patientId){
      // Navigate as edit
      this.router.navigate(['/addeditpatient'], { queryParams: { patientId: patient.patientId ,IsEditing: true} });
    }else{
      // Navigate as add
      this.router.navigate(['/addeditpatient']);
    }

    
  }

  patientForm: FormGroup;
  isAdding = false;
  doctors = ['Dr. Smith', 'Dr. Brown', 'Dr. Wilson', 'Dr. Taylor', 'Dr. Lee'];
  bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  hours = Array.from({length: 24}, (_, i) => i.toString().padStart(2, '0'));
  minutes = Array.from({length: 60}, (_, i) => i.toString().padStart(2, '0'));

  patients  :any= {}
  AllPatients:any = {}

ShowPatient:Boolean= false


  selectedPatient: any = null;

  constructor(
    private fb: FormBuilder,
    private PatientService: PatientService,
    private router: Router,
    private toastr: ToastrService // <-- Inject ToastrService here
  ) 
  {
    
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
  
  
  this.GetPatientDetails();
  

 this.ReportForm = this.fb.group({
      reports: this.fb.array([this.createReportGroup()])
    });

  this.PrescriptionForm = this.fb.group({
    prescriptions: this.fb.array([this.createPrescriptionGroup()])
  });

  }


//--working code of report forms
 createReportGroup(): FormGroup
  {
    console.log("createReportGroup");
    return this.fb.group({
      reportName: ['', Validators.required],
      reportType: [''],
      reportDescription: [''],
      reportDate: ['', Validators.required],
      prescriptionDate: ['', Validators.required],
      reportFile: ['', Validators.required],
      viewreport:['']

    });
  }



  createPrescriptionGroup(): FormGroup
  {
    console.log("createPrescriptionGroup");
    return this.fb.group({
      prescriptionName: ['', Validators.required],
      prescriptionType: [''],
      prescriptionDescription: [''],
      prescriptionDate: ['', Validators.required],
      prescriptionFile: ['', Validators.required],
    });
  }

  toggleAddDiv()
   {
     this.EnableFileUpdate = false;
    if(this.showAddDiv)
      {
      // clear and reset forms here
      this.IsShowReportForm = true; 
      this.IsShowPrescriptionForm = true;
    
      this.ReportForm.reset();
      this.PrescriptionForm.reset();
      this.reports.clear();
      this.prescriptions.clear();
      this.adddynamicReport();
      this.adddynamicPrescription();
      this.showAddDiv = false;

    }else{
      this.showAddDiv = true;
      this.IsShowReportForm = true;

    }
    console.log("toggleAddDiv",this.showAddDiv);

  }

 adddynamicReport() {
    this.reports.push(this.createReportGroup());
  }
adddynamicPrescription() {
  this.prescriptions.push(this.createPrescriptionGroup());
}

get reports(): FormArray 
{
    return this.ReportForm.get('reports') as FormArray;
  }

  get prescriptions(): FormArray 
  {
    return this.PrescriptionForm.get('prescriptions') as FormArray;
  }


  removeReport(index: number) 
  {
    if (this.reports.length > 1) 
      {
      this.reports.removeAt(index);
    }

  }

  removePrescription(index: number) 
  {
    if (this.prescriptions.length > 1) 
      {
      this.prescriptions.removeAt(index);
    }

  }
  
  onFileChangePrescription(event: any, index: number)
  {
    const file = event.target.files[0];

    if (file) 
      {
        this.prescriptions.at(index).patchValue({ prescriptionFile: file });
      }
  }

 onFileChange(event: any, index: number)
  {
    const file = event.target.files[0];


    if (file) 
      {
      this.reports.at(index).patchValue({ reportFile: file });
    }
  }

  ReportUploadError:any = {}



   Submitreports(item:any = '') 
   {
  
     
    const Report = this.ReportForm.get('reports') as FormArray;

     if (!Report || Report.length === 0) 
      {
     this.ReportUploadError['reportName'] = 'Report   is required';
       return;
     }

 

    for (let i = 0; i < Report.length; i++)
      {
      const control = Report.at(i);
      const reportName = control.get('reportName')?.value;
      const reportType = control.get('reportType')?.value;
      const reportDate = control.get('reportDate')?.value;
      const reportFile = control.get('reportFile')?.value;

      if (!reportName) 
        {
        this.ReportUploadError['reportName'] = 'Report Name  is required!';
        return ;
      }

      if (!reportType) 
        {
        this.ReportUploadError['reportType'] = 'ReportType is required!';
        return ;
      }

      if (!reportDate) 
        {
        this.ReportUploadError['reportDate'] = 'ReportDate is required!';
        return ;
      }
      if (!reportFile && !this.EnableFileUpdate) 
        {
        this.ReportUploadError['reportFile'] = 'Report File is required!';
        return ;
      } 
    }

    
     
    const formData = new FormData();
    
    
    formData.append('PatientId', this.currentPatientDetails?.patientId || '');
 
    if(this.reportid !=null && this.reportid != undefined  && this.reportid != '')
    {
    formData.append('reportid', this.reportid.toString());
    formData.append('IsEditing','true');
    formData.append('flag','UpdateReport');
    
    }
    else
    {
      formData.append('IsEditing', 'false');
     formData.append('flag','InsertReport');
    }

    this.reports.controls.forEach((group, i) => 
      {
      formData.append(`reports[${i}].reportName`, group.get('reportName')?.value);
      formData.append(`reports[${i}].reportType`, group.get('reportType')?.value);
      formData.append(`reports[${i}].reportDescription`, group.get('reportDescription')?.value);
      formData.append(`reports[${i}].reportDate`, group.get('reportDate')?.value);
      formData.append(`reports[${i}].prescriptionDate`, group.get('prescriptionDate')?.value);
      formData.append(`reports[${i}].reportFile`, group.get('reportFile')?.value);         
       });

    // Call your service here with formData
    console.log('Submitting:', formData);
    for (let pair of formData.entries()) 
      {
     console.log(pair[0], pair[1]);
   }

 


    try {
        this.PatientService.AddUpdateReports(formData ).subscribe({
          next: (response: any) => {
            this.toggleAddDiv();
            if (response.status === 200) 
              {
                 this.patients = response.result;
                 this.AllPatients = response.result
                 this.toggleAddDiv();
                 this.showToast('success', 'Report(s) has been saved!', 'Success');
                this.GetPatientreports();
            }
          },
          error: (error: any) => {

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
      }

  }

  Submitprescriptions(flag:any='InsertPrescription') 
  {
    console.log("Submitting prescriptions...");
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
patchFormValues(patient: any) 
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
      const index = this.patients.findIndex((p:any) => p.patientId === formValue.patientId);
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

gotoPrescription(patientId:any){
  console.log("Navigating to prescription with ID=", patientId)
  this.router.navigate(["Prescription"],{
    queryParams:{
      patientId: patientId
    }
  } )
}

viewDetails(visit: any) {
  alert(`Details for ${visit.date}:\nDoctor: ${visit.doctor}\nDiagnosis: ${visit.diagnosis}`);
}



 
GetPatientDetails(flag:any = 'GetPatients',Tab = 'Details')
{
  
  
      try {
        this.PatientService.GetPatientDetails(flag ,Tab).subscribe({
          next: (response: any) => {
            if (response.status === 200) 
              {
                 this.patients = response.result;
                 this.AllPatients = response.result;
              //this.showToast('success', 'Doctor details updated successfully!', 'Success');
             // window.location.reload();
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



GetPatientreports(flag:any = 'GetReportsByPatientId',Tab = 'ReportDetails')
{
let id =this.currentPatientDetails.patientId.toString();



  try {
    this.PatientService.GetPatientreports(flag ,Tab,id).subscribe({
      next: (response: any) => {
        if (response.status === 200) 
          {
             this.PatientReportDetails  = response.result;
           
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


 
EnableFileUpdate:boolean = false;
reportid:any = null;
reportPath:any = null;
OnEditReport(item:any)
{
this.EnableFileUpdate = true;
this.reportid = item.reportId;
this.showAddDiv = true;
this.IsShowReportForm = true;
this.IsShowPrescriptionForm = false;
this.ReportForm.reset();
      this.PrescriptionForm.reset();
      this.reports.clear();
      this.prescriptions.clear();
      this.adddynamicReport();
this.reportPath = item.reportPath

 
  this.ReportForm.patchValue({
   reports: [{
  reportName: item.reportName,
  reportType: item.reportType,
  reportDescription: item.description,
reportDate:   this.dateFormat(item.customDate.split(' ')[0],'yyyy-MM-dd') ,

   
}]
 
  });    

}

 dateFormat(date: any, status: string) {
  const [day, month, year] = date.split('-');
  const myDate = new Date(+year, +month - 1, +day); // JS months are 0-indexed
  return formatDate(myDate, status, 'en-US');
}

// addReport() {
//   this.reports.push({ reportDate: '', prescriptionDate: '', reportFile: null });
// }


 filters:any  ='';

//  applyFilters()
//  {
//     function toDDMMYYYY(dateStr: string): string {
//       if (!dateStr) return '';
//       const [yyyy, mm, dd] = dateStr.split('-');
//       return `${dd}-${mm}-${yyyy}`;
//     }

//     this.appointments = this.Allappointments.filter((appt:any)=>{
//       const matchDate = !this.filters.date || (
//         appt.appointmentDate &&
//         toDDMMYYYY(this.filters.date) === appt.appointmentDate.split(' ')[0]
//       );
//       const matchPatient = !this.filters.patient || appt.patientName === this.filters.patient;
//       const matchStatus = !this.filters.status || appt.status === this.filters.status;
//       const matchDoctor = !this.filters.doctorName || (appt.firstName + ' ' + appt.lName) === this.filters.doctorName;
//       return matchDate && matchPatient && matchStatus && matchDoctor;
//     })
//   }

searchPatient(event: any)
   {
     
    const searchTerm = event.target.value?.trim().toLowerCase();
    console.log("Searching patient: ",searchTerm);

    if(!searchTerm){
      this.patients = this.AllPatients
    }else
    {
      this.patients = this.AllPatients.filter((pat:any)=> (pat.patientName.toLowerCase().includes(searchTerm) || pat.patientId.includes(searchTerm)) )
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


DeleteReport(item:any)
{
  console.log("Deleting report: ",item);
  if(confirm("Are you sure you want to delete this report?"))
  {
    this.PatientService.DeleteReport(item.reportId).subscribe({
      next: (response: any) => {
        if (response.status === 200 && response.result) 
          {
             this.patients = response.result;
             this.AllPatients = response.result
             this.showToast('success', 'Report deleted successfully!', 'Success');
             this.GetPatientreports();
          }
      },
      error: (error: any) => 
        {
          if (error.status === 401) 
              {
           // this.router.navigate(['/login']);
              } else if (error.status === 500 && error.error) {

            } else {
              console.error('Unhandled API error:', error);
            }
        console.error('Error deleting report:', error);
        this.showToast('error', 'Failed to delete report.', 'Error');
      }
    });
  }
}




}
