import { Component, Input, EventEmitter, Output, ViewChild } from '@angular/core';
import { IONIC_DIRECTIVES, ModalController, NavController } from 'ionic-angular';
import { TasksModal } from '../../../modals/tasks/tasks';
import { WidgetsService } from '../widgets.service';
import { AnalyticsService } from '../../../services/analytics/analytics.service';
import { SmsWidgetContentComponent } from './content/sms-widget-content';
import { categoryEnum } from '../../../config/constants';
import { SmsPage } from '../../../pages/products/sms/sms';
import { WidgetFooterComponent } from '../../../components/widget-footer/widget-footer';
import { SmsService } from '../../../pages/products/sms/sms.service';

@Component({
  selector: 'sms-widget',
  templateUrl: 'build/components/widgets/sms-widget/sms-widget.html',
  directives: [IONIC_DIRECTIVES, SmsWidgetContentComponent, WidgetFooterComponent],
  providers: [WidgetsService, SmsService]
})
export class SmsWidgetComponent {
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
    private smsService: SmsService
  ) {
    this.analytics.trackView('Sms-widget');
  }

  removeMe(): void {
    let handler = () => this.remove.emit({
      serviceName: this.serviceName,
      url: categoryEnum.SMS.url
    });
    let alert = this.widgetsService.getDeleteAlert(this.serviceName, handler);

    alert.present();
  }

  moreInfos(): void {
    this.navController.push(SmsPage, { serviceName: this.serviceName });
  }

  openTasks(): void {
    let tasksModal = this.modalCtrl.create(TasksModal, {
      serviceName: this.serviceName,
      service: this.smsService
    });
    tasksModal.present();
  }
}
