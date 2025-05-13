import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-user-slider',
  templateUrl: './user-slider.component.html',
  styleUrls: ['./user-slider.component.scss'],
  imports: [CommonModule]
})
export class UserSliderComponent {
  users = [
    { name: 'Alice Johnson', email: 'alice@example.com' },
    { name: 'Bob Smith', email: 'bob@example.com' },
    { name: 'Charlie Rose', email: 'charlie@example.com' }
  ];

  currentIndex = 0;
  containerWidth = 0;
  ready = false;

  @ViewChild('viewport') viewportRef!: ElementRef<HTMLDivElement>;

  ngAfterViewInit(): void {
    // Delay to ensure layout is rendered
    setTimeout(() => {
      this.containerWidth = this.viewportRef.nativeElement.offsetWidth;
      this.ready = true;
    });
  }

  nextUser(): void {
    if (this.currentIndex < this.users.length - 1) {
      this.currentIndex++;
    }
  }

  prevUser(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }
}
