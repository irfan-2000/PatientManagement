import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DoctorServiceService } from '../doctor-service.service';

@Component({
  selector: 'app-header-footer-upload',
  standalone: false,
  templateUrl: './header-footer-upload.component.html',
  styleUrl: './header-footer-upload.component.css'
})
export class HeaderFooterUploadComponent {
  headerPreview: string | ArrayBuffer | null = null;
  footerPreview: string | ArrayBuffer | null = null;
  headerFileName: string | null = null;
  footerFileName: string | null = null;
  headerError: string | null = null;
  footerError: string | null = null;

  constructor(private router: Router, private toastr: ToastrService, private doctorservice: DoctorServiceService) { 
    this.GetHeaderFooter();
  }

  onHeaderChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    this.headerError = null;
    if (file) {
      if (!file.type.startsWith('image/')) {
        this.headerError = 'Only image files are supported.';
        this.headerFileName = null;
        this.headerPreview = null;
        return;
      }
      this.headerFileName = file.name;
      const reader = new FileReader();
      reader.onload = () => this.headerPreview = reader.result;
      reader.readAsDataURL(file);
    }
  }

  onFooterChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    this.footerError = null;
    if (file) {
      if (!file.type.startsWith('image/')) {
        this.footerError = 'Only image files are supported.';
        this.footerFileName = null;
        this.footerPreview = null;
        return;
      }
      this.footerFileName = file.name;
      const reader = new FileReader();
      reader.onload = () => this.footerPreview = reader.result;
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    console.log('Reh submit header footer');
  }

  onCancel() {
    this.router.navigate(['/course']);
  }

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



  GetHeaderFooter() 
  {
      try {
      // Send formData to the backend API
      const response = this.doctorservice.GetHeaderFooter().subscribe({
        next: (response: any) => {
          console.log(response);
          if (response.status == 200) 
            {
            // this.showToast('success', 'Your session has been deleted!', '');
                // this,this.GetDoctorSessions();
                console.log("reh get Header footer", response)
              
       
          } else if (response.status == 500)
             {
            this.showToast('error', 'Internal server error', '');
            }
        },
        error: (error: any) => {
          console.error('Error:', error);
          if(error.status == 401){
            // this.router.navigate(['/login'])
          }
        }


      });


    } catch (error: any) {
      console.error('Error:', error);
    }

  }




}
