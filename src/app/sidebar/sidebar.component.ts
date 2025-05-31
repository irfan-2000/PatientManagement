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
  isSidebarOpen = false; // Controls sidebar visibility
  activeMenu: string | null = null; // Tracks active menu
  openSubmenu: string | null = null; // Tracks open submenu
  activeSubmenu: string | null = null; // Tracks active submenu item

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  handleMenuClick(menu: string)   
  {
    if (this.activeMenu === menu) 
    {
      this.activeMenu = null;
      this.openSubmenu = null;
    } else 
    {
      this.activeMenu = menu;
      this.openSubmenu =
        menu === 'departments' || menu === 'reports' ? menu : null;
    }
  }

  handleSubmenuClick(submenu: string) 
  {
    this.activeSubmenu = this.activeSubmenu === submenu ? null : submenu;
  }

  getNavClasses(menu: string)
  {
    return {
      'flex items-center p-2 rounded-lg transition-all duration-100': true,
      'text-gray-700 hover:bg-blue-50': this.activeMenu !== menu,
      'bg-blue-500 text-white': this.activeMenu === menu
    };
  }



}
