import {Component, Input, EventEmitter, Output} from '@angular/core';
import {IONIC_DIRECTIVES, ModalController, NavController} from 'ionic-angular';
import {NetworkStateModal} from '../../../modals/network-state/network-state';
import {CloudWidgetContentComponent} from './content/cloud-widget-content';
import {AnalyticsService} from '../../../services/analytics/analytics.service';
import {WidgetsService} from '../widgets.service';
import {categoryEnum} from '../../../config/constants';
import {CloudPage} from '../../../pages/products/cloud/cloud';
import {TasksModal} from '../../../modals/tasks/tasks';
import {CloudService} from '../../../pages/products/cloud/cloud.service';

@Component({
  selector: 'cloud-widget',
  templateUrl: 'build/components/widgets/cloud-widget/cloud-widget.html',
  directives: [IONIC_DIRECTIVES, CloudWidgetContentComponent],
  providers: [WidgetsService, CloudService]
})
export class CloudWidgetComponent {
  @Input() serviceName: string;
  @Input() reload: boolean;
  @Output() remove: EventEmitter<any> = new EventEmitter();

  constructor(private widgetsService: WidgetsService, private analytics: AnalyticsService, private modalCtrl: ModalController,
      public cloudService: CloudService, public navController: NavController) {
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

  moreInfos(): void {
    this.navController.push(CloudPage, {serviceName: this.serviceName});
  }

  openTasks(): void {
    let tasksModal = this.modalCtrl.create(TasksModal, { serviceName: this.serviceName, service: this.cloudService });
    tasksModal.present();
  }
}
