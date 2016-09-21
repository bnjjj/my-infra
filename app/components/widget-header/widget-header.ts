import {Component, Input, Output, EventEmitter} from '@angular/core';
import {IONIC_DIRECTIVES, ModalController} from 'ionic-angular';
import {NetworkStateModal} from '../../modals/network-state/network-state';

@Component({
  selector: 'widget-header',
  templateUrl: 'build/components/widget-header/widget-header.html',
  directives: [IONIC_DIRECTIVES]
})
export class WidgetHeaderComponent {
  @Input() serviceName: string;
  @Input() state: string;
  @Input() category: any;
  @Input() loading: boolean;
  @Input() showWorks: boolean = false;
  @Output() updateCollapse: EventEmitter<any> = new EventEmitter();

  constructor(private modalCtrl: ModalController) {

  }

  getStatusClass() {
    switch (this.state) {
      case 'enabled':
        return 'green-color';
      case 'disabled':
        return 'danger-color';
      default:
        return 'danger-color';
    }
  }

  openNetworkStateModal(): void {
    let profileModal = this.modalCtrl.create(NetworkStateModal, { category: this.category.workId, categoryName: this.category.text });
    profileModal.present();
  }
}
