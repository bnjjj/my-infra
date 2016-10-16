import {Component, Input, EventEmitter, Output} from '@angular/core';
import {IONIC_DIRECTIVES} from 'ionic-angular';

@Component({
  selector: 'title-separation',
  template: `
    <ion-item-divider (click)="!hideCollapse && collapseElement()">
      <ion-icon *ngIf="!hideCollapse" [ios]="collapsed ? 'ios-arrow-down-outline' : 'ios-arrow-up-outline'" [md]="collapsed ? 'ios-arrow-down-outline' : 'ios-arrow-up-outline'"></ion-icon>
      <ng-content></ng-content>
      <button (click)="actionRequested($event)" *ngIf="buttonVisible" item-right>
        <ion-icon class="icon-size" ios="ios-add-circle-outline" md="ios-add-circle-outline"></ion-icon>
      </button>
    </ion-item-divider>
  `,
  directives: [IONIC_DIRECTIVES]
})
export class TitleSeparationComponent {
  @Input() buttonVisible: boolean = false;
  @Input() hideCollapse: boolean = false;
  @Output() action: EventEmitter<any> = new EventEmitter();
  @Output() collapse: EventEmitter<any> = new EventEmitter();
  collapsed: boolean = true;

  constructor() {

  }

  actionRequested(event) {
    event.stopPropagation();
    this.action.emit({});
  }

  collapseElement() {
    this.collapsed = !this.collapsed;
    this.collapse.emit(this.collapsed);
  }
}
