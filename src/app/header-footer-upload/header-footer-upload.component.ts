import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DoctorServiceService } from '../doctor-service.service';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-header-footer-upload',
  standalone: false,
  templateUrl: './header-footer-upload.component.html',
  styleUrl: './header-footer-upload.component.css'
})
export class HeaderFooterUploadComponent {
  headerPreview: string | ArrayBuffer | null = null;
  footerPreview: string | ArrayBuffer | null = null;
  logoPreview: string | ArrayBuffer | null = null;
  headerFileName: string | null = null;
  footerFileName: string | null = null;
  logoFileName: string | null = null;
  existingheaderFileName: string | null = null;
  existingfooterFileName: string | null = null;
  existinglogoFileName: string | null = null;
  headerError: string | null = null;
  footerError: string | null = null;
  logoError: string | null = null;
  headerFooterForm: FormGroup;
  headerFile:any;
  footerFile:any
  logoFile:any

  constructor(private router: Router, private toastr: ToastrService, private doctorservice: DoctorServiceService) {
    this.GetHeaderFooter();

    this.headerFooterForm = new FormGroup({
      headerImage: new FormControl(null),
      footerImage: new FormControl(null),
      logoImage: new FormControl(null)
    });


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
      this.headerFile = file;
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
      this.footerFile = file
      this.footerFileName = file.name;
      const reader = new FileReader();
      reader.onload = () => this.footerPreview = reader.result;
      reader.readAsDataURL(file);
    }
  }

  onLogoChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    this.logoError = null;
    if (file) {
      if (!file.type.startsWith('image/')) {
        this.logoError = 'Only image files are supported.';
        this.logoFileName = null;
        this.logoPreview = null;
        return;
      }
      this.logoFile = file
      this.logoFileName = file.name;
      const reader = new FileReader();
      reader.onload = () => this.logoPreview = reader.result;
      reader.readAsDataURL(file);
    }
  }

  onSubmit(flag:any) {

    if(flag != 'I'){
      const confirmation = confirm("Are you sure to delete the file?")
      if(!confirmation) return;
    }
    console.log('Reh submit header footer', this);

    const formData = new FormData();
    formData.append('existingheaderfilename', this.existingheaderFileName||'')
    formData.append('existingfooterfilename', this.existingfooterFileName||'')
    formData.append('existinglogofilename', this.existinglogoFileName||'')

    if (this.headerFile instanceof File) {
      formData.append('header', this.headerFile);
    }

    if (this.footerFile instanceof File) {
      formData.append('footer', this.footerFile);
    }

    if (this.logoFile instanceof File) {
      formData.append('logo', this.logoFile);
    }
    formData.append('flag', flag);

    try {
      this.doctorservice.UploadHeaderFooter(formData).subscribe({
        next: (response: any) => {
          if (response.status == 200) {
            console.log("reh sub", response)
            this.showToast('success', 'Upload successful','')
            setTimeout(()=>{
              location.reload()
            },1000)
          }
          if (response.status == 500) {
            this.showToast('error', "Internal server error", "");
          }


        },
        error: (error: any) => {

          console.log(error);
          if (error.status == 401) {
          } else if (error.status == 500 && error.error) {

          }
          else {
            console.error('Unhandled API error:', error);
          }
        },
      });
    } catch (error: any) {
      console.error('API error:', error);
    }

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



  GetHeaderFooter() {
    try {
      // Send formData to the backend API
      const response = this.doctorservice.GetHeaderFooter().subscribe({
        next: (response: any) => {
          console.log(response);
          if (response.status == 200) {
            this.headerPreview = response.result[0]?.headerURL || null;
            this.headerFileName = response.result[0]?.headerName;
            this.existingheaderFileName = response.result[0]?.headerName;
            this.footerPreview = response.result[0]?.footerURL || null;
            this.footerFileName = response.result[0]?.footerName;
            this.existingfooterFileName = response.result[0]?.footerName;
            this.logoPreview = response.result[0]?.logoURL || null;
            this.logoFileName = response.result[0]?.logoName;
            this.existinglogoFileName = response.result[0]?.logoName;
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
