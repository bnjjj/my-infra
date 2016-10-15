import {Component, Input, EventEmitter, Output} from '@angular/core';
import {IONIC_DIRECTIVES, ModalController, NavController} from 'ionic-angular';
import {NetworkStateModal} from '../../../modals/network-state/network-state';
import {PrivateDatabaseWidgetContentComponent} from './content/private-database-widget-content';
import {AnalyticsService} from '../../../services/analytics/analytics.service';
import {WidgetsService} from '../widgets.service';
import {categoryEnum} from '../../../config/constants';
import {WidgetFooterComponent} from '../../../components/widget-footer/widget-footer';
import {PrivateDatabasePage} from '../../../pages/products/private-database/private-database';
import {TasksModal} from '../../../modals/tasks/tasks';
import {PrivateDatabaseService} from '../../../pages/products/private-database/private-database.service';

@Component({
  selector: 'private-database-widget',
  templateUrl: 'build/components/widgets/private-database-widget/private-database-widget.html',
  directives: [IONIC_DIRECTIVES, PrivateDatabaseWidgetContentComponent, WidgetFooterComponent],
  providers: [WidgetsService, PrivateDatabaseService]
})
export class PrivateDatabaseWidgetComponent {
  @Input() serviceName: string;
  @Input() reload: boolean;
  @Output() remove: EventEmitter<any> = new EventEmitter();

  constructor(private widgetsService: WidgetsService, private analytics: AnalyticsService, private modalCtrl: ModalController,
      public navController: NavController, public privateDatabaseService: PrivateDatabaseService) {
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

  moreInfos(): void {
    this.navController.push(PrivateDatabasePage, {serviceName: this.serviceName});
  }

  openTasks(): void {
    let tasksModal = this.modalCtrl.create(TasksModal, { serviceName: this.serviceName, service: this.privateDatabaseService });
    tasksModal.present();
  }
}
