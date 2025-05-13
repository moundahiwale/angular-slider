import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  ChangeDetectorRef,
  HostListener,
} from '@angular/core';

@Component({
  selector: 'app-user-slider',
  templateUrl: './user-slider.component.html',
  styleUrls: ['./user-slider.component.scss'],
  imports: [CommonModule],
})
export class UserSliderComponent implements AfterViewInit, OnDestroy {
  users = [
    { name: 'Alice Johnson', email: 'alice@example.com' },
    { name: 'Bob Smith', email: 'bob@example.com' },
    { name: 'Charlie Rose', email: 'charlie@example.com' },
    { name: 'Johnson', email: 'alice@example.com' },
    { name: 'Smith', email: 'bob@example.com' },
    { name: 'Rose', email: 'charlie@example.com' },
  ];

  currentIndex = 0;
  containerWidth = 0;
  ready = false;
  isMobile = false;

  @ViewChild('viewport') viewportRef!: ElementRef<HTMLDivElement>;
  private resizeObserver!: ResizeObserver;

  get usersPerView(): number {
    return this.isMobile ? 1 : Math.min(this.users.length, 3);
  }

  constructor(private _cdr: ChangeDetectorRef) {
    this.checkMobile();
  }

  @HostListener('window:resize')
  checkMobile() {
    const wasMobile = this.isMobile;
    this.isMobile = window.innerWidth <= 768;
    
    // Reset index when any breakpoint change occurs
    if (this.isMobile !== wasMobile) {
      this.currentIndex = 0;
      this.updateContainerWidth();
      this._cdr.detectChanges();
    }
  }

  ngAfterViewInit(): void {
    this.resizeObserver = new ResizeObserver(() => {
      this.updateContainerWidth();
    });
    
    this.resizeObserver.observe(this.viewportRef.nativeElement);
    this.updateContainerWidth();
    this._cdr.detectChanges();
  }

  updateContainerWidth(): void {
    const el = this.viewportRef.nativeElement;
    this.containerWidth = el.offsetWidth;
    this.ready = true;
  }

  nextUser(): void {
    if (this.currentIndex < this.users.length - this.usersPerView) {
      this.currentIndex++;
    }
  }

  prevUser(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  ngOnDestroy(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }
}
