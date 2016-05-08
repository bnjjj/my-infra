import {Toast} from 'ionic-native';
import {Page, Modal, NavController} from 'ionic-angular';
import {WebWidgetComponent} from '../../components/widgets/web-widget/web-widget';
import {DomainWidgetComponent} from '../../components/widgets/domain-widget/domain-widget';
import {DedicatedWidgetComponent} from '../../components/widgets/dedicated-widget/dedicated-widget';
import {VpsWidgetComponent} from '../../components/widgets/vps-widget/vps-widget';
import {ProjectWidgetComponent} from '../../components/widgets/project-widget/project-widget';
import {WidgetAddModal} from '../../modals/widget-add/widget-add';
import {AnalyticsService} from '../../services/analytics/analytics.service';
import {categoryEnum} from '../../config/constants';

@Page({
  templateUrl: 'build/pages/dashboard/dashboard.html',
  directives: [WebWidgetComponent, DomainWidgetComponent, DedicatedWidgetComponent, ProjectWidgetComponent, VpsWidgetComponent]
})
export class DashboardPage {
  widgets: Array<any> = [];
  reload: boolean = false;
  CategoryEnum: any = categoryEnum;

  constructor(private nav: NavController, private analytics: AnalyticsService) {
    this.widgets = JSON.parse(localStorage.getItem('widgets')) || [];
    this.analytics.trackView('Dashboard');
  }

  addWidgetModal(): void {
    let addModal = Modal.create(WidgetAddModal, {widgets: this.widgets});
    addModal.onDismiss(data => {
       this.addWidget(data);
     });
    this.nav.present(addModal);
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

  removeWidget(serviceName: string): void {
    this.widgets = this.widgets.filter(widget => widget.serviceName !== serviceName);
    localStorage.setItem('widgets', JSON.stringify(this.widgets));
  }
}
