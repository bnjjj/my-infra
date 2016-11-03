import { Component, Input, EventEmitter, Output, OnChanges, OnInit, SimpleChange, ViewChild } from '@angular/core';
import { IONIC_DIRECTIVES, ModalController, Nav } from 'ionic-angular';
import { TaskDetailsSmsComponent } from '../task-details/task-details';
import { SmsService } from '../../../../pages/products/sms/sms.service';
import { WidgetsService } from '../../widgets.service';
import { WidgetHeaderComponent } from '../../../widget-header/widget-header';
import { categoryEnum } from '../../../../config/constants';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'sms-widget-content',
  templateUrl: 'build/components/widgets/sms-widget/content/sms-widget-content.html',
  directives: [IONIC_DIRECTIVES, TaskDetailsSmsComponent, WidgetHeaderComponent],
  providers: [SmsService, WidgetsService]
})
export class SmsWidgetContentComponent implements OnChanges, OnInit {
  @Input() serviceName: string;
  @Input() collapsed: boolean;
  @Input() reload: boolean;
  @Input() showWorks: boolean = false;
  @Output() collapsedChange: EventEmitter<any> = new EventEmitter();
  @ViewChild(Nav) nav: Nav;

  viewMode: string = 'general';
  loading: boolean;
  tasksLoaded: boolean = false;
  emptyTasks: boolean = true;
  sms: any = {};
  error: any;
  tasks: Array<any> = [];
  constants = categoryEnum.SMS;

  constructor(
    private smsService: SmsService,
    private widgetsService: WidgetsService,
    private modalCtrl: ModalController
  ) {

  }

  ngOnInit(): void {
    this.getInfos();
  }

  getInfos(): void {
    this.loading = true;
    Promise.all([
      this.smsService.getInfos(this.serviceName).toPromise(),
      this.smsService.getServiceInfos(this.serviceName)
    ]).then((resp) => {
        this.sms = Object.assign({}, resp[0], resp[1]);
        this.loading = false;
      })
      .catch((err) => {
        this.error = err;
        this.loading = false;
      });
  }

  getTasks(): void {
    if (!this.tasksLoaded) {
      this.loading = true;
      this.smsService.getTasks(this.serviceName).toPromise()
        .then((tasks) => {
          this.emptyTasks = !tasks.length;
          this.tasks = tasks;
          this.loading = false;
          this.tasksLoaded = true;
        }, (err) => {
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
