import { Component, ElementRef, HostListener, inject, Input, Output, EventEmitter, OnInit, input } from '@angular/core';

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

  @Input() emitType: 'name'|'id' = 'name'

  @Input() itemId: string | null = null

  private elementRef = inject(ElementRef);
  isDropdownVisible = false;
  filteredItems: any[] = [];
  selectedItems: string[] = [];
  
constructor()
{
  
  
} 


 

  ngOnInit() 
  { 
     
this.selectedItems = [...new Set(this.Selecteditems)]; // Initialize selected items from input and remove duplicates
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
    const itemId = this.itemId ? item[this.itemId] : item.id;

    console.log("Reh id", item)

    if (this.emitType === 'name') {
      const index = this.selectedItems.indexOf(itemName);
      if (index === -1) {
        this.selectedItems.push(itemName);
      } else {
        this.selectedItems.splice(index, 1);
      }
    }
    if (this.emitType === 'id') {
      const indexId = this.selectedItems.indexOf(itemId);
      if (indexId === -1) {
        this.selectedItems.push(itemId);
      } else {
        this.selectedItems.splice(indexId, 1);
      }
    }
    
    // Remove any duplicates that might have been created
    this.selectedItems = [...new Set(this.selectedItems)];
    this.selectionChange.emit([...this.selectedItems]);
  }

  trackByFn(index: number, item: any): any 
  {
    // Return a unique identifier - use id if available, otherwise use name + index
    return item.id || `${item.name}_${index}`;
  }

  getDisplayName(selectedItem: string): string {
    if (this.emitType === 'name') {
      return selectedItem; // Already a name
    } else {
      // Find the item by ID and return its name
      const item = this.items.find(item => {
        const itemId = this.itemId ? item[this.itemId] : item.id;
        return itemId === selectedItem;
      });
      return item ? item.name : selectedItem; // Fallback to the ID if item not found
    }
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
