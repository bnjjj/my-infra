declare var require;
import {Component, Input} from '@angular/core';
import {IONIC_DIRECTIVES} from 'ionic-angular';
import {WebWidgetService} from '../web-widget.service';
let moment = require('moment');

@Component({
  selector: 'task-details-web',
  templateUrl: 'build/components/widgets/web-widget/task-details/task-details.html',
  directives: [IONIC_DIRECTIVES]
})
export class TaskDetailsWebComponent {
  @Input() serviceName: string;
  @Input() id: number;
  loading: boolean = true;
  error: any;
  task: Object;
  constructor(private webWidgetService: WebWidgetService) {

  }

  ngOnInit() {
    this.getTask();
  }

  getTask() {
    this.loading = true;
    return this.webWidgetService.getTask(this.serviceName, this.id)
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
