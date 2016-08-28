import {Component, Input, OnInit} from '@angular/core';
import {IONIC_DIRECTIVES} from 'ionic-angular';

@Component({
  selector: 'state-label',
  templateUrl: 'build/components/state-label/state-label.html',
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

