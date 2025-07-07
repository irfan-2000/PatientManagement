import { Component } from '@angular/core';
import { DoctorServiceService } from '../doctor-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-course-suggestion',
  standalone: false,
  templateUrl: './course-suggestion.component.html',
  styleUrl: './course-suggestion.component.css',
})
export class CourseSuggestionComponent {
  constructor(private doctorservice: DoctorServiceService, private router:Router){}
  courseSuggestions = [
    {
      id: 1,
      name: 'Fundamentals',
    },
    {
      id: 2,
      name: 'TypeScript Essentials',
    },
    {
      id: 3,
      name: 'Angular CLI',
    },
    {
      id: 4,
      name: 'Material',
    }, {
      id: 5,
      name: 'Router',
    },
    {
      id: 6,
      name: 'Forms',
    },
    {
      id: 7,
      name: 'Services',
    }
  ];

  diagnosisItems: any = [];
  treatmentItems:any = [];
  tabletItems:any = [];

  addDiagnosis(event: any) {
    const value = event.target?.value;
    if (!value) return;
    this.diagnosisItems.push(value)
    event.target.value = ''
  }
  addTreatment(event: any) {
    const value = event.target?.value;
    if (!value) return;
    this.treatmentItems.push(value)
    event.target.value = ''
  }
  addTablets(event:any){
    const value = event.target?.value;
    if (!value) return;
    this.treatmentItems.push(value)
    event.target.value = '' 
  }

  generatePDF(){
    const content:any = document.getElementById("courseSuggestionDiv");
    const element = content.cloneNode(true) as HTMLElement;
    
    // Replace all <input> elements with their values
    element.querySelectorAll('#tabletInstructionInput').forEach(input => {
      const span = document.createElement('span');
      span.textContent = (input as HTMLInputElement).value;
      input.replaceWith(span);
    }); 

    const toBeSent = element.innerHTML;
    // navigator.clipboard.writeText(content.innerHTML)
    try {
      this.doctorservice.GeneratePDF(toBeSent).subscribe({
        next: (blob: Blob) => {
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = "Generated.pdf";
          link.click();
          window.URL.revokeObjectURL(url);
        },
        error: err => {
          console.error("PDF download failed", err);
        }
      });
      
        // error: (error: any) => {

        //   console.log(error);
        //   if (error.status === 401) 
        //     {
        //   this.router.navigate(['/login']);
        //     } else if (error.status === 500 && error.error) {

        //   } else {
        //     console.error('Unhandled API error:', error);
        //   }
        // },
      // });
    } catch (error: any) {
      console.error('API error:', error);
    }
  }

  updateTabletInstruction(index: number, event: any) {
    const value = event.target.value;
    this.tabletItems[index].instruction = value;
  }

  deleteDiagnosis(index:number){
    this.diagnosisItems.splice(index, 1);
  }

  deleteTreatment(index:number){
    this.treatmentItems.splice(index, 1);
  }

  deleteTablet(index: number) {
    this.tabletItems.splice(index, 1);
  }

  addTablet(event:any) {
    const value = event.target?.value;
    if (!value) return;
    this.tabletItems.push({
      id: Date.now(),
      tablet: value,
      instruction: ""
    })
    event.target.value = '' 
  }

  onCourseChange(param: any) {
    console.log('reh para', param)
  }
}
