import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { error } from 'console';
import { json } from 'stream/consumers';

@Injectable({
  providedIn: 'root'
})
export class DoctorServiceService {

private baseurl = "https://localhost:7203/api/"
private doctorbaseurl = "https://localhost:7203/api/"

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

  return this.http.post<any>(`${this.baseurl}Validate`, JSON.stringify(body), { headers, withCredentials: true })
    .toPromise()
    .then((response: any) => response)
    .catch((error) => {
      console.error("API Error", error);
      return error;
    });
}
SubmitDoctorDetails(formData: FormData): Promise<any> 
{
  return this.http.post<any>(`${this.doctorbaseurl}submitdoctordetails`, formData, {
      withCredentials: true // Ensures cookies (JWT) are sent
  })
  .toPromise()
  .then((response: any) => response)
  .catch((error) => {
      console.error("API Error", error);
      return error;
  });
}
GetDoctorDetails(doctorId: number): Promise<any> 
{ 
  const HospitalId = localStorage.getItem('HospitalId') ?? ''; // Ensure it's not null

  const params = new HttpParams()
    .set('DoctorId', doctorId.toString())
    .set('HospitalId', HospitalId);

  return this.http.get<any>(`${this.doctorbaseurl}GetDoctorDetails`, 
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
