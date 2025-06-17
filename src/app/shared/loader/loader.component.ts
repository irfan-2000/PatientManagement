import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-loader',
  standalone: false,
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.css',
})
export class LoaderComponent implements OnChanges{
  @Input() size: string = '35'; // spinner size

  loaderSize: any = 'w-[35px] h-[35px]';

  ngOnChanges(changes: SimpleChanges): void {
    this.calculateSize();
  }

  calculateSize() {
    const calcSize = `w-[${this.size}px] h-[${this.size}px]`;
    this.loaderSize = calcSize;
  }

}
