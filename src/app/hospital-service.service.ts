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
  
  token:string = ''
  
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
 AddUpdateServices( payload:any) 
 {
   debugger

  return this.http.post<any>(`${this.baseurl}AddUpdateServices`, payload  , {
       headers: new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    }),
    withCredentials: true,
  });
}



 GetServices(  ) 
 {
    

  return this.http.get<any>(`${this.baseurl}GetServices`,   {
       headers: new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    }),
    withCredentials: true,
  });
}


GetServiceCategories(CategoryId:any = ''  ) 
 { 

  return this.http.get<any>(`${this.baseurl}GetServiceCategories`,   {
       headers: new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    }),
    withCredentials: true,
  });

}


GetMainServiceCategories( )
 {
  let params = new HttpParams();
  params= params.append('flag', 'G');  

   
  return this.http.get<any>(`${this.baseurl}GetServicesCategory`,   {
    params: params,   
    headers: new HttpHeaders({
      Authorization: `Bearer ${this.token}`

    }),
    withCredentials: true,
  });
}

AddUpdateMainServiceCategory(categoryname:any,description:any,staus:any,id:any,flag:any  )
{ 
  debugger
  let params = new HttpParams();
  params= params.append('flag', flag);
  params= params.append('Categoryname', categoryname);
  params= params.append('Description', description);
  params= params.append('status', staus);
  params= params.append('CategoryId', id ||'' );
  


  return this.http.post<any>(`${this.baseurl}AddUpdateDeleteServicesCategory`, null,  {
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

  debugger
  return this.http.post<any>(`${this.baseurl}AddUpdateDeleteServicesCategory`, null,  {
    params: params,   
    headers: new HttpHeaders({
      Authorization: `Bearer ${this.token}`

    }),
    withCredentials: true,
  });
}


}
