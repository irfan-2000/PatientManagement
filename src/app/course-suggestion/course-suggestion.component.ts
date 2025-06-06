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
    },{
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

  onCourseChange(param:any){
    console.log('reh para', param)
  }
}
