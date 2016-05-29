import {WidgetsService} from '../widgets.service';
import {NetworkStateModal} from '../../../modals/network-state/network-state';
import {Component, Input, Output, EventEmitter} from 'angular2/core';
import {AnalyticsService} from '../../../services/analytics/analytics.service';
import {IONIC_DIRECTIVES, NavController} from 'ionic-angular';
import {WebWidgetContentComponent} from '../web-widget/content/web-widget-content';
import {PrivateDatabaseWidgetContentComponent} from '../private-database-widget/content/private-database-widget-content';
import {DomainWidgetContentComponent} from '../domain-widget/content/domain-widget-content';
import {DedicatedWidgetContentComponent} from '../dedicated-widget/content/dedicated-widget-content';
import {VpsWidgetContentComponent} from '../vps-widget/content/vps-widget-content';
import {CloudWidgetContentComponent} from '../cloud-widget/content/cloud-widget-content';
import {categoryEnum} from '../../../config/constants';

@Component({
  selector: 'project-widget',
  templateUrl: 'build/components/widgets/project-widget/project-widget.html',
  directives: [IONIC_DIRECTIVES, WebWidgetContentComponent,
    DomainWidgetContentComponent, DedicatedWidgetContentComponent,
    VpsWidgetContentComponent, PrivateDatabaseWidgetContentComponent,
    CloudWidgetContentComponent
  ],
  providers: [WidgetsService]
})
export class ProjectWidgetComponent {
  @Input() project: any;
  @Input() reload: boolean;
  @Output() remove: EventEmitter<any> = new EventEmitter();
  collapsed: boolean = false;

  constructor(private widgetsService: WidgetsService, private nav: NavController, private analytics: AnalyticsService) {
    this.analytics.trackView('Widget-project');
  }

  removeMe(): void {
    let handler = () => this.remove.emit({ serviceName: this.project.serviceName, url: categoryEnum.PROJECT.url });
    let alert = this.widgetsService.getDeleteAlert(this.project.serviceName, handler);

    this.nav.present(alert);
  }
}
