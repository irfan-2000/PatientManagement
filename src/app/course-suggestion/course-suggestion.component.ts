import { Component } from '@angular/core';

@Component({
  selector: 'app-course-suggestion',
  standalone: false,
  templateUrl: './course-suggestion.component.html',
  styleUrl: './course-suggestion.component.css',
})
export class CourseSuggestionComponent {
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
