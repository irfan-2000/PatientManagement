import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';  // <-- Import FormsModule



@Component({
  selector: 'app-doctor',
  standalone: false,
  
  templateUrl: './doctor.component.html',
  styleUrl: './doctor.component.css'
})
export class DoctorComponent 
{

  filters = { id: '', name: '', clinic: '', email: '', mobile: '', specialization: '', status: '' };

  showForm = false;

  searchtxt: any = '';
  doctors = [
    {
      id: 1,
      name: 'Dr. John Doe',
      img: 'doctors/d1.jpg', // Replace with actual image URL
      clinic: 'City Health Clinic',
      email: 'john.doe@example.com',
      mobile: '+1234567890',
      specialization: 'Cardiologist',
      status: 'Active'
    },
    {
      id: 2,
      name: 'Dr. Sarah Smith',
      img: 'doctors/d2.jpg',
      clinic: 'Green Valley Hospital',
      email: 'sarah.smith@example.com',
      mobile: '+0987654321',
      specialization: 'Dermatologist',
      status: 'InActive'
    }
  ];

  doctor = {
    name: '',
    email: '',
    specialization: '',
    img: '',
    qualifications: [''],
    acceptedTerms: false
  };

  specializations = ['Cardiologist', 'Dermatologist', 'Neurologist', 'Orthopedic'];

  addQualification() {
    this.doctor.qualifications.push('');
  }

  removeQualification(index: number) {
    this.doctor.qualifications.splice(index, 1);
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.doctor.img = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onFileImport(event: any) {
    const file = new FileReader();
    // Handle file import
  }

  submitForm() {
    if (!this.doctor.acceptedTerms) {
      alert("Please accept the terms & conditions.");
      return;
    }
    
    console.log("Submitted Data:", this.doctor);
    this.showForm = !this.showForm;
  }

  cancelForm() {
    // Clearing all the entered data
    this.doctor = {
      name: '',
      email: '',
      specialization: '',
      img: '',
      qualifications: [''],
      acceptedTerms: false
    };

    this.showForm = !this.showForm;
  }


}
