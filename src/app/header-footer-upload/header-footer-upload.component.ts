import { Component } from '@angular/core';
import { Router } from '@angular/router';

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

  constructor(private router: Router) { }

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


 


}
