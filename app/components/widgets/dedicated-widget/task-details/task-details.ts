declare var require;
import {Component, Input} from 'angular2/core';
import {IONIC_DIRECTIVES} from 'ionic-angular';
import {DedicatedWidgetService} from '../dedicated-widget.service';
let moment = require('moment');

@Component({
  selector: 'task-details-dedicated',
  templateUrl: 'build/components/widgets/dedicated-widget/task-details/task-details.html',
  directives: [IONIC_DIRECTIVES]
})
export class TaskDetailsDedicatedComponent {
  @Input() serviceName: string;
  @Input() id: number;
  loading: boolean = true;
  error: any;
  task: Object;
  constructor(private dedicatedWidgetService: DedicatedWidgetService) {

  }

  ngOnInit() {
    this.getTask();
  }

  getTask() {
    this.loading = true;
    return this.dedicatedWidgetService.getTask(this.serviceName, this.id)
      .then(task => {
        task.startDateText = moment(new Date(task.startDate)).format('DD/MM/YYYY à HH:mm');
        task.doneDateText = task.doneDate ? moment(new Date(task.doneDate)).format('DD/MM/YYYY à HH:mm') : null;
        this.task = task;
        this.loading = false;
      }, err => {
        this.error = err;
        this.loading = false;
      });
  }
}
