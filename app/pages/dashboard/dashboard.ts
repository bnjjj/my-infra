import {ModalController, NavController} from 'ionic-angular';
import {Component} from '@angular/core';
import {WebWidgetComponent} from '../../components/widgets/web-widget/web-widget';
import {TitleSeparationComponent} from '../../components/title-separation/title-separation';
import {PrivateDatabaseWidgetComponent} from '../../components/widgets/private-database-widget/private-database-widget';
import {DomainWidgetComponent} from '../../components/widgets/domain-widget/domain-widget';
import {DedicatedWidgetComponent} from '../../components/widgets/dedicated-widget/dedicated-widget';
import {VpsWidgetComponent} from '../../components/widgets/vps-widget/vps-widget';
import {CloudWidgetComponent} from '../../components/widgets/cloud-widget/cloud-widget';
import {ProjectWidgetComponent} from '../../components/widgets/project-widget/project-widget';
import {OvhAlertComponent} from '../../components/ovh-alert/ovh-alert';
import {WidgetAddModal} from '../../modals/widget-add/widget-add';
import {AnalyticsService} from '../../services/analytics/analytics.service';
import {AlertsService, OvhAlert} from '../../services/alerts/alerts.service';
import {MeService} from '../../services/me/me.service';
import {categoryEnum} from '../../config/constants';

@Component({
  templateUrl: 'build/pages/dashboard/dashboard.html',
  directives: [WebWidgetComponent, DomainWidgetComponent,
    DedicatedWidgetComponent, ProjectWidgetComponent,
    VpsWidgetComponent, PrivateDatabaseWidgetComponent,
    CloudWidgetComponent, TitleSeparationComponent,
    OvhAlertComponent
  ]
})
export class DashboardPage {
  widgets: Array<any> = [];
  alerts: Array<OvhAlert> = [];
  reload: boolean = false;
  loading: any = {
    alerts: false
  };
  CategoryEnum: any = categoryEnum;

  constructor(private analytics: AnalyticsService, private nav: NavController, private modalCtrl: ModalController,
      private meService: MeService, public alertsService: AlertsService) {
    this.widgets = JSON.parse(localStorage.getItem('widgets')) || [];
    this.analytics.trackView('Dashboard');
    this.getAlerts();
  }

  addWidgetModal(type?: string): void {
    let addModal = this.modalCtrl.create(WidgetAddModal, {widgets: this.widgets, type});
    addModal.onDidDismiss(data => {
       this.addWidget(data);
    });

    addModal.present();
  }

  getAlerts(): void {
    this.alerts = [];
    this.loading.alerts = true;

    this.meService.getSlas()
      .subscribe((slas) => {
        if (Array.isArray(slas) && slas.length) {
          this.alerts.push(this.alertsService.getSLA(slas));
        }
        this.loading.alerts = false;
      });

    this.meService.getContactChange('validatingByCustomers')
      .subscribe((contactChanges) => {
        if (Array.isArray(contactChanges) && contactChanges.length) {
          this.alerts.push(this.alertsService.getContact(contactChanges));
        }
        this.loading.alerts = false;
      });

    this.meService.getDomainTasks('error')
      .subscribe((domainTasks) => {
        if (Array.isArray(domainTasks) && domainTasks.length) {
          this.alerts.push(this.alertsService.getDomainTasks(domainTasks));
        }
        this.loading.alerts = false;
      });

    this.meService.getAmount()
      .subscribe((debt) => {
        if (debt.value < 0) {
          this.alerts.push(this.alertsService.getDebt(debt));
        }
        this.loading.alerts = false;
      });
  }

  addProjectModal(): void {
    this.addWidgetModal('PROJECT');
  }

  doRefresh(refresher): void {
    this.reload = !this.reload;
    setTimeout(() => {
      refresher.complete();
    }, 300);
  }

  addWidget(data: any): void {
    if (data.category) {
      this.widgets.push(Object.assign({}, data, {order: this.widgets.length}));
    }

    localStorage.setItem('widgets', JSON.stringify(this.widgets));
  }

  removeWidget(widgetInfos: any): void {
    this.widgets = this.widgets.filter(widget => widget.serviceName !== widgetInfos.serviceName || widget.category.url !== widgetInfos.url);
    localStorage.setItem('widgets', JSON.stringify(this.widgets));
  }

  filterAlert(alertType: any) {
    this.alerts = this.alerts.filter((alert) => alert.type !== alertType);
  }
}
