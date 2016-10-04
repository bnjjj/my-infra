import {Component, Input, EventEmitter, Output} from '@angular/core';
import {IONIC_DIRECTIVES, ModalController, NavController} from 'ionic-angular';
import {NetworkStateModal} from '../../../modals/network-state/network-state';
import {WebWidgetContentComponent} from './content/web-widget-content';
import {AnalyticsService} from '../../../services/analytics/analytics.service';
import {WidgetsService} from '../widgets.service';
import {categoryEnum} from '../../../config/constants';
import {TasksModal} from '../../../modals/tasks/tasks';
import {HostingWebService} from '../../../pages/products/hosting-web/hosting-web.service';
import {HostingWebPage} from '../../../pages/products/hosting-web/hosting-web';
import {WidgetFooterComponent} from '../../../components/widget-footer/widget-footer';

@Component({
  selector: 'web-widget',
  templateUrl: 'build/components/widgets/web-widget/web-widget.html',
  directives: [IONIC_DIRECTIVES, WebWidgetContentComponent, WidgetFooterComponent],
  providers: [WidgetsService, HostingWebService]
})
export class WebWidgetComponent {
  @Input() serviceName: string;
  @Input() reload: boolean;
  @Output() remove: EventEmitter<any> = new EventEmitter();

  constructor(private widgetsService: WidgetsService, private analytics: AnalyticsService,
    private modalCtrl: ModalController, public navController: NavController, public hostingWebService: HostingWebService) {
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

  moreInfos(): void {
    this.navController.push(HostingWebPage, {serviceName: this.serviceName});
  }

  openTasks(): void {
    let tasksModal = this.modalCtrl.create(TasksModal, { serviceName: this.serviceName, service: this.hostingWebService });
    tasksModal.present();
  }
}
