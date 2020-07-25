import {
  Directive,
  // ElementRef,
  OnInit,
  // Renderer2,
  HostListener,
  HostBinding,
} from '@angular/core';

@Directive({
  selector: '[appDropdown]',
})
export class DropdownDirective implements OnInit {
  @HostListener('mouseleave') mouseLeave(): void {
    // this.renderer.removeClass(
    //   this.elementRef.nativeElement,
    //   'dropdown-visible'
    // );
    this.dropdownVisible = false;
  }

  @HostBinding('class.dropdown-visible') dropdownVisible = false;

  @HostListener('click') click(): void {
    // this.renderer.addClass(this.elementRef.nativeElement, 'dropdown-visible');
    this.dropdownVisible = true;
  }

  // constructor(private elementRef: ElementRef, private renderer: Renderer2) {}
  constructor() {}

  ngOnInit(): void {}
}
