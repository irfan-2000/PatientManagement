import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { error } from 'console';
import { json } from 'stream/consumers';

@Injectable({
  providedIn: 'root'
})
export class HospitalServiceService
 {
  private baseurl = "https://localhost:7203/api/"
  
   HospitalId:any = localStorage.getItem('HospitalId') ?? ''; // Ensure it's not null
  
  
  
  constructor(private http:HttpClient  ){}
  
  AddUpdateSpecialization(formData:any): Promise<any> 
  { 
    
    
  return this.http.post<any>(`${this.baseurl}AddUpdateSpecialization`, formData, 
    {
        withCredentials: true // Ensures cookies (JWT) are sent
    })
    .toPromise()
    .then(response => response)
    .catch(error => {
        console.error("API Error", error);
        return error;
    });
  }


  
  DeleteSpecialization(specializationId: number): Promise<any> 
{ 
  const params = new HttpParams()
    .set('specializationId', specializationId.toString())
    .set('HospitalId', this.HospitalId);

  return this.http.delete<any>(`${this.baseurl}DeleteSpecialization`, 
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


}
