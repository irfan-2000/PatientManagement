import { Component } from '@angular/core';
import { FormGroup,FormControl,Validators } from '@angular/forms';
import { DoctorServiceService } from '../doctor-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  
  loginForm:FormGroup;
  loading:boolean = false;
  Showerror:Boolean=false;
  ValidationErrorMsg :string = "";
    
 constructor(private docservice:DoctorServiceService,private router: Router)
 {
  //this.CheckRememberMe();
 this.loginForm = new FormGroup(
  {
    UserId:new FormControl('Receptionist_IRFAN_HOSP0001001',[Validators.required]),
    Password:new FormControl('123',[Validators.required]),
    Role:new FormControl('Receptionist',[Validators.required]),
    HospitalId:new FormControl('HOSP0001',[Validators.required]),
    RememberMe:new FormControl(false)
  });

 }
 
  async ValidateLogin()
  {
    this.Showerror= true;
    this.ValidationErrorMsg = '';
    if(this.loginForm.invalid)
    {
      this.Showerror = true;
    }
    if(this.loginForm.get('UserId')?.invalid)
    {
      this.ValidationErrorMsg ="UserId is required";     return;
    }
    if(this.loginForm.get('Password')?.invalid)
    {
      this.ValidationErrorMsg ="enter Password";      return;
    }
    if(this.loginForm.get('Role')?.invalid)
    {
      this.ValidationErrorMsg ="Select the Role";      return;
    }
    if(this.loginForm.get('HospitalId')?.invalid)
    {
      this.ValidationErrorMsg ="Enter the Hospital";      return;
    }

    this.loading = true;

    localStorage.clear();
    try
    {
      const response = await this.docservice.ValidateLogin(this.loginForm);

      if(response.status === 200)
      {

      // localStorage.setItem('Token',response.token); 
       localStorage.setItem('HospitalId',response.hospitalId);
       localStorage.setItem('token',response.token);
       setTimeout(()=>{
         this.loading = false;
         this.router.navigate(['doctors']);
       },1000)
      }
      if(response.status == 401)
        {
          this.ValidationErrorMsg = 'Invalid credentials';
          this.loading = false;
          return;
        } 
    }
    catch(error:any)
    {  
      this.ValidationErrorMsg = error.error.message; 
      this.loading = false;

    }
  }




  CheckRememberMe()
  {
     try {
      const response =this.docservice.CheckRememberMe( ).subscribe({
          next: (response: any) =>
          {
             
            this.loginForm.patchValue({
              HospitalId: response.txtHospitalId,
              UserId: response.txtId,
              Password: response.txtPassword,
              Role: response.txtRole,
              RememberMe: response.ChkRememberMe


            });

            
          },
          error: (error: any) =>
           { 
          },
        });
    } catch (error: any) 
    {
      console.error('API error');
      return error;
    
    
    }
  }

}
