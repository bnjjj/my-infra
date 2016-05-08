import {Component, Input, EventEmitter, Output, OnChanges, OnInit, SimpleChange} from 'angular2/core';
import {IONIC_DIRECTIVES, Modal, NavController, Alert} from 'ionic-angular';
import {NetworkStateModal} from '../../../../modals/network-state/network-state';
import {VpsWidgetService} from '../vps-widget.service';
import {TaskDetailsDedicatedComponent} from '../task-details/task-details';
import {ToastService} from '../../../../services/toast/toast.service';
import {WidgetsService} from '../../widgets.service';

@Component({
  selector: 'vps-widget-content',
  templateUrl: 'build/components/widgets/vps-widget/content/vps-widget-content.html',
  directives: [IONIC_DIRECTIVES, TaskDetailsDedicatedComponent],
  providers: [VpsWidgetService, WidgetsService]
})
export class VpsWidgetContentComponent implements OnChanges, OnInit {
  @Input() serviceName: string;
  @Input() reload: boolean;
  @Input() collapsed: boolean;
  @Input() showWorks: boolean = false;
  @Output() collapsedChange: EventEmitter<boolean> = new EventEmitter();
  viewMode: string = 'general';
  loading: boolean;
  tasksLoaded: boolean = false;
  emptyTasks: boolean;
  vps: any = {};
  error: any;
  tasks: Array<any> = [];
  constructor(private vpsWidgetService: VpsWidgetService, private widgetsService: WidgetsService, private nav: NavController, private toast: ToastService) {

  }

  ngOnInit(): void{
    this.getInfos();
  }

  getInfos(): void {
    this.loading = true;
    Promise.all([
        this.vpsWidgetService.getInfos(this.serviceName),
        this.vpsWidgetService.getServiceInfos(this.serviceName),
        this.vpsWidgetService.getDistributionInfos(this.serviceName)])
      .then(resp => {
        this.vps = Object.assign({}, resp[0], resp[1], { distribution: resp[2] });
        this.loading = false;
      })
      .catch(err => {
        this.error = err;
        this.nav.present(this.toast.error(err.message));
        this.loading = false;
      });
  }

  getTasks(): void {
    if (!this.tasksLoaded) {
      this.loading = true;
      this.vpsWidgetService.getTasks(this.serviceName)
        .then(tasks => {
          this.emptyTasks = tasks.length === 0;
          this.tasks = tasks;
        })
        .then(() => {
          this.tasksLoaded = true;
          this.loading = false;
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

  openNetworkStateModal(): void {
    let profileModal = Modal.create(NetworkStateModal, { category: '22', categoryName: 'VPS' });
    this.nav.present(profileModal);
  }

  updateCollapse(): void {
    this.collapsed = !this.collapsed;
    this.collapsedChange.emit(this.collapsed);
  }

  changeMonitoringStatus(): void {
    this.vps.slaMonitoring = !this.vps.slaMonitoring;
    this.vpsWidgetService.putInfos(this.serviceName, { slaMonitoring: this.vps.slaMonitoring })
      .subscribe(null, (err) => {
        this.vps.slaMonitoring = !this.vps.slaMonitoring;
        this.nav.present(this.toast.error(err.message));
      });
  }
}
