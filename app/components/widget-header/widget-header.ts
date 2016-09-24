import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy} from '@angular/core';
import {IONIC_DIRECTIVES, ModalController} from 'ionic-angular';
import {NetworkStateModal} from '../../modals/network-state/network-state';

@Component({
  selector: 'widget-header',
  template:
  `<ion-item class="widget-header">
    <ion-avatar item-left (click)="updateCollapse.emit()">
      <i [class]="category.icon + ' fa-2x'"></i>
    </ion-avatar>
    <div (click)="updateCollapse.emit()">
      <p [innerText]="category.text"></p>
      <h2 [innerText]="serviceName"></h2>
    </div>
    <ion-avatar class="center-flex" item-right *ngIf="state != null">
      <i class="fa fa-circle" [ngClass]="getStatusClass()" aria-hidden="true"></i>
    </ion-avatar>
    <button outline item-right class="button-white outline-white" (click)="openNetworkStateModal()" *ngIf="showWorks">
      <i class="fa fa-heartbeat fa-1x"></i>
    </button>
  </ion-item>`,
  directives: [IONIC_DIRECTIVES],
  changeDetection: ChangeDetectionStrategy.OnPush
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
      case 'maintenance':
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
