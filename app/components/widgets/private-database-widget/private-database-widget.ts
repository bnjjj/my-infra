import {Component, Input, EventEmitter, Output, ViewChild} from '@angular/core';
import {IONIC_DIRECTIVES, ModalController, Nav} from 'ionic-angular';
import {NetworkStateModal} from '../../../modals/network-state/network-state';
import {PrivateDatabaseWidgetContentComponent} from './content/private-database-widget-content';
import {AnalyticsService} from '../../../services/analytics/analytics.service';
import {WidgetsService} from '../widgets.service';
import {categoryEnum} from '../../../config/constants';

@Component({
  selector: 'private-database-widget',
  templateUrl: 'build/components/widgets/private-database-widget/private-database-widget.html',
  directives: [IONIC_DIRECTIVES, PrivateDatabaseWidgetContentComponent],
  providers: [WidgetsService]
})
export class PrivateDatabaseWidgetComponent {
  @Input() serviceName: string;
  @Input() reload: boolean;
  @Output() remove: EventEmitter<any> = new EventEmitter();
  @ViewChild(Nav) nav: Nav;

  constructor(private widgetsService: WidgetsService, private analytics: AnalyticsService, private modalCtrl: ModalController) {
    this.analytics.trackView('Private-database-widget');
  }

  openNetworkStateModal(): void {
    let profileModal = this.modalCtrl.create(NetworkStateModal, { category: '4', categoryName: 'private-database' });
    profileModal.present();
  }

  removeMe(): void {
    let handler = () => this.remove.emit({ serviceName: this.serviceName, url: categoryEnum.PRIVATE_DATABASE.url});
    let alert = this.widgetsService.getDeleteAlert(this.serviceName, handler);

    alert.present();
  }
}
