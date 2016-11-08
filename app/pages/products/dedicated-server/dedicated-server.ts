import { Component } from '@angular/core';
import { NavParams, IONIC_DIRECTIVES, ModalController, AlertController } from 'ionic-angular';
import { ToastService } from '../../../services/toast/toast.service';
import { DedicatedServerService } from './dedicated-server.service';
import { AnalyticsService } from '../../../services/analytics/analytics.service';
import { TitleSeparationComponent } from '../../../components/title-separation/title-separation';
import { ProductCore } from '../product';
import { categoryEnum } from '../../../config/constants';

@Component({
  templateUrl: 'build/pages/products/dedicated-server/dedicated-server.html',
  directives: [IONIC_DIRECTIVES, TitleSeparationComponent],
  providers: [DedicatedServerService]
})
export class DedicatedServerPage extends ProductCore {
  server: any;
  error: any = {
    infos: false,
    monitoring: false
  };
  stats: any;
  monitoring: string = categoryEnum.DEDICATED_SERVER.monitoring[0].type;
  monitoringPeriod: string = 'daily';
  loading: any = {
    init: true,
    monitoring: true
  };
  category = categoryEnum.DEDICATED_SERVER;

  constructor(private dedicatedServerService: DedicatedServerService, public navParams: NavParams, modalCtrl: ModalController,
    public analytics: AnalyticsService, public toast: ToastService, public alertCtrl: AlertController) {
    super(modalCtrl, navParams);
    this.analytics.trackView('product:dedicated-server');

    this.subscription = this.dedicatedServerService.getAll(this.serviceName)
      .finally(() => this.loading.init = false)
      .subscribe(
        (server) => this.server = server,
        (err) => {
          this.error.infos = true;
          this.toast.error('Une erreur est survenue lors du chargement : ' + JSON.parse(err._body).message).present();
        }
      );
    this.getChart(this.monitoring, this.monitoringPeriod);
  }

  getChart(type: string, period: string) {
    this.loading.monitoring = true;
    this.error.monitoring = false;
    this.dedicatedServerService.getChart(this.serviceName, type, period)
      .subscribe(
        (stats) => this.stats = stats,
        (err) => this.error.monitoring = true,
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
