import {Component, Input} from '@angular/core';
import {IONIC_DIRECTIVES} from 'ionic-angular';

@Component({
  selector: 'async-box',
  templateUrl: 'build/components/async-box/async-box.html',
  directives: [IONIC_DIRECTIVES]
})
export class AsyncBoxComponent {
  @Input() loading: boolean;

  constructor() {

  }
}
