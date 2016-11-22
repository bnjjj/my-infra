import { Component, Input, EventEmitter, Output } from '@angular/core';
import { IONIC_DIRECTIVES, ModalController, NavController } from 'ionic-angular';
import { TasksModal } from '../../../modals/tasks/tasks';
import { WidgetsService } from '../widgets.service';
import { AnalyticsService } from '../../../services/analytics/analytics.service';
import { PackXdslWidgetContentComponent } from './content/pack-xdsl-widget-content';
import { categoryEnum } from '../../../config/constants';
import { PackXdslPage } from '../../../pages/products/pack-xdsl/pack-xdsl';
import { WidgetFooterComponent } from '../../../components/widget-footer/widget-footer';
import { PackXdslService } from '../../../pages/products/pack-xdsl/pack-xdsl.service';

@Component({
  selector: 'pack-xdsl-widget',
  templateUrl: 'build/components/widgets/pack-xdsl-widget/pack-xdsl-widget.html',
  directives: [IONIC_DIRECTIVES, PackXdslWidgetContentComponent, WidgetFooterComponent],
  providers: [WidgetsService, PackXdslService]
})
export class PackXdslWidgetComponent {
  @Input() serviceName: string;
  @Input() reload: boolean;
  @Output() remove: EventEmitter<any> = new EventEmitter();

  viewMode: string = 'general';
  loading: boolean;

  constructor(
    private widgetsService: WidgetsService,
    private analytics: AnalyticsService,
    private modalCtrl: ModalController,
    private navController: NavController,
    private packXdslService: PackXdslService
  ) {
    this.analytics.trackView('Pack-xDSL-widget');
  }

  removeMe(): void {
    let handler = () => this.remove.emit({
      serviceName: this.serviceName,
      url: categoryEnum.PACK_XDSL.url
    });
    let alert = this.widgetsService.getDeleteAlert(this.serviceName, handler);

    alert.present();
  }

  moreInfos(): void {
    this.navController.push(PackXdslPage, { serviceName: this.serviceName });
  }

  openTasks(): void {
    let tasksModal = this.modalCtrl.create(TasksModal, {
      serviceName: this.serviceName,
      service: this.packXdslService
    });
    tasksModal.present();
  }
}
