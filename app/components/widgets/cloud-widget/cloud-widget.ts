import {Component, Input, EventEmitter, Output, ViewChild} from '@angular/core';
import {IONIC_DIRECTIVES, ModalController, Nav} from 'ionic-angular';
import {NetworkStateModal} from '../../../modals/network-state/network-state';
import {CloudWidgetContentComponent} from './content/cloud-widget-content';
import {AnalyticsService} from '../../../services/analytics/analytics.service';
import {WidgetsService} from '../widgets.service';
import {categoryEnum} from '../../../config/constants';

@Component({
  selector: 'cloud-widget',
  templateUrl: 'build/components/widgets/cloud-widget/cloud-widget.html',
  directives: [IONIC_DIRECTIVES, CloudWidgetContentComponent],
  providers: [WidgetsService]
})
export class CloudWidgetComponent {
  @Input() serviceName: string;
  @Input() reload: boolean;
  @ViewChild(Nav) nav: Nav;
  @Output() remove: EventEmitter<any> = new EventEmitter();

  constructor(private widgetsService: WidgetsService, private analytics: AnalyticsService, private modalCtrl: ModalController) {
    this.analytics.trackView('Cloud-widget');
  }

  openNetworkStateModal(): void {
    let profileModal = this.modalCtrl.create(NetworkStateModal, { category: '18', categoryName: 'Cloud' });
    profileModal.present();
  }

  removeMe(): void {
    let handler = () => this.remove.emit({ serviceName: this.serviceName, url: categoryEnum.CLOUD.url });
    let alert = this.widgetsService.getDeleteAlert(this.serviceName, handler);

    alert.present();
  }
}
