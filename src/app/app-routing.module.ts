import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { DoctorComponent } from './doctor/doctor.component';
import { ServicesComponent } from './services/services.component';
import { PatientsComponent } from './patients/patients.component';
import { CourseSuggestionComponent } from './course-suggestion/course-suggestion.component';

const routes: Routes = [
{path:'',component:LoginComponent},
{path:'doctors',component:DoctorComponent},
{path:'services',component:ServicesComponent},
{path:'patients',component:PatientsComponent},
{path: 'course', component: CourseSuggestionComponent}




];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
