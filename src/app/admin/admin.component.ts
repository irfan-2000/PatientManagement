import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin',
  standalone: false,
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  adminForm:FormGroup;
  // Hospital Name | From date | To Date | Address | Description | Contact no | Email | status (radio input) | Password.
  constructor(){
    this.adminForm = new FormGroup({
      HospitalName: new FormControl('Hosptest', Validators.required),
      FromDate: new FormControl('', Validators.required),
      ToDate: new FormControl('', Validators.required),
      Full_Address: new FormControl('', Validators.required),
      Description: new FormControl('Some desc', Validators.required),
      Mobile: new FormControl('7847051616', [
        Validators.required,
        Validators.pattern('^[0-9]{10}$'),  // Only allows 10 digits
        Validators.maxLength(10)
      ]),//new Date().toISOString().split('T')[0]
      Email: new FormControl('irfan@gmail.com', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")
      ]),
      Password: new FormControl('', Validators.required),
      IsActive: new FormControl(true, Validators.required), // Default to true (Active)
    });

  }

  showForm: Boolean = false;
  errorMessages: any = {};
  filters: any = {
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    qualification: '',
    status: '',
  }

  // Sample data - replace with actual API call
  admins = [
    {
      id: 5001,
      fromDate: new Date('2023-01-01'),
      toDate: new Date('2024-12-31'),
      hospitalName: 'Apollo Hospital',
      address: '21, Greams Lane, Off Greams Road, Chennai, Tamil Nadu 600006',
      description: 'Multi-specialty tertiary care hospital with advanced medical facilities',
      contactNo: '044-28296000',
      email: 'admin.apollo@apollohospitals.com',
      status: 'Active',
      password: 'Admin@123'
    },
    {
      id: 5002,
      fromDate: new Date('2022-06-15'),
      toDate: new Date('2025-06-14'),
      hospitalName: 'Fortis Healthcare',
      address: 'Sector 62, Phase VIII, Mohali, Punjab 160062',
      description: 'Leading healthcare provider with comprehensive medical services',
      contactNo: '0172-5066000',
      email: 'admin.fortis@fortishealthcare.com',
      status: 'Active',
      password: 'Fortis@456'
    },
    {
      id: 5003,
      fromDate: new Date('2021-03-10'),
      toDate: new Date('2024-03-09'),
      hospitalName: 'Max Healthcare',
      address: '1, Press Enclave Road, Saket, New Delhi 110017',
      description: 'Premium healthcare network with state-of-the-art medical technology',
      contactNo: '011-26515050',
      email: 'admin.max@maxhealthcare.com',
      status: 'Inactive',
      password: 'Max@789'
    },
    {
      id: 5004,
      fromDate: new Date('2023-08-01'),
      toDate: new Date('2026-07-31'),
      hospitalName: 'Manipal Hospital',
      address: '98, Rustom Bagh, Airport Road, Bangalore, Karnataka 560017',
      description: 'Comprehensive healthcare services with expert medical professionals',
      contactNo: '080-25023344',
      email: 'admin.manipal@manipalhospitals.com',
      status: 'Active',
      password: 'Manipal@321'
    },
    {
      id: 5005,
      fromDate: new Date('2022-12-01'),
      toDate: new Date('2025-11-30'),
      hospitalName: 'AIIMS Delhi',
      address: 'Ansari Nagar, New Delhi 110029',
      description: 'Premier medical institute providing advanced healthcare and medical education',
      contactNo: '011-26588500',
      email: 'admin.aiims@aiims.edu',
      status: 'Active',
      password: 'AIIMS@654'
    }
  ];

  numbersOnly(event: KeyboardEvent) {
    const input = event.key;

    if (!/^[0-9]$/.test(input)) {
      event.preventDefault();
    }
  }

  addAdmin() {
    console.log('Add Admin clicked');
    this.showForm = true
  }

  editAdmin(admin: any) {
    console.log('Edit admin:', admin);
  }

  deleteAdmin(admin: any) {
    console.log('Delete admin:', admin);
  }

  updateAdminStatus(admin: any) {
    console.log('Admin status updated:', admin);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-IN');
  }

  submitAdminForm(){
    console.log("reh admin submit")
  }
}
