import {Component, Input, EventEmitter, Output} from '@angular/core';
import {IONIC_DIRECTIVES} from 'ionic-angular';

@Component({
  selector: 'title-separation',
  template: `
    <ion-item-divider>
      <ng-content></ng-content>
      <button (click)="actionRequested()" *ngIf="buttonVisible" item-right>
        <ion-icon class="icon-size" ios="ios-add-circle-outline" md="ios-add-circle-outline"></ion-icon>
      </button>
    </ion-item-divider>
  `,
  directives: [IONIC_DIRECTIVES]
})
export class TitleSeparationComponent {
  @Input() buttonVisible: boolean = false;
  @Output() action: EventEmitter<any> = new EventEmitter();

  constructor() {

  }

  actionRequested() {
    this.action.emit({});
  }
}
