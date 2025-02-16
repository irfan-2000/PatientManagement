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
  @Output() selectionChange = new EventEmitter<string[]>();

  private elementRef = inject(ElementRef);
  isDropdownVisible = false;
  filteredItems: any[] = [];
  selectedItems: string[] = [];

  ngOnInit() 
  {
    this.filteredItems = [...this.items];
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isDropdownVisible = false;
    }
  }

  filterItems(event: Event) {
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredItems = this.items.filter(item => 
      item.Name.toLowerCase().includes(searchTerm)
    );
  }

  toggleItem(item: any) {
    const itemName = item.Name;
    const index = this.selectedItems.indexOf(itemName);
    
    if (index === -1) {
      this.selectedItems.push(itemName);
    } else {
      this.selectedItems.splice(index, 1);
    }
    
    this.selectionChange.emit([...this.selectedItems]);
  }

  showDropDown() {
    this.isDropdownVisible = true;
  }

  removeItem(itemName: string, event: MouseEvent) {
    event.stopPropagation();
    const index = this.selectedItems.indexOf(itemName);
    
    if (index > -1) {
      this.selectedItems.splice(index, 1);
      this.selectionChange.emit([...this.selectedItems]);
    }
  }


}
