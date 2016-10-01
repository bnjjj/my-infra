declare var require;
import {Component, Input, OnInit} from '@angular/core';
import {IONIC_DIRECTIVES} from 'ionic-angular';
let moment = require('moment');
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'task-details',
  templateUrl: 'build/components/task-details/task-details.html',
  directives: [IONIC_DIRECTIVES]
})
export class TaskDetailsComponent implements OnInit {
  @Input() serviceName: string;
  @Input() id: number;
  @Input() service: any;
  loading: boolean = true;
  error: any;
  task: Object;
  constructor() {

  }

  ngOnInit() {
    this.getTask();
  }

  getTask() {
    this.loading = true;
    return this.service.getTask(this.serviceName, this.id).toPromise()
      .then(task => {
        task.startDateText = task.startDate ? moment(new Date(task.startDate)).format('DD/MM/YYYY à HH:mm') : null;
        task.doneDateText = task.doneDate ? moment(new Date(task.doneDate)).format('DD/MM/YYYY à HH:mm') : null;
        this.task = task;
        this.loading = false;
      }, err => {
        this.error = err;
        this.loading = false;
      });
  }
}
