import {Component, Input} from '@angular/core';
import {IONIC_DIRECTIVES} from 'ionic-angular';

@Component({
  selector: 'ovh-alert',
  templateUrl: 'build/components/ovh-alert/ovh-alert.html',
  directives: [IONIC_DIRECTIVES],
  providers: []
})
export class OvhAlertComponent {
  @Input() alertName: string;
  @Input() link: string;

  constructor() {

  }

  openLink() {
    window.open(this.link, '_blank');
  }

  close(event) {
    event.stopPropagation();
  }
}
