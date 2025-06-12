import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { error } from 'console';
import { json } from 'stream/consumers';
import { environment } from './environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HospitalServiceService
 {
     private baseurl = environment.baseUrl;
   
   HospitalId:any = localStorage.getItem('HospitalId') ?? ''; // Ensure it's not null
  
  token:string = ''
   
constructor(private http:HttpClient  )
{
    this.token = localStorage.getItem('token') || ''; // Ensure it's not null
 
}

  AddUpdateSpecialization(formData:any): Promise<any> 
  { 
    
    
  return this.http.post<any>(`${this.baseurl}api/AddUpdateSpecialization`, formData, 
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

  return this.http.delete<any>(`${this.baseurl}api/DeleteSpecialization`, 
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
 AddUpdateServices( payload:any) 
 {
    

  return this.http.post<any>(`${this.baseurl}api/AddUpdateServices`, payload  , {
       headers: new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    }),
    withCredentials: true,
  });
}



 GetServices(  ) 
 {
    

  return this.http.get<any>(`${this.baseurl}api/GetServices`,   {
       headers: new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    }),
    withCredentials: true,
  });
}


GetServiceCategories(CategoryId:any = ''  ) 
 { 


  return this.http.get<any>(`${this.baseurl}api/GetServiceCategories`,   {
       headers: new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    }),
    withCredentials: true,
  });

}


GetMainServiceCategories() {
  const params = new HttpParams().set('flag', 'G');

  return this.http.get<any>(`${this.baseurl}api/GetServicesCategory`, {
    params,
    headers: new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    }),
    withCredentials: true
  });
}


AddUpdateMainServiceCategory(categoryname:any,description:any,staus:any,id:any,flag:any  )
{ 
   
  let params = new HttpParams();
  params= params.append('flag', flag);
  params= params.append('Categoryname', categoryname);
   params= params.append('status', staus);
     params= params.append('CategoryId', id ||'' );
  params= params.append('Description', description); 

  return this.http.post<any>(`${this.baseurl}api/AddUpdateDeleteServicesCategory`, null,  {
    params: params,   
    headers: new HttpHeaders({
      Authorization: `Bearer ${this.token}`

    }),
    withCredentials: true,
  });

}

DeleteMainServiceCategory(id:any)
{
  let params = new HttpParams();
  params= params.append('flag', 'D');  
  params= params.append('CategoryId', id); // Assuming you want to delete all categories, otherwise pass the specific ID

   
  return this.http.post<any>(`${this.baseurl}api/AddUpdateDeleteServicesCategory`, null,  {
    params: params,   
    headers: new HttpHeaders({
      Authorization: `Bearer ${this.token}`

    }),
    withCredentials: true,
  });
}


}
