declare var require;
import { Component, Input } from '@angular/core';
import { IONIC_DIRECTIVES } from 'ionic-angular';
import { PackXdslService } from '../../../../pages/products/pack-xdsl/pack-xdsl.service';
import 'rxjs/add/operator/toPromise';

const moment = require('moment');

@Component({
  selector: 'task-details-pack-xdsl',
  templateUrl: 'build/components/widgets/pack-xdsl-widget/task-details/task-details.html',
  directives: [IONIC_DIRECTIVES]
})
export class TaskDetailsPackXdslComponent {
  @Input() serviceName: string;
  @Input() id: number;

  loading: boolean = true;
  error: any;
  task: Object;

  constructor(private packXdslService: PackXdslService) {

  }

  ngOnInit() {
    this.getTask();
  }

  getTask() {
    this.loading = true;
    return this.packXdslService.getTask(this.serviceName, this.id).toPromise()
      .then((task) => {
        task.startDateText = moment(new Date(task.startDate)).format('DD/MM/YYYY à HH:mm');
        task.doneDateText = task.doneDate ? moment(new Date(task.doneDate)).format('DD/MM/YYYY à HH:mm') : null;
        this.task = task;
        this.loading = false;
      }, (err) => {
        this.error = err;
        this.loading = false;
      });
  }
}
