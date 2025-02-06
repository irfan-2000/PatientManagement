import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { DoctorComponent } from './doctor/doctor.component';

const routes: Routes = [
{path:'login',component:LoginComponent},
{path:'Side',component:SidebarComponent},
{path:'',component:DoctorComponent}



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
