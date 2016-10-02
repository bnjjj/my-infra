declare var require;
import {Component, Input} from '@angular/core';
import {IONIC_DIRECTIVES} from 'ionic-angular';
import {DomainService} from '../../../../pages/products/domain/domain.service';
let moment = require('moment');
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'task-details-domain',
  templateUrl: 'build/components/widgets/domain-widget/task-details/task-details.html',
  directives: [IONIC_DIRECTIVES]
})
export class TaskDetailsDomainComponent {
  @Input() serviceName: string;
  @Input() id: number;
  loading: boolean = true;
  error: any;
  task: Object;
  constructor(private domainService: DomainService) {

  }

  ngOnInit() {
    this.getTask();
  }

  getTask() {
    this.loading = true;
    return this.domainService.getTask(this.serviceName, this.id).toPromise()
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
