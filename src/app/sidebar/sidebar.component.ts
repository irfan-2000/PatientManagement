import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent 
{
  isSidebarOpen = true; // Controls sidebar visibility
  activeMenu: string | null = null; // Tracks active menu
  openSubmenu: string | null = null; // Tracks open submenu
  activeSubmenu: string | null = null; // Tracks active submenu item

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  handleMenuClick(menu: string) {
    if (this.activeMenu === menu) {
      this.activeMenu = null;
      this.openSubmenu = null;
    } else {
      this.activeMenu = menu;
      this.openSubmenu =
        menu === 'departments' || menu === 'reports' ? menu : null;
    }
  }

  handleSubmenuClick(submenu: string) {
    this.activeSubmenu = this.activeSubmenu === submenu ? null : submenu;
  }





}
