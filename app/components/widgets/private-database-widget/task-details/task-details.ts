declare var require;
import {Component, Input} from '@angular/core';
import {IONIC_DIRECTIVES} from 'ionic-angular';
import {PrivateDatabaseWidgetService} from '../private-database-widget.service';
let moment = require('moment');

@Component({
  selector: 'task-details-private-database',
  templateUrl: 'build/components/widgets/private-database-widget/task-details/task-details.html',
  directives: [IONIC_DIRECTIVES]
})
export class TaskDetailsPrivateDatabaseComponent {
  @Input() serviceName: string;
  @Input() id: number;
  loading: boolean = true;
  error: any;
  task: Object;
  constructor(private privateDatabaseWidgetService: PrivateDatabaseWidgetService) {

  }

  ngOnInit() {
    this.getTask();
  }

  getTask() {
    this.loading = true;
    return this.privateDatabaseWidgetService.getTask(this.serviceName, this.id)
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
