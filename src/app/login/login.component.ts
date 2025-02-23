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

  Showerror:Boolean=false;
  ValidationErrorMsg :string = "";
    
 constructor(private docservice:DoctorServiceService,private router: Router)
 {
 this.loginForm = new FormGroup(
  {
    UserId:new FormControl('',[Validators.required]),
    Password:new FormControl('',[Validators.required]),
    Role:new FormControl('',[Validators.required])
  });

 }
 
  async ValidateLogin()
  {
    this.Showerror= true;
    if(this.loginForm.invalid)
    {
      this.Showerror = true;
    }
    if(this.loginForm.get('UserId')?.invalid)
    {
      this.ValidationErrorMsg ="enter user id";      return;
    }
    if(this.loginForm.get('Password')?.invalid)
    {
      this.ValidationErrorMsg ="enter Password";      return;
    }
    if(this.loginForm.get('Role')?.invalid)
    {
      this.ValidationErrorMsg ="Select the Role";      return;
    }
    
    try
    {
      const response = await this.docservice.ValidateLogin(this.loginForm);

      if(response.status === 200)
      {
      // localStorage.setItem('Token',response.token); 
       localStorage.setItem('HospitalId',response.hosiptalId);
       this.router.navigate(['/doctor']);
      }
      if(response.status == 401)
        {
          this.ValidationErrorMsg = 'Invalid credentials';
          return;
        } 
    }
    catch(error:any)
    {  
      this.ValidationErrorMsg = error.error.message;  
    }

    
  }


}
