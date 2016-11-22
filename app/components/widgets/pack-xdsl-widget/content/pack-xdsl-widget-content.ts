import { Component, Input, EventEmitter, Output, OnInit } from '@angular/core';
import { IONIC_DIRECTIVES, ModalController } from 'ionic-angular';
import { TaskDetailsPackXdslComponent } from '../task-details/task-details';
import { PackXdslService } from '../../../../pages/products/pack-xdsl/pack-xdsl.service';
import { WidgetsService } from '../../widgets.service';
import { WidgetHeaderComponent } from '../../../widget-header/widget-header';
import { categoryEnum } from '../../../../config/constants';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'pack-xdsl-widget-content',
  templateUrl: 'build/components/widgets/pack-xdsl-widget/content/pack-xdsl-widget-content.html',
  directives: [IONIC_DIRECTIVES, TaskDetailsPackXdslComponent, WidgetHeaderComponent],
  providers: [PackXdslService, WidgetsService]
})
export class PackXdslWidgetContentComponent implements OnInit {
  @Input() serviceName: string;
  @Input() collapsed: boolean;
  @Input() reload: boolean;
  @Input() showWorks: boolean = false;
  @Output() collapsedChange: EventEmitter<any> = new EventEmitter();

  viewMode: string = 'general';
  loading: boolean;
  tasksLoaded: boolean = false;
  emptyTasks: boolean = true;
  packXdsl: any = {};
  error: any;
  tasks: Array<any> = [];
  constants = categoryEnum.PACK_XDSL;

  constructor(
    private packXdslService: PackXdslService,
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
      this.packXdslService.getInfos(this.serviceName).toPromise(),
      this.packXdslService.getServiceInfos(this.serviceName)
    ]).then((resp) => {
        this.packXdsl = Object.assign({}, resp[0], resp[1]);
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
      this.packXdslService.getTasks(this.serviceName).toPromise()
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

  updateCollapse(): void {
    this.collapsed = !this.collapsed;
    this.collapsedChange.emit(this.collapsed);
  }
}
