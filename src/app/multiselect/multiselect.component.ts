import { Component, ElementRef, HostListener, inject, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'app-multiselect',
  standalone: false,
  templateUrl: './multiselect.component.html',
  styleUrl: './multiselect.component.css'
})
export class MultiselectComponent
{
  @Input() items: any[] = [];

  @Input() DoctorSpecializations:any[] = []; // Array of items to select from

  @Input() Selecteditems : any[] = []; // Array of selected item IDs 

  @Input() placeholder: String = "Select items";
  
  @Output() selectionChange = new EventEmitter<string[]>();
  
  @Input() isEditing: boolean = false; // Editing mode, defaults to false
  
  @Input() Allitems :any[] =[];

  private elementRef = inject(ElementRef);
  isDropdownVisible = false;
  filteredItems: any[] = [];
  selectedItems: string[] = [];
  
constructor()
{
  
  
} 


 

  ngOnInit() 
  { 
     
this.selectedItems = [...this.Selecteditems]; // Initialize selected items from input
  this.filteredItems = [...this.items]; // Initialize filtered items from input
  this.isDropdownVisible = false; // Dropdown is initially hidden
 
   
  if(this.isEditing)
{ 
  this.filteredItems = [...this.DoctorSpecializations]
  this.filteredItems.forEach((item) =>
     {
    this.toggleItem(item);
  });
}

}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) 
  {
     
    if (!this.elementRef.nativeElement.contains(event.target))
       {
      this.isDropdownVisible = false;
    }
  }

  filterItems(event: Event) 
  {
    
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredItems = this.items.filter(item => 
      item.name.toLowerCase().includes(searchTerm)
    );
    const ids = this.filteredItems.map(item => item.id);
    console.log("Duplicate IDs:", ids.filter((id, index) => ids.indexOf(id) !== index));
    
  }

  toggleItem(item: any) 
  {
     
    const itemName = item.name;
    const index = this.selectedItems.indexOf(itemName);
    
    if (index === -1) 
    {
      this.selectedItems.push(itemName);
    } else {
      this.selectedItems.splice(index, 1);
    }
    
    this.selectionChange.emit([...this.selectedItems]);
  }

  trackByFn(index: number, item: any): any 
  {
    return item.id; // Ensure each item has a unique 'id'
  }

  showDropDown() 
  {
    this.isDropdownVisible = true;
  }

  removeItem(itemName: string, event: MouseEvent) 
  {
    event.stopPropagation();
    const index = this.selectedItems.indexOf(itemName);
    
    if (index > -1) {
      this.selectedItems.splice(index, 1);
      this.selectionChange.emit([...this.selectedItems]);
    }
  }


}
