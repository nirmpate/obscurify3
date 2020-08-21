import { Directive, AfterViewInit, Output, EventEmitter, OnInit, AfterViewChecked, AfterContentInit } from '@angular/core';

@Directive({
  selector: '[spyOn]'
})
export class SpyOnDirective implements OnInit {

  @Output() loaded = new EventEmitter<{}>();

  constructor() { }

  ngOnInit() {
    this.loaded.next(true);
  }
}
