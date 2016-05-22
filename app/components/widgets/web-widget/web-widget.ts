import {Component, Input, EventEmitter, Output, OnChanges, OnInit, SimpleChange} from 'angular2/core';
import {IONIC_DIRECTIVES, Modal, NavController, Alert} from 'ionic-angular';
import {NetworkStateModal} from '../../../modals/network-state/network-state';
import {WebWidgetContentComponent} from './content/web-widget-content';
import {AnalyticsService} from '../../../services/analytics/analytics.service';
import {WidgetsService} from '../widgets.service';
import {categoryEnum} from '../../../config/constants';

@Component({
  selector: 'web-widget',
  templateUrl: 'build/components/widgets/web-widget/web-widget.html',
  directives: [IONIC_DIRECTIVES, WebWidgetContentComponent],
  providers: [WidgetsService]
})
export class WebWidgetComponent {
  @Input() serviceName: string;
  @Input() reload: boolean;
  @Output() remove: EventEmitter<any> = new EventEmitter();

  constructor(private widgetsService: WidgetsService, private nav: NavController, private analytics: AnalyticsService) {
    this.analytics.trackView('Web-widget');
  }

  openNetworkStateModal(): void {
    let profileModal = Modal.create(NetworkStateModal, { category: '4', categoryName: 'web' });
    this.nav.present(profileModal);
  }

  removeMe(): void {
    let handler = () => this.remove.emit({ serviceName: this.serviceName, url: categoryEnum.WEB.url });
    let alert = this.widgetsService.getDeleteAlert(this.serviceName, handler);

    this.nav.present(alert);
  }
}
