import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { DoctorComponent } from './doctor/doctor.component';
import { ServicesComponent } from './services/services.component';
import { PatientsComponent } from './patients/patients.component';
import { CourseSuggestionComponent } from './course-suggestion/course-suggestion.component';
import { AppointmentsComponent } from './appointments/appointments.component';
import { AddEditPatientComponent } from './add-edit-patient/add-edit-patient.component';
import { DoctorSessionsComponent } from './doctor-sessions/doctor-sessions.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { DoctorHolidaysComponent } from './doctor-holidays/doctor-holidays.component';
import { HeaderFooterUploadComponent } from './header-footer-upload/header-footer-upload.component';

const routes: Routes = [
{path:'login',component:LoginComponent},
{path:'adminlogin',component:AdminLoginComponent},
{path:'doctors',component:DoctorComponent},
{path:'services',component:ServicesComponent},
{path:'patients',component:PatientsComponent},
{path:'addeditpatient',component:AddEditPatientComponent},
{path: 'course', component: CourseSuggestionComponent},
{path:'appointments', component: AppointmentsComponent},
{path:'doctorSessions', component: DoctorSessionsComponent},
{path:'doctorHolidays', component: DoctorHolidaysComponent},
{path:'headerfooterupload', component: HeaderFooterUploadComponent},





];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
