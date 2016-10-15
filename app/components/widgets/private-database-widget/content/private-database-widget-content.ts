import {Component, Input, EventEmitter, Output, OnChanges, OnInit, SimpleChange} from '@angular/core';
import {IONIC_DIRECTIVES, ModalController} from 'ionic-angular';
import {WidgetsService} from '../../widgets.service';
import {TaskDetailsPrivateDatabaseComponent} from '../task-details/task-details';
import {WidgetHeaderComponent} from '../../../widget-header/widget-header';
import {categoryEnum} from '../../../../config/constants';
import {PrivateDatabaseService} from '../../../../pages/products/private-database/private-database.service';

@Component({
  selector: 'private-database-widget-content',
  templateUrl: 'build/components/widgets/private-database-widget/content/private-database-widget-content.html',
  directives: [IONIC_DIRECTIVES, TaskDetailsPrivateDatabaseComponent, WidgetHeaderComponent],
  providers: [PrivateDatabaseService, WidgetsService]
})
export class PrivateDatabaseWidgetContentComponent implements OnChanges, OnInit {
  @Input() serviceName: string;
  @Input() showWorks: boolean = false;
  @Input() reload: boolean;
  @Input() collapsed: boolean;
  @Output() collapsedChange: EventEmitter<any> = new EventEmitter();

  bdd: any = {};
  loading: boolean;
  viewMode: string = 'general';
  tasksLoaded: boolean = false;
  emptyTasks: boolean;
  error: any;
  tasks: Array<any> = [];
  constants: Object = categoryEnum.PRIVATE_DATABASE;

  constructor(private privateDatabaseService: PrivateDatabaseService, private widgetsService: WidgetsService, private modalCtrl: ModalController) {

  }

  ngOnInit(): void {
    this.getInfos();
  }

  getInfos(): void {
    this.loading = true;
    Promise.all([this.privateDatabaseService.getInfos(this.serviceName).toPromise(), this.privateDatabaseService.getServiceInfos(this.serviceName).toPromise()])
      .then((resp) => {
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
      this.privateDatabaseService.getTasks(this.serviceName).toPromise()
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
