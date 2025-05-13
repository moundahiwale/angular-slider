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
    { name: 'Johnson', email: 'Johnson@example.com' },
    { name: 'Smith', email: 'Smith@example.com' },
    { name: 'Rose', email: 'Rose@example.com' },
  ];

  currentIndex = 0;
  containerWidth = 0;
  ready = false;
  isMobile = false;
  Math = Math;

  @ViewChild('viewport') viewportRef!: ElementRef<HTMLDivElement>;
  @ViewChild('prevButton') prevButton!: ElementRef<HTMLButtonElement>;
  @ViewChild('nextButton') nextButton!: ElementRef<HTMLButtonElement>;
  private resizeObserver!: ResizeObserver;

  get usersPerView(): number {
    return this.isMobile ? 1 : Math.min(this.users.length, 3);
  }

  constructor(private _cdr: ChangeDetectorRef) {
    this.checkMobile();
  }

  isVisible(index: number): boolean {
    const endIndex = this.currentIndex + this.usersPerView;
    return index >= this.currentIndex && index < endIndex;
  }

  @HostListener('window:resize')
  checkMobile() {
    const wasMobile = this.isMobile;
    this.isMobile = window.innerWidth <= 768;

    if (this.isMobile !== wasMobile) {
      this.currentIndex = 0;
      this.updateContainerWidth();
      // Add timeout to ensure DOM update
      setTimeout(() => this._cdr.detectChanges(), 50);
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
      this.moveScreenReaderFocus('next');
    }
  }

  prevUser(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.moveScreenReaderFocus('prev');
    }
  }

  private moveScreenReaderFocus(direction: 'next' | 'prev'): void {
    setTimeout(() => {
      // Get first visible user card
      const firstVisibleIndex = this.currentIndex;
      const cardElement = document.getElementById(
        `user-card-${firstVisibleIndex}`
      );

      if (cardElement) {
        // Add temporary tabindex for focus
        cardElement.setAttribute('tabindex', '-1');
        cardElement.focus();
        // Remove tabindex after blur
        cardElement.addEventListener(
          'blur',
          () => {
            cardElement.removeAttribute('tabindex');
          },
          { once: true }
        );
      } else {
        // Fallback to focus button
        if (direction === 'next') {
          this.nextButton.nativeElement.focus();
        } else {
          this.prevButton.nativeElement.focus();
        }
      }
    }, 100); // Allow time for DOM update
  }

  ngOnDestroy(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }
}
