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

  constructor(){
    const url = location.pathname
    const active = url.split('/')[1] || url.split('/')[0];
    this.activeMenu = active;
    this.activeSubmenu = active;
    this.openActiveMenuByDefault(active)
    this.getNavClasses(this.activeMenu)
    this.getNavClassesForSubmenu(this.activeSubmenu)
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  openActiveMenuMapper = {
    patientsMenu: ['patients', 'addeditpatient']
  }
  openActiveMenuByDefault(menu:string){
    if(this.openActiveMenuMapper.patientsMenu.includes(menu)){
      this.activeMenu = 'patientsMenu';
      this.openSubmenu = 'patientsMenu'
    }
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
        menu === 'departments' || menu === 'reports' || menu === 'patientsMenu' ? menu : null;
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
      'text-gray-700 hover:bg-[#ccdae7]': this.activeMenu !== menu,
      'bg-[#004687] text-white': this.activeMenu === menu
    };
  }

  getNavClassesForSubmenu(submenu: string)
  {
    return {
      'flex items-center p-2 rounded-lg transition-all duration-100': true,
      'text-gray-700 hover:bg-[#ccdae7]': this.activeSubmenu !== submenu,
      'bg-[#004687] text-white': this.activeSubmenu === submenu
    };
  }
}
