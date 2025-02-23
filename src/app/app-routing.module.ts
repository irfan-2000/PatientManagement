import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { DoctorComponent } from './doctor/doctor.component';
import { ServicesComponent } from './services/services.component';
import { PatientsComponent } from './patients/patients.component';

const routes: Routes = [
{path:'',component:LoginComponent},
{path:'Side',component:SidebarComponent},
{path:'doctor',component:DoctorComponent},
{path:'Services',component:ServicesComponent},
{path:'Patients',component:PatientsComponent}




];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
