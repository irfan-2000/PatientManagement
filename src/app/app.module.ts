import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { DoctorComponent } from './doctor/doctor.component';
import { FormsModule } from '@angular/forms';
import { FilterPipe } from './filter.pipe';
import { FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'; // <-- Add this import
import { RouterModule, Routes} from '@angular/router';
import { MultiSelectModule } from '@syncfusion/ej2-angular-dropdowns';
import { MultiselectComponent } from './multiselect/multiselect.component';
import { ServicesComponent } from './services/services.component';
import { PatientsComponent } from './patients/patients.component';  
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ToastrModule } from 'ngx-toastr';
import { CourseSuggestionComponent } from './course-suggestion/course-suggestion.component';
import { AppointmentsComponent } from './appointments/appointments.component';
import { LoaderComponent } from './shared/loader/loader.component';

import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AddEditPatientComponent } from './add-edit-patient/add-edit-patient.component';
import { DoctorSessionsComponent } from './doctor-sessions/doctor-sessions.component';

import { MatAutocompleteModule } from '@angular/material/autocomplete';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SidebarComponent,
    DoctorComponent,
    FilterPipe,
    MultiselectComponent,
    ServicesComponent,
    PatientsComponent,
    CourseSuggestionComponent,
    AppointmentsComponent,
    LoaderComponent,
    AddEditPatientComponent,
    DoctorSessionsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,CommonModule,FormsModule,ReactiveFormsModule,HttpClientModule,RouterModule,
    BrowserAnimationsModule,MatSelectModule,
    MatFormFieldModule,
    MatInputModule, // This is used by the toastr module for animations
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-top-right',
      progressBar: true,
    }), // ToastrModule to show toasts
    MatAutocompleteModule
  ],
  providers: [
    provideClientHydration(withEventReplay())
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
