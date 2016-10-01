import {Component, Input, EventEmitter, Output, OnChanges, OnInit, SimpleChange, ViewChild} from '@angular/core';
import {IONIC_DIRECTIVES, ModalController, Nav} from 'ionic-angular';
import {PrivateDatabaseWidgetService} from '../private-database-widget.service';
import {WidgetsService} from '../../widgets.service';
import {TaskDetailsPrivateDatabaseComponent} from '../task-details/task-details';
import {WidgetHeaderComponent} from '../../../widget-header/widget-header';
import {categoryEnum} from '../../../../config/constants';

@Component({
  selector: 'private-database-widget-content',
  templateUrl: 'build/components/widgets/private-database-widget/content/private-database-widget-content.html',
  directives: [IONIC_DIRECTIVES, TaskDetailsPrivateDatabaseComponent, WidgetHeaderComponent],
  providers: [PrivateDatabaseWidgetService, WidgetsService]
})
export class PrivateDatabaseWidgetContentComponent implements OnChanges, OnInit {
  @Input() serviceName: string;
  @Input() showWorks: boolean = false;
  @Input() reload: boolean;
  @Input() collapsed: boolean;
  @Output() collapsedChange: EventEmitter<any> = new EventEmitter();
  @ViewChild(Nav) nav: Nav;

  bdd: any = {};
  loading: boolean;
  viewMode: string = 'general';
  tasksLoaded: boolean = false;
  emptyTasks: boolean;
  error: any;
  tasks: Array<any> = [];
  constants: Object = categoryEnum.PRIVATE_DATABASE;

  constructor(private privateDatabaseWidgetService: PrivateDatabaseWidgetService, private widgetsService: WidgetsService, private modalCtrl: ModalController) {

  }

  ngOnInit(): void {
    this.getInfos();
  }

  getInfos(): void {
    this.loading = true;
    Promise.all([this.privateDatabaseWidgetService.getInfos(this.serviceName), this.privateDatabaseWidgetService.getServiceInfos(this.serviceName)])
      .then(resp => {
        this.bdd = Object.assign(resp[0], resp[1]);
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
      this.privateDatabaseWidgetService.getTasks(this.serviceName)
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

  getStatusClass() {
    switch (this.bdd.state) {
      case 'started':
        return 'green-color';
      case 'stopped':
        return 'danger-color';
      default:
        return 'danger-color';
    }
  }
}
