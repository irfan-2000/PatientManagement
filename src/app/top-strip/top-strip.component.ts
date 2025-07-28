import { Component } from '@angular/core';
import { TokenService } from '../services/token.service';

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

  constructor(private tokenService: TokenService) {
    this.getUserName()
  }

  userName: any = "test"
  tokenData:any = {};

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  getUserName() {
    let tokenData =  this.tokenService.decodeToken();
    this.userName = tokenData.Name;
  }
}
