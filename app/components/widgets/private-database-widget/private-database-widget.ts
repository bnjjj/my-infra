import {Component, Input, EventEmitter, Output, OnChanges, OnInit, SimpleChange} from 'angular2/core';
import {IONIC_DIRECTIVES, Modal, NavController, Alert} from 'ionic-angular';
import {NetworkStateModal} from '../../../modals/network-state/network-state';
import {PrivateDatabaseWidgetContentComponent} from './content/private-database-widget-content';
import {AnalyticsService} from '../../../services/analytics/analytics.service';
import {WidgetsService} from '../widgets.service';

@Component({
  selector: 'private-database-widget',
  templateUrl: 'build/components/widgets/private-database-widget/private-database-widget.html',
  directives: [IONIC_DIRECTIVES, PrivateDatabaseWidgetContentComponent],
  providers: [WidgetsService]
})
export class PrivateDatabaseWidgetComponent {
  @Input() serviceName: string;
  @Input() reload: boolean;
  @Output() remove: EventEmitter<string> = new EventEmitter();

  constructor(private widgetsService: WidgetsService, private nav: NavController, private analytics: AnalyticsService) {
    this.analytics.trackView('Private-databse-widget');
  }

  openNetworkStateModal(): void {
    let profileModal = Modal.create(NetworkStateModal, { category: '4', categoryName: 'private-database' });
    this.nav.present(profileModal);
  }

  removeMe(): void {
    let handler = () => this.remove.emit(this.serviceName);
    let alert = this.widgetsService.getDeleteAlert(this.serviceName, handler);

    this.nav.present(alert);
  }
}
