import {Component, Input, EventEmitter, Output, OnChanges, OnInit, SimpleChange} from 'angular2/core';
import {IONIC_DIRECTIVES, Modal, NavController, Alert} from 'ionic-angular';
import {NetworkStateModal} from '../../../../modals/network-state/network-state';
import {DedicatedWidgetService} from '../dedicated-widget.service';
import {TaskDetailsDedicatedComponent} from '../task-details/task-details';
import {WidgetsService} from '../../widgets.service';

@Component({
  selector: 'dedicated-widget-content',
  templateUrl: 'build/components/widgets/dedicated-widget/content/dedicated-widget-content.html',
  directives: [IONIC_DIRECTIVES, TaskDetailsDedicatedComponent],
  providers: [DedicatedWidgetService, WidgetsService]
})
export class DedicatedWidgetContentComponent implements OnChanges, OnInit {
  @Input() serviceName: string;
  @Input() reload: boolean;
  @Input() collapsed: boolean;
  @Input() showWorks: boolean = false;
  @Output() collapsedChange: EventEmitter<boolean> = new EventEmitter();
  viewMode: string = 'general';
  loading: boolean;
  tasksLoaded: boolean = false;
  emptyTasks: boolean;
  server: any;
  error: any;
  tasks: Array<any> = [];
  constructor(private dedicatedWidgetService: DedicatedWidgetService, private widgetsService: WidgetsService, private nav: NavController) {

  }

  ngOnInit(): void{
    this.getInfos();
  }

  getInfos(): void {
    this.loading = true;
    Promise.all([this.dedicatedWidgetService.getInfos(this.serviceName), this.dedicatedWidgetService.getServiceInfos(this.serviceName)])
      .then(resp => {
        this.server = Object.assign({}, resp[0], resp[1]);
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
      this.dedicatedWidgetService.getTasks(this.serviceName)
        .then(tasks => {
          this.emptyTasks = tasks.length === 0;
          this.tasks = tasks;
        })
        .then(() => {
          this.tasksLoaded = true;
          this.loading = false;
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
    let profileModal = Modal.create(NetworkStateModal, { category: '5', categoryName: 'serveur dédié' });
    this.nav.present(profileModal);
  }

  updateCollapse(): void {
    this.collapsed = !this.collapsed;
    this.collapsedChange.emit(this.collapsed);
  }
}
