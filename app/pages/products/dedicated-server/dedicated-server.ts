import {Component} from '@angular/core';
import { NavParams, IONIC_DIRECTIVES, ModalController, AlertController } from 'ionic-angular';
import {ToastService} from '../../../services/toast/toast.service';
import {DedicatedServerService} from './dedicated-server.service';
import {AnalyticsService} from '../../../services/analytics/analytics.service';
import {TitleSeparationComponent} from '../../../components/title-separation/title-separation';
import {ProductCore} from '../product';
import {categoryEnum} from '../../../config/constants';

@Component({
  templateUrl: 'build/pages/products/dedicated-server/dedicated-server.html',
  directives: [IONIC_DIRECTIVES, TitleSeparationComponent],
  providers: [DedicatedServerService]
})
export class DedicatedServerPage extends ProductCore {
  server: any;
  stats: any;
  monitoring: string = categoryEnum.DEDICATED_SERVER.monitoring[0].type;
  monitoringPeriod: string = 'daily';
  serviceName: string;
  loading: any = {
    init: true,
    monitoring: true
  };
  category = categoryEnum.DEDICATED_SERVER;

  constructor(private dedicatedServerService: DedicatedServerService, private navParams: NavParams, modalCtrl: ModalController,
    public analytics: AnalyticsService, public toast: ToastService, public alertCtrl: AlertController) {
    super(modalCtrl);
    this.analytics.trackView('product:dedicated-server');
    this.serviceName = navParams.get('serviceName');

    this.subscription = this.dedicatedServerService.getAll(this.serviceName)
      .subscribe((server) => {
        this.server = server;
        this.loading.init = false;
      });
    this.getChart(this.monitoring, this.monitoringPeriod);
  }

  getChart(type: string, period: string) {
    this.loading.monitoring = true;
    this.dedicatedServerService.getChart(this.serviceName, type, period)
      .subscribe(
        (stats) => this.stats = stats,
        (err) => this.toast.error('Une erreur est survenue lors du chargement des statistiques : ' + JSON.parse(err._body).message).present(),
        () => this.loading.monitoring = false
      );
  }

  selectMonitoring(monitoringCat: string, monitoringPeriod: string) {
    this.getChart(monitoringCat, monitoringPeriod);
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
                (err) => this.toast.error('Une erreur est survenue : ' + err.message).present()
              );
          }
        }
      ]
    });

    alert.present();
  }

}
