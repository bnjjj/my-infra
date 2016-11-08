import {Component, Input, EventEmitter, Output, OnInit} from '@angular/core';
import {IONIC_DIRECTIVES, ModalController, NavController, AlertController} from 'ionic-angular';
import {NetworkStateModal} from '../../../modals/network-state/network-state';
import {WidgetsService} from '../widgets.service';
import {DedicatedWidgetContentComponent} from './content/dedicated-widget-content';
import {AnalyticsService} from '../../../services/analytics/analytics.service';
import {categoryEnum} from '../../../config/constants';
import {ToastService} from '../../../services/toast/toast.service';
import {WidgetFooterComponent} from '../../../components/widget-footer/widget-footer';
import {DedicatedServerPage} from '../../../pages/products/dedicated-server/dedicated-server';
import {TasksModal} from '../../../modals/tasks/tasks';
import {DedicatedServerService} from '../../../pages/products/dedicated-server/dedicated-server.service';

@Component({
  selector: 'dedicated-widget',
  templateUrl: 'build/components/widgets/dedicated-widget/dedicated-widget.html',
  directives: [IONIC_DIRECTIVES, DedicatedWidgetContentComponent, WidgetFooterComponent],
  providers: [DedicatedServerService, WidgetsService]
})
export class DedicatedWidgetComponent implements OnInit {
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
  constructor(private dedicatedServerService: DedicatedServerService, private widgetsService: WidgetsService, public navController: NavController,
   private analytics: AnalyticsService, private toast: ToastService, private modalCtrl: ModalController, private alertCtrl: AlertController) {
    this.analytics.trackView('Dedicated-widget');
  }

  ngOnInit(): void {
    this.getInfos();
  }

  getInfos(): void {
    this.loading = true;
    this.dedicatedServerService.getInfos(this.serviceName).toPromise()
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
      this.dedicatedServerService.getTasks(this.serviceName).toPromise()
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

  openNetworkStateModal() {
    let profileModal = this.modalCtrl.create(NetworkStateModal, { category: '5', categoryName: 'serveur dédié' });
    profileModal.present();
  }

  removeMe(): void {
    let handler = () => this.remove.emit({ serviceName: this.serviceName, url: categoryEnum.DEDICATED_SERVER.url });
    let alert = this.widgetsService.getDeleteAlert(this.serviceName, handler);

    alert.present();
  }

  reboot(): void {
    let alert = this.alertCtrl.create({
      title: 'Redémarrage',
      message: 'Voulez-vous redémarrer le serveur ' + this.serviceName,
      buttons: [
        {
          text: 'Non'
        },
        {
          text: 'Oui',
          handler: () => {
            this.dedicatedServerService.reboot(this.serviceName).toPromise()
              .then(
                () => this.toast.success('Redémarrage en cours...').present(),
                err => {
                  this.error = err;
                  this.toast.error('Une erreur est survenue : ' + err.message).present();
                }
              );
          }
        }
      ]
    });

    alert.present();
  }

  moreInfos(): void {
    this.navController.push(DedicatedServerPage, {serviceName: this.serviceName});
  }

  openTasks(): void {
    let tasksModal = this.modalCtrl.create(TasksModal, { serviceName: this.serviceName, service: this.dedicatedServerService });
    tasksModal.present();
  }
}
