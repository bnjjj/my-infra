import {Component, Input, EventEmitter, Output, OnChanges, OnInit, SimpleChange} from 'angular2/core';
import {IONIC_DIRECTIVES, Modal, NavController, Alert} from 'ionic-angular';
import {NetworkStateModal} from '../../../../modals/network-state/network-state';
import {DomainWidgetService} from './../domain-widget.service';
import {WidgetsService} from '../../widgets.service';

@Component({
  selector: 'domain-widget-content',
  templateUrl: 'build/components/widgets/domain-widget/content/domain-widget-content.html',
  directives: [IONIC_DIRECTIVES],
  providers: [DomainWidgetService, WidgetsService]
})
export class DomainWidgetContentComponent implements OnChanges, OnInit {
  @Input() serviceName: string;
  @Input() collapsed: boolean;
  @Input() reload: boolean;
  @Input() showWorks: boolean = false;
  @Output() collapsedChange: EventEmitter<boolean> = new EventEmitter();
  viewMode: string = 'general';
  loading: boolean;
  tasksLoaded: boolean = false;
  emptyTasks: boolean;
  domain: any;
  error: any;
  tasks: Array<any> = [];

  constructor(private domainWidgetService: DomainWidgetService, private widgetsService: WidgetsService, private nav: NavController) {

  }

  ngOnInit(): void {
    this.getInfos();
  }

  getInfos(): void {
    this.loading = true;
    Promise.all([this.domainWidgetService.getInfos(this.serviceName), this.domainWidgetService.getServiceInfos(this.serviceName)])
      .then(resp => {
        this.domain = Object.assign({}, resp[0], resp[1]);
        this.loading = false;
      })
      .catch(err => {
        this.error = err;
        this.loading = false;
      });
  }

  getTasks(): void {
    if (!this.tasksLoaded) {
      this.loading = true;
      this.domainWidgetService.getTasks(this.serviceName)
        .then(tasks => {
          this.emptyTasks = !tasks.length;
          this.tasks = tasks;
          this.loading = false;
          this.tasksLoaded = true;
        }, err => {
          this.error = err;
          this.loading = false;
        });
    }
  }

  ngOnChanges(changes: { [propName: string]: SimpleChange }): void {
    if (changes['reload'] && changes['reload'].currentValue !== changes['reload'].previousValue) {
      this.getInfos();
      this.tasksLoaded = false;
      if (this.viewMode === 'tasks') {
        this.getTasks();
      }
    }
  }

  openNetworkStateModal(): void {
    let profileModal = Modal.create(NetworkStateModal, { category: '1', categoryName: 'domaine' });
    this.nav.present(profileModal);
  }

  updateCollapse(): void {
    this.collapsed = !this.collapsed;
    this.collapsedChange.emit(this.collapsed);
  }
}
