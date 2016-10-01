import {Component, Input, OnInit} from '@angular/core';
import {IONIC_DIRECTIVES} from 'ionic-angular';

@Component({
  selector: 'state-label',
  template: `
    <div>
      <ion-badge *ngIf="displaySuccess"
        class="capitalize"
        [innerText]="status"
        secondary>
      </ion-badge>
      <ion-badge *ngIf="displayError"
        class="capitalize"
        [innerText]="status"
        danger>
      </ion-badge>
      <ion-badge *ngIf="!displayError && !displaySuccess"
        [innerText]="status">
      </ion-badge>
    </div>
  `,
  directives: [IONIC_DIRECTIVES]
})
export class StateLabelComponent implements OnInit {
  @Input() status: string;
  @Input() success: Array<string> = [];
  @Input() error: Array<string> = [];

  displaySuccess: boolean = false;
  displayError: boolean = false;

  constructor() {

  }

  ngOnInit() {
    this.displaySuccess = this.success.indexOf(this.status) !== -1;
    this.displayError = this.error.indexOf(this.status) !== -1;
  }
}
