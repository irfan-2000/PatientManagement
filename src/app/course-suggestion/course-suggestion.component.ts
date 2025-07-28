import { Component, OnInit } from '@angular/core';
import { DoctorServiceService } from '../doctor-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PatientService } from '../patient.service';
import { HospitalServiceService } from '../hospital-service.service';

@Component({
  selector: 'app-course-suggestion',
  standalone: false,
  templateUrl: './course-suggestion.component.html',
  styleUrl: './course-suggestion.component.css',
})
export class CourseSuggestionComponent implements OnInit {
  constructor(private doctorservice: DoctorServiceService, private router: Router, private toastr: ToastrService, 
    private route:ActivatedRoute, private PatientService:PatientService,private hospitalservice:HospitalServiceService) {

    this.GetHeaderFooter();
   }



  patientDetails:any =  []
  isGeneratingPDF = false;
  PatientId:any = '';

  ngOnInit()
  {
    this.route.queryParamMap.subscribe(params => {
      const id = params.get('patientId');
      this.PatientId = id;
      // Fetch patient details and put it in the patientDetails object
      this.GetPatientDetails(id)
    });
  }
  
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

  GetPatientDetails(patientId:any, flag:any = 'GetPatientById',Tab = 'Details')
{
  
      try {
        this.PatientService.GetPatientDetails(flag ,Tab, patientId).subscribe({
          next: (response: any) => {
            if (response.status == 200) 
              {
                const patient = response.result[0]
                // Replace patientDetails obj here.
                this.patientDetails =  patient

            }
          },
          error: (error: any) => {

            console.log(error);
            if (error.status === 401) 
              {
            this.router.navigate(['/login']);
              } else if (error.status === 500 && error.error) {

            } else {
              console.error('Unhandled API error:', error);
            }
          },
        });
      } catch (error: any) {
        console.error('API error:', error);
      }
 

}

  async generatePDF()
  {
       this.isGeneratingPDF = true;

    
    const content:any = document.getElementById("courseSuggestionDiv");
    const element = content.cloneNode(true) as HTMLElement;

    // Replace all <input> elements with their values
    element.querySelectorAll('#tabletInstructionInput').forEach(input => {
      const span = document.createElement('span');
      span.textContent = (input as HTMLInputElement).value;
      input.replaceWith(span);
    });

    // Replace description textarea with p element
   // const descriptionInput = element.querySelector('#descriptionInput');

    //const descriptionInput = document.getElementById('descriptionInput');


    // if (descriptionInput) 
    //   {
    
    //   descriptionInput.replaceWith(p);
    // }
 


  const p = document.createElement('p');
      p.textContent = this.descriptionText;
      p.className = 'description-text';

    const descriptionBlock = document.createElement('div');
    descriptionBlock.className = 'description-text-container p-4 border-t mt-4';
    descriptionBlock.innerHTML = `
      <h3 class="text-lg font-semibold text-gray-900 mb-2">Description</h3>
      <p class="text-sm text-gray-700 whitespace-pre-line">${this.descriptionText}</p>
    `;

    // Append before footer or at end
    const footer = element.querySelector('#footer');
    if (footer?.parentElement) 
      {
      footer.parentElement.insertBefore(descriptionBlock, footer);
    } else 
    {
      element.appendChild(descriptionBlock);
    }

  
    if(!this.PatientId)
    {
      alert("Patient ID is not available. Please select a patient and come back");
    }

    //const toBeSent = element.innerHTML;

const toBeSent = {
    HeaderFilename:  this.headerFileName,
    FooterFilename: this.footerFileName,
    HtmlContent: element.innerHTML,
    PopupContent:  descriptionBlock.innerHTML ,
    PatientId:this.PatientId
  };
    
  
      debugger
    try {
      this.doctorservice.GeneratePDF(toBeSent).subscribe({
        next: (blob: Blob) =>
           {
            
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = "Generated.pdf";
          link.click();
          window.URL.revokeObjectURL(url);
                this.isGeneratingPDF = false;

        },
        error: err => {
          console.error("PDF download failed", err);
                this.isGeneratingPDF = false;

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
            this.isGeneratingPDF = false;

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

getFormattedDate(inputDate?: string, flag?: string): string {
  let dateObj: Date;

  if (flag === 'modify' && inputDate) {
    dateObj = new Date(inputDate);
  } else {
    dateObj = new Date();
  }

  const dd = String(dateObj.getDate()).padStart(2, '0');
  const mm = String(dateObj.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const yy = String(dateObj.getFullYear()) // Last two digits of year

  return `${dd}-${mm}-${yy}`;
}


headerFileName:any;
footerFileName:any;

 async GetHeaderFooter()
   {
    try {
      // Send formData to the backend API
      const response = this.hospitalservice.GetHeaderFooter().subscribe({
        next: (response: any) => {
          console.log(response);
          if (response.status == 200) {
           debugger
            this.headerFileName = response.result[0]?.headerName;
            
            this.footerFileName = response.result[0]?.footerName;
        
          } else if (response.status == 500) {
            this.showToast('error', 'Internal server error', '');
          }
        },
        error: (error: any) => {
          console.error('Error:', error);
          if (error.status == 401) {
            this.router.navigate(['/login'])
          }
        } 
      }); 
    } catch (error: any) {
      console.error('Error:', error);
    }

  }


}