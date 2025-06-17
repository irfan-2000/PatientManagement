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

const routes: Routes = [
{path:'',component:LoginComponent},
{path:'doctors',component:DoctorComponent},
{path:'services',component:ServicesComponent},
{path:'patients',component:PatientsComponent},
{path:'addeditpatient',component:AddEditPatientComponent},
{path: 'course', component: CourseSuggestionComponent},
{path:'appointments', component: AppointmentsComponent},
{path:'doctorSessions', component: DoctorSessionsComponent},




];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
