import {Component, Input, EventEmitter, Output, ViewChild} from '@angular/core';
import {IONIC_DIRECTIVES, ModalController, Nav} from 'ionic-angular';
import {NetworkStateModal} from '../../../modals/network-state/network-state';
import {WebWidgetContentComponent} from './content/web-widget-content';
import {AnalyticsService} from '../../../services/analytics/analytics.service';
import {WidgetsService} from '../widgets.service';
import {categoryEnum} from '../../../config/constants';

@Component({
  selector: 'web-widget',
  templateUrl: 'build/components/widgets/web-widget/web-widget.html',
  directives: [IONIC_DIRECTIVES, WebWidgetContentComponent],
  providers: [WidgetsService]
})
export class WebWidgetComponent {
  @Input() serviceName: string;
  @Input() reload: boolean;
  @Output() remove: EventEmitter<any> = new EventEmitter();
  @ViewChild(Nav) nav: Nav;

  constructor(private widgetsService: WidgetsService, private analytics: AnalyticsService, private modalCtrl: ModalController) {
    this.analytics.trackView('Web-widget');
  }

  openNetworkStateModal(): void {
    let profileModal = this.modalCtrl.create(NetworkStateModal, { category: '4', categoryName: 'web' });
    profileModal.present();
  }

  removeMe(): void {
    let handler = () => this.remove.emit({ serviceName: this.serviceName, url: categoryEnum.WEB.url });
    let alert = this.widgetsService.getDeleteAlert(this.serviceName, handler);

    alert.present();
  }
}
