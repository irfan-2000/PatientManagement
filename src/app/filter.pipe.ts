import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  standalone: false,
  pure:false
})
export class FilterPipe implements PipeTransform {

  transform(doctors: any[], filters: any): any[]
   {
    if (!doctors || !filters) return doctors;

return doctors.filter(doctor => 
      (!filters.id || doctor.id.toString().includes(filters.id)) && 
       (!filters.name || doctor.name.toLowerCase().includes(filters.name.toLowerCase())) &&   
     (!filters.clinic || doctor.clinic.toLowerCase().includes(filters.clinic.toLowerCase())) &&
      (!filters.email || doctor.email.toLowerCase().includes(filters.email.toLowerCase())) &&
      (!filters.mobile || doctor.mobile.includes(filters.mobile)) &&
      (!filters.specialization || doctor.specialization.toLowerCase().includes(filters.specialization.toLowerCase())) &&
      (!filters.status || doctor.status.toLowerCase().trim() === filters.status.toLowerCase().trim()) // Use exact match
    );



  }

}
