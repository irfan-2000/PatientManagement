import { Component } from '@angular/core';

@Component({
  selector: 'app-receptionist',
  standalone: false,
  templateUrl: './receptionist.component.html',
  styleUrl: './receptionist.component.css'
})
export class ReceptionistComponent {

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
    receptionists = [
      {
        id: 4001,
        firstName: 'Sarah',
        lastName: 'Johnson',
        password: '********',
        gender: 'Female',
        dob: new Date('1992-05-15'),
        email: 'sarah.johnson@hospital.com',
        mobile: '9876543210',
        qualification: 'Bachelor in Administration',
        country: 'India',
        city: 'Mumbai',
        postalCode: '400001',
        fullAddress: '123 Main Street, Andheri West, Mumbai',
        status: 'Active',
        joiningDate: new Date('2023-01-15'),
        experience: 2,
        image: 'assets/images/sarah.jpg'
      },
      {
        id: 4002,
        firstName: 'Priya',
        lastName: 'Sharma',
        password: '********',
        gender: 'Female',
        dob: new Date('1988-03-22'),
        email: 'priya.sharma@hospital.com',
        mobile: '9876543211',
        qualification: 'Diploma in Office Management',
        country: 'India',
        city: 'Delhi',
        postalCode: '110001',
        fullAddress: '456 Business Center, Connaught Place, Delhi',
        status: 'Active',
        joiningDate: new Date('2022-08-20'),
        experience: 3,
        image: 'assets/images/priya.jpg'
      },
      {
        id: 4003,
        firstName: 'Rahul',
        lastName: 'Patel',
        password: '********',
        gender: 'Male',
        dob: new Date('1990-11-08'),
        email: 'rahul.patel@hospital.com',
        mobile: '9876543212',
        qualification: 'Bachelor in Commerce',
        country: 'India',
        city: 'Ahmedabad',
        postalCode: '380001',
        fullAddress: '789 Medical Complex, SG Highway, Ahmedabad',
        status: 'Inactive',
        joiningDate: new Date('2023-03-10'),
        experience: 1.5,
        image: 'assets/images/rahul.jpg'
      },
      {
        id: 4004,
        firstName: 'Anjali',
        lastName: 'Reddy',
        password: '********',
        gender: 'Female',
        dob: new Date('1995-07-12'),
        email: 'anjali.reddy@hospital.com',
        mobile: '9876543213',
        qualification: 'Master in Hospital Administration',
        country: 'India',
        city: 'Hyderabad',
        postalCode: '500001',
        fullAddress: '321 Healthcare Plaza, Banjara Hills, Hyderabad',
        status: 'Active',
        joiningDate: new Date('2023-06-01'),
        experience: 1,
        image: 'assets/images/anjali.jpg'
      },
      {
        id: 4005,
        firstName: 'Vikram',
        lastName: 'Singh',
        password: '********',
        gender: 'Male',
        dob: new Date('1987-09-25'),
        email: 'vikram.singh@hospital.com',
        mobile: '9876543214',
        qualification: 'Bachelor in Computer Applications',
        country: 'India',
        city: 'Bangalore',
        postalCode: '560001',
        fullAddress: '654 Tech Park, Electronic City, Bangalore',
        status: 'Active',
        joiningDate: new Date('2022-11-15'),
        experience: 4,
        image: 'assets/images/vikram.jpg'
      }
    ];

  addReceptionist() {
    console.log('Add Receptionist clicked');
  }

  editReceptionist(id: any) {
    console.log('Edit receptionist:', id);
  }

  deleteReceptionist(id: any) {
    console.log('Delete receptionist:', id);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-IN');
  }

}
