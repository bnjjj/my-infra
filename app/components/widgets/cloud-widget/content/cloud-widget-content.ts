import {Component, Input, EventEmitter, Output, OnChanges, OnInit, SimpleChange} from 'angular2/core';
import {IONIC_DIRECTIVES, Modal, NavController, Alert} from 'ionic-angular';
import {NetworkStateModal} from '../../../../modals/network-state/network-state';
import {CloudWidgetService} from '../cloud-widget.service';
import {WidgetsService} from '../../widgets.service';
import {TaskDetailsCloudComponent} from '../task-details/task-details';
import {StatusDetailsComponent} from '../status-details/status-details';

@Component({
  selector: 'cloud-widget-content',
  templateUrl: 'build/components/widgets/cloud-widget/content/cloud-widget-content.html',
  directives: [IONIC_DIRECTIVES, StatusDetailsComponent, TaskDetailsCloudComponent],
  providers: [CloudWidgetService, WidgetsService]
})
export class CloudWidgetContentComponent implements OnChanges, OnInit {
  @Input() serviceName: string;
  @Input() showWorks: boolean = false;
  @Input() reload: boolean;
  @Input() collapsed: boolean;
  @Output() collapsedChange: EventEmitter<boolean> = new EventEmitter();

  cloud: any = {};
  loading: boolean;
  viewMode: string = 'general';
  tasksLoaded: boolean = false;
  emptyTasks: boolean;
  error: any;
  tasks: Array<any> = [];

  constructor(private cloudWidgetService: CloudWidgetService, private widgetsService: WidgetsService, private nav: NavController) {

  }

  ngOnInit(): void {
    this.getInfos();
  }

  getInfos(): void {
    this.loading = true;
    Promise.all([this.cloudWidgetService.getInfos(this.serviceName), this.cloudWidgetService.getServiceInfos(this.serviceName),
        this.cloudWidgetService.getInstances(this.serviceName), this.cloudWidgetService.getSnapshots(this.serviceName)
      ])
      .then(resp => {
        this.cloud = Object.assign(resp[0], resp[1], resp[2], resp[3]);;
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
      this.cloudWidgetService.getTasks(this.serviceName)
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
    let profileModal = Modal.create(NetworkStateModal, { category: '18', categoryName: 'Cloud' });
    this.nav.present(profileModal);
  }

  updateCollapse(): void {
    this.collapsed = !this.collapsed;
    this.collapsedChange.emit(this.collapsed);
  }
}
