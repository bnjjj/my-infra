import {Component, Input, EventEmitter, Output, ViewChild} from '@angular/core';
import {IONIC_DIRECTIVES, ModalController, Nav, NavController} from 'ionic-angular';
import {NetworkStateModal} from '../../../modals/network-state/network-state';
import {WidgetsService} from '../widgets.service';
import {AnalyticsService} from '../../../services/analytics/analytics.service';
import {DomainWidgetContentComponent} from './content/domain-widget-content';
import {categoryEnum} from '../../../config/constants';
import {DomainPage} from '../../../pages/products/domain/domain';

@Component({
  selector: 'domain-widget',
  templateUrl: 'build/components/widgets/domain-widget/domain-widget.html',
  directives: [IONIC_DIRECTIVES, DomainWidgetContentComponent],
  providers: [WidgetsService]
})
export class DomainWidgetComponent {
  @Input() serviceName: string;
  @Input() reload: boolean;
  @Output() remove: EventEmitter<any> = new EventEmitter();
  @ViewChild(Nav) nav: Nav;
  viewMode: string = 'general';
  loading: boolean;

  constructor(private widgetsService: WidgetsService, private analytics: AnalyticsService,
      private modalCtrl: ModalController, private navController: NavController) {
    this.analytics.trackView('Domain-widget');
  }

  openNetworkStateModal(): void {
    let profileModal = this.modalCtrl.create(NetworkStateModal, { category: '1', categoryName: 'domaine' });
    profileModal.present();
  }

  removeMe(): void {
    let handler = () => this.remove.emit({ serviceName: this.serviceName, url: categoryEnum.DOMAIN.url});
    let alert = this.widgetsService.getDeleteAlert(this.serviceName, handler);

    alert.present();
  }

  moreInfos(): void {
    this.navController.push(DomainPage, {serviceName: this.serviceName});
  }
}
