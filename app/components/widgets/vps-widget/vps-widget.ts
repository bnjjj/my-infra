import {Component, Input, EventEmitter, Output, OnChanges, OnInit, SimpleChange, ViewChild} from '@angular/core';
import {IONIC_DIRECTIVES, ModalController, Nav, AlertController} from 'ionic-angular';
import {NetworkStateModal} from '../../../modals/network-state/network-state';
import {VpsWidgetService} from './vps-widget.service';
import {WidgetsService} from '../widgets.service';
import {VpsWidgetContentComponent} from './content/vps-widget-content';
import {AnalyticsService} from '../../../services/analytics/analytics.service';
import {ToastService} from '../../../services/toast/toast.service';
import {categoryEnum} from '../../../config/constants';

@Component({
  selector: 'vps-widget',
  templateUrl: 'build/components/widgets/vps-widget/vps-widget.html',
  directives: [IONIC_DIRECTIVES, VpsWidgetContentComponent],
  providers: [VpsWidgetService, WidgetsService]
})
export class VpsWidgetComponent implements OnChanges, OnInit {
  @Input() serviceName: string;
  @Input() reload: boolean;
  @Output() remove: EventEmitter<any> = new EventEmitter();
  @ViewChild(Nav) nav: Nav;

  viewMode: string = 'general';
  loading: boolean;
  collapsed: boolean = false;
  tasksLoaded: boolean = false;
  emptyTasks: boolean;
  server: any;
  error: any;
  tasks: Array<any> = [];
  constructor(private vpsWidgetService: VpsWidgetService, private widgetsService: WidgetsService,
      private analytics: AnalyticsService, private toast: ToastService, private modalCtrl: ModalController, private alertCtrl: AlertController) {
    this.analytics.trackView('Vps-widget');
  }

  ngOnInit(): void {
    this.getInfos();
  }

  getInfos(): void {
    this.loading = true;
    this.vpsWidgetService.getInfos(this.serviceName)
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
            this.vpsWidgetService.reboot(this.serviceName)
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
}
