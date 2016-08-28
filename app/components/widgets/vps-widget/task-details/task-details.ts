declare var require;
import {Component, Input, ViewChild} from '@angular/core';
import {IONIC_DIRECTIVES, Nav} from 'ionic-angular';
import {VpsWidgetService} from '../vps-widget.service';
import {ToastService} from '../../../../services/toast/toast.service';
let moment = require('moment');

@Component({
  selector: 'task-details-vps',
  templateUrl: 'build/components/widgets/vps-widget/task-details/task-details.html',
  directives: [IONIC_DIRECTIVES]
})
export class TaskDetailsVpsComponent {
  @Input() serviceName: string;
  @Input() id: number;
  @ViewChild(Nav) nav: Nav;

  loading: boolean = true;
  error: any;
  task: Object;
  constructor(private vpsWidgetService: VpsWidgetService, private toast: ToastService) {

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
        this.toast.error(err.message).present();
        this.loading = false;
      });
  }
}
