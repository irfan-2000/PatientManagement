import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HospitalServiceService } from '../hospital-service.service';
import { TokenService } from '../services/token.service';
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
  currentLoggedInRole: any = null;

  constructor(private hospitalservice: HospitalServiceService, private tokenService: TokenService) {
    const url = location.pathname
    const active = url.split('/')[1] || url.split('/')[0];
    this.activeMenu = active;
    this.activeSubmenu = active;
    this.openActiveMenuByDefault(active)
    this.getNavClasses(this.activeMenu)
    this.getNavClassesForSubmenu(this.activeSubmenu)
    this.GetHeaderFooter();
    this.currentLoggedInRole = this.tokenService.decodeToken().Role
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
    const decodedData = this.tokenService.decodeToken()
    console.log("reh dec", decodedData)
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

  LogoFile :any
   GetHeaderFooter()
   {
    try {
       const response = this.hospitalservice.GetHeaderFooter().subscribe({
        next: (response: any) => {
          console.log(response);
          if (response.status == 200)
             {
               
              this.LogoFile =  response.result[0]?.logoURL;
           
          }  
        },
        error: (error: any) => 
          {
          console.error('Error:', error);
        
        } 
      }); 
    } catch (error: any) {
      console.error('Error:', error);
    }

  }

}
