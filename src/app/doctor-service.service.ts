import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { error } from 'console';
import { json } from 'stream/consumers';
import { environment } from './environments/environment';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class DoctorServiceService {


  private baseurl = environment.baseUrl;


 HospitalId:any = localStorage.getItem('HospitalId') ?? ''; // Ensure it's not null



constructor(private http:HttpClient ,private router :Router ){}

ValidateLogin(logindata: any): Promise<any> 
{
  const { UserId, Password, Role,HospitalId,RememberMe } = logindata.value;

  const body = 
  {
    Id: UserId,
    Password: Password,
    Role: Role,
    HospitalId:HospitalId,
    rememberMe: RememberMe
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


 AddUpdateDoctor(formData: any) {
  const token = localStorage.getItem('token');  
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });
  
  return this.http.post<any>(`${this.baseurl}api/AddUpdateDoctor`, formData, {
    headers: headers,
    withCredentials: true
  });
}


 
GetDoctorDetails(doctorId: number): Promise<any> 
{ 
  const token = localStorage.getItem('token'); // Or wherever you store your token

  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });

  const params = new HttpParams()
    .set('DoctorId', doctorId.toString())
 
  return this.http.get<any>(`${this.baseurl}api/GetDoctorDetails`, 
  { 
    params,
    headers,
    withCredentials: true  
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

const token = localStorage.getItem('token'); // Or wherever you store your token

  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });

   return this.http.get<any>(`${this.baseurl}api/GetAllDoctors`, 
  { 
      headers,withCredentials: true,
  })
  .toPromise()
  .then(response => response)
  .catch(error => {
    if (error.status == 401) 
        {
        this.router.navigate(['/login']);
        return;
      }
      console.error("API Error", error);
      return error;
  });
}


GetSpecialization(): Promise<any> 
{  
const token = localStorage.getItem('token'); // Or wherever you store your token

  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });
  
   return this.http.get<any>(`${this.baseurl}api/GetSpecialization`, 
  { 
     headers,withCredentials: true,
  })
  .toPromise()
  .then(response => response)
  .catch(error => {
    if (error.status == 401) 
        {
        this.router.navigate(['/login']);
        return;
      }
      console.error("API Error", error);
      return error;
  });
}




 

DeleteDoctor(payload:any) {
  const token = localStorage.getItem('token');  
  
  let params = new HttpParams();
  params = params.append("payload", payload.toString());

  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`  });
  
  return this.http.post<any>(`${this.baseurl}api/DeleteDoctor`, {}, {
    headers: headers,

    withCredentials: true,
    params
  });
}









CheckRememberMe() 
{ 

return this.http.get<any>(`${this.baseurl}api/CheckRememberMe`,
{
  headers:new HttpHeaders({'Content-Type':'application/json'}),
  withCredentials:true
  
});
  
  
  }




 
 DoctorSessions(formData: any,OldPayload:any = '' ) 
 {
  const token = localStorage.getItem('token');  
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  });
 
 
  return this.http.post<any>(`${this.baseurl}api/AddUpdateDoctorSession`, formData, {
    headers: headers,
    withCredentials: true
  });
} 

 
 DeleteDoctorSessions(payload: any )
  {
      let params = new HttpParams()
    .set('doctorId', payload.doctorId)
    .set('SessionNumber', payload.sessions[0]?.sessionName || '');
     
  const token = localStorage.getItem('token');  
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  });
 
   
  return this.http.post<any>(`${this.baseurl}api/DeleteDoctorSession`, formData, {
    headers: headers,
    withCredentials: true
  });
  debugger
 return this.http.post<any>(`${this.baseurl}api/DeleteDoctorSession`, {}, {
  headers: headers,
  withCredentials: true,
  params: params
});

  
} 


GetDoctorSessions()
{
 const token = localStorage.getItem('token');  

  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  });
  
  return this.http.get<any>(`${this.baseurl}api/GetDoctorSessions`, {
    headers: headers,
    withCredentials: true
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
