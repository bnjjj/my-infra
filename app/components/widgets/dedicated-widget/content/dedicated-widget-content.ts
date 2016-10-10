import {Component, Input, EventEmitter, Output, OnChanges, OnInit, SimpleChange, ViewChild} from '@angular/core';
import {IONIC_DIRECTIVES, ModalController, Nav} from 'ionic-angular';
import {TaskDetailsDedicatedComponent} from '../task-details/task-details';
import {WidgetsService} from '../../widgets.service';
import {WidgetHeaderComponent} from '../../../widget-header/widget-header';
import {categoryEnum} from '../../../../config/constants';
import {DedicatedServerService} from '../../../../pages/products/dedicated-server/dedicated-server.service';

@Component({
  selector: 'dedicated-widget-content',
  templateUrl: 'build/components/widgets/dedicated-widget/content/dedicated-widget-content.html',
  directives: [IONIC_DIRECTIVES, TaskDetailsDedicatedComponent, WidgetHeaderComponent],
  providers: [DedicatedServerService, WidgetsService]
})
export class DedicatedWidgetContentComponent implements OnChanges, OnInit {
  @Input() serviceName: string;
  @Input() reload: boolean;
  @Input() collapsed: boolean;
  @Input() showWorks: boolean = false;
  @Output() collapsedChange: EventEmitter<any> = new EventEmitter();
  @ViewChild(Nav) nav: Nav;
  viewMode: string = 'general';
  loading: boolean;
  tasksLoaded: boolean = false;
  emptyTasks: boolean;
  server: any = {};
  error: any;
  tasks: Array<any> = [];
  constants = categoryEnum.DEDICATED_SERVER;

  constructor(private dedicatedServerService: DedicatedServerService, private widgetsService: WidgetsService, private modalCtrl: ModalController) {

  }

  ngOnInit(): void {
    this.getInfos();
  }

  getInfos(): void {
    this.loading = true;
    Promise.all([this.dedicatedServerService.getInfos(this.serviceName).toPromise(), this.dedicatedServerService.getServiceInfos(this.serviceName).toPromise()])
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
      this.dedicatedServerService.getTasks(this.serviceName).toPromise()
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

  updateCollapse(): void {
    this.collapsed = !this.collapsed;
    this.collapsedChange.emit(this.collapsed);
  }
}
