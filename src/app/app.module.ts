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
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SidebarComponent,
    DoctorComponent,
    FilterPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,CommonModule,FormsModule
  ],
  providers: [
    provideClientHydration(withEventReplay())
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
