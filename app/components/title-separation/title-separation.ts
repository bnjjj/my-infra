import {Component, Input, EventEmitter, Output} from '@angular/core';
import {IONIC_DIRECTIVES} from 'ionic-angular';

@Component({
  selector: 'title-separation',
  templateUrl: 'build/components/title-separation/title-separation.html',
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

