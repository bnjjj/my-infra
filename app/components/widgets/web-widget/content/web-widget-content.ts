import {Component, Input, EventEmitter, Output, OnChanges, OnInit, SimpleChange} from 'angular2/core';
import {IONIC_DIRECTIVES, Modal, NavController, Alert} from 'ionic-angular';
import {NetworkStateModal} from '../../../../modals/network-state/network-state';
import {WebWidgetService} from '../web-widget.service';
import {WidgetsService} from '../../widgets.service';
import {TaskDetailsWebComponent} from '../task-details/task-details';

@Component({
  selector: 'web-widget-content',
  templateUrl: 'build/components/widgets/web-widget/content/web-widget-content.html',
  directives: [IONIC_DIRECTIVES, TaskDetailsWebComponent],
  providers: [WebWidgetService, WidgetsService]
})
export class WebWidgetContentComponent implements OnChanges, OnInit {
  @Input() serviceName: string;
  @Input() showWorks: boolean = false;
  @Input() reload: boolean;
  @Input() collapsed: boolean;
  @Output() collapsedChange: EventEmitter<any> = new EventEmitter();

  server: any = {};
  loading: boolean;
  viewMode: string = 'general';
  tasksLoaded: boolean = false;
  emptyTasks: boolean;
  error: any;
  tasks: Array<any> = [];

  constructor(private webWidgetService: WebWidgetService, private widgetsService: WidgetsService, private nav: NavController) {

  }

  ngOnInit(): void {
    this.getInfos();
  }

  getInfos(): void {
    this.loading = true;
    Promise.all([this.webWidgetService.getInfos(this.serviceName), this.webWidgetService.getServiceInfos(this.serviceName)])
      .then(resp => {
        this.server = Object.assign(resp[0], resp[1]);;
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
      this.webWidgetService.getTasks(this.serviceName)
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
    let profileModal = Modal.create(NetworkStateModal, { category: '4', categoryName: 'hébergement web' });
    this.nav.present(profileModal);
  }

  updateCollapse(): void {
    this.collapsed = !this.collapsed;
    this.collapsedChange.emit(this.collapsed);
  }
}
