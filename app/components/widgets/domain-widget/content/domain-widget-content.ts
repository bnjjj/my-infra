import {Component, Input, EventEmitter, Output, OnChanges, OnInit, SimpleChange, ViewChild} from '@angular/core';
import {IONIC_DIRECTIVES, ModalController, Nav} from 'ionic-angular';
import {TaskDetailsDomainComponent} from '../task-details/task-details';
import {DomainWidgetService} from './../domain-widget.service';
import {WidgetsService} from '../../widgets.service';
import {WidgetHeaderComponent} from '../../../widget-header/widget-header';
import {categoryEnum} from '../../../../config/constants';

@Component({
  selector: 'domain-widget-content',
  templateUrl: 'build/components/widgets/domain-widget/content/domain-widget-content.html',
  directives: [IONIC_DIRECTIVES, TaskDetailsDomainComponent, WidgetHeaderComponent],
  providers: [DomainWidgetService, WidgetsService]
})
export class DomainWidgetContentComponent implements OnChanges, OnInit {
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
  domain: any = {};
  error: any;
  tasks: Array<any> = [];
  constants = categoryEnum.DOMAIN;

  constructor(private domainWidgetService: DomainWidgetService, private widgetsService: WidgetsService, private modalCtrl: ModalController) {

  }

  ngOnInit(): void {
    this.getInfos();
  }

  getInfos(): void {
    this.loading = true;
    Promise.all([this.domainWidgetService.getInfos(this.serviceName),
         this.domainWidgetService.getServiceInfos(this.serviceName)])
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

  updateCollapse(): void {
    this.collapsed = !this.collapsed;
    this.collapsedChange.emit(this.collapsed);
  }

  changeTransferLockStatus(): void {
    this.domain.transferLockStatus = this.domain.transferLockStatus === 'locked' ? 'unlocked' : 'locked';
    this.domainWidgetService.putInfos(this.serviceName, { transferLockStatus: this.domain.transferLockStatus })
      .subscribe(null, () => {
        this.domain.transferLockStatus = this.domain.transferLockStatus === 'locked' ? 'unlocked' : 'locked';
      });
  }
}
