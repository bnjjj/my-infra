import {Component, Input} from '@angular/core';
import {IONIC_DIRECTIVES} from 'ionic-angular';

@Component({
  selector: 'async-box',
  template: `
    <ion-content text-center padding *ngIf="loading">
      <ion-spinner name="bubbles"></ion-spinner>
    </ion-content>
    <ng-content *ngIf="!loading"></ng-content>
  `,
  directives: [IONIC_DIRECTIVES]
})
export class AsyncBoxComponent {
  @Input() loading: boolean;

  constructor() {

  }
}
