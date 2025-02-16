import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { error } from 'console';

@Injectable({
  providedIn: 'root'
})
export class DoctorServiceService {

private baseurl = "https://localhost:7203/api/"

constructor(private http:HttpClient  ){}


  ValidateLogin(logindata:any):Promise<any>
  {
    const {UserId,Password,Role} = logindata.value;
   console.log(UserId);

   const params = new HttpParams()
   .set('Id',UserId)
   .set('Password',Password)
   .set("Role",Role);

   return this.http.get<any>(`${this.baseurl}Validate`,{params}).toPromise()
   .then((response:any)=>{
    return response;
   })
   .catch((error)=>  {
    console.error("API Error",error);
    return error;
   });
  }
 

}
