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
import {WidgetAddModal} from '../../modals/widget-add/widget-add';
import {AnalyticsService} from '../../services/analytics/analytics.service';
import {categoryEnum} from '../../config/constants';

@Component({
  templateUrl: 'build/pages/dashboard/dashboard.html',
  directives: [WebWidgetComponent, DomainWidgetComponent,
    DedicatedWidgetComponent, ProjectWidgetComponent,
    VpsWidgetComponent, PrivateDatabaseWidgetComponent,
    CloudWidgetComponent, TitleSeparationComponent
  ]
})
export class DashboardPage {
  widgets: Array<any> = [];
  reload: boolean = false;
  CategoryEnum: any = categoryEnum;

  constructor(private analytics: AnalyticsService, private nav: NavController, private modalCtrl: ModalController) {
    this.widgets = JSON.parse(localStorage.getItem('widgets')) || [];
    this.analytics.trackView('Dashboard');
  }

  addWidgetModal(type: string): void {
    let addModal = this.modalCtrl.create(WidgetAddModal, {widgets: this.widgets, type});
    addModal.onDidDismiss(data => {
       this.addWidget(data);
    });

    addModal.present();
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
