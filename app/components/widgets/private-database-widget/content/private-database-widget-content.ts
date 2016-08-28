import {Component, Input, EventEmitter, Output, OnChanges, OnInit, SimpleChange, ViewChild} from '@angular/core';
import {IONIC_DIRECTIVES, ModalController, Nav} from 'ionic-angular';
import {NetworkStateModal} from '../../../../modals/network-state/network-state';
import {PrivateDatabaseWidgetService} from '../private-database-widget.service';
import {WidgetsService} from '../../widgets.service';
import {TaskDetailsPrivateDatabaseComponent} from '../task-details/task-details';

@Component({
  selector: 'private-database-widget-content',
  templateUrl: 'build/components/widgets/private-database-widget/content/private-database-widget-content.html',
  directives: [IONIC_DIRECTIVES, TaskDetailsPrivateDatabaseComponent],
  providers: [PrivateDatabaseWidgetService, WidgetsService]
})
export class PrivateDatabaseWidgetContentComponent implements OnChanges, OnInit {
  @Input() serviceName: string;
  @Input() showWorks: boolean = false;
  @Input() reload: boolean;
  @Input() collapsed: boolean;
  @Output() collapsedChange: EventEmitter<any> = new EventEmitter();
  @ViewChild(Nav) nav: Nav;

  bdd: any = {};
  loading: boolean;
  viewMode: string = 'general';
  tasksLoaded: boolean = false;
  emptyTasks: boolean;
  error: any;
  tasks: Array<any> = [];

  constructor(private privateDatabaseWidgetService: PrivateDatabaseWidgetService, private widgetsService: WidgetsService, private modalCtrl: ModalController) {

  }

  ngOnInit(): void {
    this.getInfos();
  }

  getInfos(): void {
    this.loading = true;
    Promise.all([this.privateDatabaseWidgetService.getInfos(this.serviceName), this.privateDatabaseWidgetService.getServiceInfos(this.serviceName)])
      .then(resp => {
        this.bdd = Object.assign(resp[0], resp[1]);
        this.loading = false;
      })
      .catch(err => {
        this.error = err;
        this.loading = false;
      });
  }


  getTasks(): void {
    if (!this.tasksLoaded) {
      this.loading = true;
      this.privateDatabaseWidgetService.getTasks(this.serviceName)
        .then(tasks => {
          this.emptyTasks = !tasks.length;
          this.tasks = tasks;
          this.loading = false;
          this.tasksLoaded = true;
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
    let profileModal = this.modalCtrl.create(NetworkStateModal, { category: '4', categoryName: 'Base de données privées' });
    profileModal.present();
  }

  updateCollapse(): void {
    this.collapsed = !this.collapsed;
    this.collapsedChange.emit(this.collapsed);
  }
}
