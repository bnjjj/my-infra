import {Component, Input, EventEmitter, Output, OnChanges, OnInit, SimpleChange} from '@angular/core';
import {IONIC_DIRECTIVES, ModalController, NavController, AlertController} from 'ionic-angular';
import {NetworkStateModal} from '../../../modals/network-state/network-state';
import {WidgetsService} from '../widgets.service';
import {VpsWidgetContentComponent} from './content/vps-widget-content';
import {AnalyticsService} from '../../../services/analytics/analytics.service';
import {WidgetFooterComponent} from '../../../components/widget-footer/widget-footer';
import {ToastService} from '../../../services/toast/toast.service';
import {categoryEnum} from '../../../config/constants';
import {VpsPage} from '../../../pages/products/vps/vps';
import {VpsService} from '../../../pages/products/vps/vps.service';
import {TasksModal} from '../../../modals/tasks/tasks';

@Component({
  selector: 'vps-widget',
  templateUrl: 'build/components/widgets/vps-widget/vps-widget.html',
  directives: [IONIC_DIRECTIVES, VpsWidgetContentComponent, WidgetFooterComponent],
  providers: [VpsService, WidgetsService]
})
export class VpsWidgetComponent implements OnChanges, OnInit {
  @Input() serviceName: string;
  @Input() reload: boolean;
  @Output() remove: EventEmitter<any> = new EventEmitter();

  viewMode: string = 'general';
  loading: boolean;
  collapsed: boolean = false;
  tasksLoaded: boolean = false;
  emptyTasks: boolean;
  server: any;
  error: any;
  tasks: Array<any> = [];
  constructor(private vpsService: VpsService, private widgetsService: WidgetsService, public navController: NavController,
      private analytics: AnalyticsService, private toast: ToastService, private modalCtrl: ModalController, private alertCtrl: AlertController) {
    this.analytics.trackView('Vps-widget');
  }

  ngOnInit(): void {
    this.getInfos();
  }

  getInfos(): void {
    this.loading = true;
    this.vpsService.getInfos(this.serviceName).toPromise()
      .then(resp => {
        this.server = resp;
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
      this.vpsService.getTasks(this.serviceName).toPromise()
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

  openNetworkStateModal() {
    let profileModal = this.modalCtrl.create(NetworkStateModal, { category: '22', categoryName: 'VPS' });
    profileModal.present();
  }

  removeMe(): void {
    let handler = () => this.remove.emit({ serviceName: this.serviceName, url: categoryEnum.VPS.url});
    let alert = this.widgetsService.getDeleteAlert(this.serviceName, handler);

    alert.present();
  }

  reboot(): void {
    let alert = this.alertCtrl.create({
      title: 'Redémarrage',
      message: 'Voulez-vous redémarrer le vps ' + this.serviceName,
      buttons: [
        {
          text: 'Non'
        },
        {
          text: 'Oui',
          handler: () => {
            this.vpsService.reboot(this.serviceName).toPromise()
              .then(
                () => this.toast.success('Redémarrage en cours ...').present(),
                (err) => this.toast.error('Une erreur est survenue : ' + err.message).present()
              );
          }
        }
      ]
    });

    alert.present();
  }

  moreInfos(): void {
    this.navController.push(VpsPage, {serviceName: this.serviceName});
  }

  openTasks(): void {
    let tasksModal = this.modalCtrl.create(TasksModal, { serviceName: this.serviceName, service: this.vpsService });
    tasksModal.present();
  }
}
