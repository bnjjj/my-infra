import {Component, OnInit, Input} from 'angular2/core';
import {IONIC_DIRECTIVES} from 'ionic-angular';

@Component({
  selector: 'status-details',
  templateUrl: 'build/components/widgets/cloud-widget/status-details/status-details.html',
  directives: [IONIC_DIRECTIVES]
})
export class StatusDetailsComponent implements OnInit {
  @Input() inSuccess: Array<any> = [];
  @Input() inOther: Array<any> = [];
  @Input() inError: Array<any> = [];

  displayInError: boolean = false;
  displayInSuccess: boolean = false;
  displayInOther: boolean = false;

  constructor() {

  }

  display(type: string) {
    switch (type) {
      case 'SUCCESS':
        this.displayInSuccess = !this.displayInSuccess;
        this.displayInOther = false;
        this.displayInError = false;
        break;
      case 'OTHER':
        this.displayInSuccess = false;
        this.displayInOther = !this.displayInOther;
        this.displayInError = false;
        break;
      case 'ERROR':
        this.displayInSuccess = false;
        this.displayInOther = false;
        this.displayInError = !this.displayInError;
        break;
    }
  }

  ngOnInit() {

  }

}