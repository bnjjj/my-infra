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
  alerts: Array<any> = [];
  reload: boolean = false;
  CategoryEnum: any = categoryEnum;

  constructor(private analytics: AnalyticsService, private nav: NavController, private modalCtrl: ModalController, private meService: MeService) {
    this.widgets = JSON.parse(localStorage.getItem('widgets')) || [];
    this.analytics.trackView('Dashboard');
    this.getAlerts();
  }

  addWidgetModal(type: string): void {
    let addModal = this.modalCtrl.create(WidgetAddModal, {widgets: this.widgets, type});
    addModal.onDidDismiss(data => {
       this.addWidget(data);
    });

    addModal.present();
  }

  getAlerts(): void {
    this.alerts = [];

    this.meService.getSlas()
      .subscribe((slas) => {
        if (Array.isArray(slas) && slas.length) {
          this.alerts.push({
            name: 'Réduction SLA',
            description: `Vous avez droit à ${slas.length} réduction(s) SLA`,
            link: 'https://www.ovh.com/manager/web/#/billing/sla'
          });
        }
      });

    this.meService.getContactChange('validatingByCustomers')
      .subscribe((contactChanges) => {
        if (Array.isArray(contactChanges) && contactChanges.length) {
          this.alerts.push({
            name: 'Changement de contact',
            description: `Vous avez ${contactChanges.length} demande(s) de contact en attente de votre approbation`,
            link: 'https://www.ovh.com/manager/web/#/useraccount/contacts?tab=REQUESTS'
          });
        }
      });

    this.meService.getDomainTasks('error')
      .subscribe((domainTasks) => {
        if (Array.isArray(domainTasks) && domainTasks.length) {
          this.alerts.push({
            name: 'Opérations domaines',
            description: `Vous avez ${domainTasks.length} opération(s) en erreur sur des domaines`,
            link: 'https://www.ovh.com/manager/web/index.html#/configuration/domains_operations'
          });
        }
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
}
