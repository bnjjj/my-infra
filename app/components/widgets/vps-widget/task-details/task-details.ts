declare var require;
import {Component, Input} from 'angular2/core';
import {IONIC_DIRECTIVES, NavController} from 'ionic-angular';
import {VpsWidgetService} from '../vps-widget.service';
import {ToastService} from '../../../../services/toast/toast.service';
let moment = require('moment');

@Component({
  selector: 'task-details-vps',
  templateUrl: 'build/components/widgets/vps-widget/task-details/task-details.html',
  directives: [IONIC_DIRECTIVES]
})
export class TaskDetailsDedicatedComponent {
  @Input() serviceName: string;
  @Input() id: number;
  loading: boolean = true;
  error: any;
  task: Object;
  constructor(private vpsWidgetService: VpsWidgetService, private nav: NavController, private toast: ToastService) {

  }

  ngOnInit() {
    this.getTask();
  }

  getTask() {
    this.loading = true;
    return this.vpsWidgetService.getTask(this.serviceName, this.id)
      .then(task => {
        task.startDateText = moment(new Date(task.startDate)).format('DD/MM/YYYY à HH:mm');
        task.doneDateText = task.doneDate ? moment(new Date(task.doneDate)).format('DD/MM/YYYY à HH:mm') : null;
        this.task = task;
        this.loading = false;
      }, err => {
        this.error = err;
        this.nav.present(this.toast.error(err.message));
        this.loading = false;
      });
  }
}
