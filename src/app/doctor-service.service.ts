import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { error } from 'console';
import { json } from 'stream/consumers';
import { environment } from './environments/environment';
@Injectable({
  providedIn: 'root'
})
export class DoctorServiceService {


  private baseurl = environment.baseUrl;


 HospitalId:any = localStorage.getItem('HospitalId') ?? ''; // Ensure it's not null



constructor(private http:HttpClient  ){}

ValidateLogin(logindata: any): Promise<any> 
{
  const { UserId, Password, Role } = logindata.value;

  const body = 
  {
    Id: UserId,
    Password: Password,
    Role: Role
  };

  // Set headers to send JSON
  const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  return this.http.post<any>(`${this.baseurl}api/Validate`, JSON.stringify(body), { headers, withCredentials: true })
    .toPromise()
    .then((response: any) => response)
    .catch((error) => {
      console.error("API Error", error);
      return error;
    });
}


  AddUpdateDoctor(formData:any )
  { 
  
   return this.http.post<any>(`${this.baseurl}api/AddUpdateDoctor`, formData, {
     withCredentials: true
   });
  }

 

GetDoctorDetails(doctorId: number): Promise<any> 
{ 
  const params = new HttpParams()
    .set('DoctorId', doctorId.toString())
    .set('HospitalId', this.HospitalId);

  return this.http.get<any>(`${this.baseurl}api/GetDoctorDetails`, 
  { 
    params, // ✅ Send as query params
    withCredentials: true // ✅ Ensures cookies (JWT) are sent
  })
  .toPromise()
  .then(response => response)
  .catch(error => {
      console.error("API Error", error);
      return error;
  });
}


GetAllDoctors(): Promise<any> 
{  

if(!this.HospitalId)
  alert("Unkown Error Occured Please Login again");


const params = new HttpParams().set('HospitalId',this.HospitalId);
  return this.http.get<any>(`${this.baseurl}api/GetAllDoctors`, 
  { 
    params,
  })
  .toPromise()
  .then(response => response)
  .catch(error => {
      console.error("API Error", error);
      return error;
  });
}


GetSpecialization(): Promise<any> 
{  
if(!this.HospitalId)
  alert("Unkown Error Occured Please Login again");
const params = new HttpParams().set('HospitalId',this.HospitalId);
  return this.http.get<any>(`${this.baseurl}api/GetSpecialization`, 
  { 
    params,
  })
  .toPromise()
  .then(response => response)
  .catch(error => {
      console.error("API Error", error);
      return error;
  });
}





DeleteDoctor(Id:Number): Promise<any> 
{  
if(!this.HospitalId)
  alert("Unkown Error Occured Please Login again");
const params = new HttpParams()
.set('HospitalId',this.HospitalId)
.set('DoctorId',Id.toString());
  return this.http.delete<any>(`${this.baseurl}DeleteDoctor`, 
  { 
    params,
  })
  .toPromise()
  .then(response => response)
  .catch(error => {
      console.error("API Error", error);
      return error;
  });
}



















//   async logout() {
//   try {
//     const response = await this.http.post('/api/logout', {}).toPromise();
//     if (response.status === 200) {
//       // Clear any non-sensitive data from localStorage
//       localStorage.removeItem('HospitalId');

//       // Redirect to the login page
//       this.router.navigate(['/login']);
//     }
//   } catch (error) {
//     console.error('Logout failed', error);
//   }
// }
  

}
