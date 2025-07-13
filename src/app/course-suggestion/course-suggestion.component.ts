import { Component } from '@angular/core';
import { DoctorServiceService } from '../doctor-service.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-course-suggestion',
  standalone: false,
  templateUrl: './course-suggestion.component.html',
  styleUrl: './course-suggestion.component.css',
})
export class CourseSuggestionComponent {
  constructor(private doctorservice: DoctorServiceService, private router: Router, private toastr: ToastrService) { }
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

  treatmentSuggestions = [
    'Physical Therapy',
    'Medication',
    'Surgery',
    'Rest and Hydration',
    'Dietary Changes',
    'Exercise',
    'Counseling'
  ];

  diagnosisItems: any = [];
  treatmentItems: any = [];
  tabletItems: any = [];

  showToast(type: 'success' | 'error' | 'warning' | 'info', message: string, title: string) {
    switch (type) {
      case 'success':
        this.toastr.success(message, title);
        break;
      case 'error':
        this.toastr.error(message, title);
        break;
      case 'warning':
        this.toastr.warning(message, title);
        break;
      case 'info':
        this.toastr.info(message, title);
        break;
      default:
        console.error('Invalid toast type');
    }
  }

  addingLimitReached(additionType: string, arrLength: any = 0) {
    const typeLimitMapper: { [key: string]: number } = {
      diagnosis: 5,
      treatment: 4,
      tablets: 7
    }
    console.log("reh limit", typeLimitMapper[additionType], typeLimitMapper[additionType] < arrLength)
    if (arrLength >= typeLimitMapper[additionType]) {
      this.showToast('error', `Maximum ${additionType} items limit reached.`, '')
      return true
    } else {
      return false
    }

  }

  addDiagnosis(event: any) {
    const value = event.target?.value;
    if (!value) return;
    if (this.addingLimitReached('diagnosis', this.diagnosisItems.length)) return;
    this.diagnosisItems.push(value)
    event.target.value = ''
  }
  addTreatment(event: any) {
    const value = event.target?.value;
    if (!value) return;
    if (this.addingLimitReached('treatment', this.treatmentItems.length)) return;
    this.treatmentItems.push(value)
    event.target.value = ''
  }
  addTablets(event: any) {
    const value = event.target?.value;
    if (!value) return;
    if (this.addingLimitReached('tablets', this.tabletItems.length)) return;
    this.tabletItems.push({
      tablet: value,
      instruction: ''
    })
    event.target.value = ''
  }

  generatePDF() {
    const content: any = document.getElementById("courseSuggestionDiv");
    const element = content.cloneNode(true) as HTMLElement;

    // Replace all <input> elements with their values
    element.querySelectorAll('#tabletInstructionInput').forEach(input => {
      const span = document.createElement('span');
      span.textContent = (input as HTMLInputElement).value;
      input.replaceWith(span);
    });

    // Replace description textarea with p element
    const descriptionInput = element.querySelector('#descriptionInput');
    if (descriptionInput) {
      const p = document.createElement('p');
      p.textContent = this.descriptionText;
      p.className = 'description-text';
      descriptionInput.replaceWith(p);
    }

    const descriptionBlock = document.createElement('div');
    descriptionBlock.className = 'description-text-container p-4 border-t mt-4';
    descriptionBlock.innerHTML = `
      <h3 class="text-lg font-semibold text-gray-900 mb-2">Description</h3>
      <p class="text-sm text-gray-700 whitespace-pre-line">${this.descriptionText}</p>
    `;

    // Append before footer or at end
    const footer = element.querySelector('#footer');
    if (footer?.parentElement) {
      footer.parentElement.insertBefore(descriptionBlock, footer);
    } else {
      element.appendChild(descriptionBlock);
    }

    const toBeSent = element.innerHTML;
    // navigator.clipboard.writeText(toBeSent)
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

  deleteDiagnosis(index: number) {
    this.diagnosisItems.splice(index, 1);
  }

  deleteTreatment(index: number) {
    this.treatmentItems.splice(index, 1);
  }

  deleteTablet(index: number) {
    this.tabletItems.splice(index, 1);
  }

  addTablet(event: any) {
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

  // Modal functionality
  showDescriptionModal = false;
  descriptionText = '';

  openDescriptionModal() {
    this.showDescriptionModal = true;
  }

  closeDescriptionModal() {
    this.showDescriptionModal = false;
    // console.log("reg desc text", this.descriptionText)
    // Content is preserved in descriptionText variable
  }
}