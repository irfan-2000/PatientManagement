import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from './environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PatientService {


  private baseurl = environment.baseUrl;


 HospitalId:any = localStorage.getItem('HospitalId') ?? ''; // Ensure it's not null



constructor(private http:HttpClient ,private router :Router ){}

GetPatientDetails(flag :any,Tab:any,id='')
{

let params = new HttpParams();
params = params.append('flag', flag);
params = params.append('Tab', Tab);
params = params.append('PatientId',id);

    const token = localStorage.getItem('token');  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    
    return this.http.get<any>(`${this.baseurl}api/GetPatientsorReports`, {
     params, headers: headers,
      withCredentials: true
    });

}



AddUpdateReports(formData: any) {
   
  const token = localStorage.getItem('token');  
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
    // Do NOT manually set 'Content-Type' when using FormData
  });

  return this.http.post<any>(`${this.baseurl}api/AddUpdatePatientReports`, formData, {
    headers: headers,
    withCredentials: true
  });
}


GetPatientreports(flag: any,Tab:any, PatientId: any)
{
  let params = new HttpParams();
  params = params.append('flag', flag);
  params = params.append('Tab', Tab);
  params = params.append('PatientId', PatientId);

  const token = localStorage.getItem('token');  
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
    // Do NOT manually set 'Content-Type' when using FormData
  });

  return this.http.get<any>(`${this.baseurl}api/GetPatientsorReports`, {
    params,headers: headers,
    withCredentials: true
  }); 
}


AddUpdatePatient(formData: any) 
{
  const token = localStorage.getItem('token');  
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
    // Do NOT manually set 'Content-Type' when using FormData
  });

  return this.http.post<any>(`${this.baseurl}api/AddUpdatePatients`, formData, {
    headers: headers,
    withCredentials: true
  });

}
 


}
