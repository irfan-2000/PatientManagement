import { Component } from '@angular/core';

@Component({
  selector: 'app-top-strip',
  standalone: false,
  templateUrl: './top-strip.component.html',
  styleUrl: './top-strip.component.css'
})
export class TopStripComponent {
  isDropdownOpen = false;
  username = 'Admin User';
  avatarUrl = 'doctors/defaultImage.jpg';

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
}
