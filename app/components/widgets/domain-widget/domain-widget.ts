import {Component, Input, EventEmitter, Output, ViewChild} from '@angular/core';
import {IONIC_DIRECTIVES, ModalController, Nav, NavController} from 'ionic-angular';
import {NetworkStateModal} from '../../../modals/network-state/network-state';
import {TasksModal} from '../../../modals/tasks/tasks';
import {WidgetsService} from '../widgets.service';
import {AnalyticsService} from '../../../services/analytics/analytics.service';
import {DomainWidgetContentComponent} from './content/domain-widget-content';
import {categoryEnum} from '../../../config/constants';
import {DomainPage} from '../../../pages/products/domain/domain';
import {WidgetFooterComponent} from '../../../components/widget-footer/widget-footer';
import {DomainService} from '../../../pages/products/domain/domain.service';

@Component({
  selector: 'domain-widget',
  templateUrl: 'build/components/widgets/domain-widget/domain-widget.html',
  directives: [IONIC_DIRECTIVES, DomainWidgetContentComponent, WidgetFooterComponent],
  providers: [WidgetsService, DomainService]
})
export class DomainWidgetComponent {
  @Input() serviceName: string;
  @Input() reload: boolean;
  @Output() remove: EventEmitter<any> = new EventEmitter();
  @ViewChild(Nav) nav: Nav;
  viewMode: string = 'general';
  loading: boolean;

  constructor(private widgetsService: WidgetsService, private analytics: AnalyticsService,
      private modalCtrl: ModalController, private navController: NavController, private domainService: DomainService) {
    this.analytics.trackView('Domain-widget');
  }

  openNetworkStateModal(): void {
    let networkModal = this.modalCtrl.create(NetworkStateModal, { category: '1', categoryName: 'domaine' });
    networkModal.present();
  }

  removeMe(): void {
    let handler = () => this.remove.emit({ serviceName: this.serviceName, url: categoryEnum.DOMAIN.url});
    let alert = this.widgetsService.getDeleteAlert(this.serviceName, handler);

    alert.present();
  }

  moreInfos(): void {
    this.navController.push(DomainPage, {serviceName: this.serviceName});
  }

  openTasks(): void {
    let tasksModal = this.modalCtrl.create(TasksModal, { serviceName: this.serviceName, service: this.domainService });
    tasksModal.present();
  }
}
