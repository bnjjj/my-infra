import { Component } from '@angular/core';
import { NavParams, IONIC_DIRECTIVES, ModalController, AlertController } from 'ionic-angular';
import { ToastService } from '../../../services/toast/toast.service';
import { HostingWebService } from './hosting-web.service';
import { AnalyticsService } from '../../../services/analytics/analytics.service';
import { TitleSeparationComponent } from '../../../components/title-separation/title-separation';
import { ProductCore } from '../product';
import { categoryEnum } from '../../../config/constants';

@Component({
  templateUrl: 'build/pages/products/hosting-web/hosting-web.html',
  directives: [IONIC_DIRECTIVES, TitleSeparationComponent],
  providers: [HostingWebService]
})
export class HostingWebPage extends ProductCore {
  server: any;
  error: any = {
    infos: false,
    monitoring: false
  };
  stats: any;
  monitoring: string = categoryEnum.WEB.monitoring[0].type;
  monitoringPeriod: string = 'daily';
  loading: any = {
    init: true,
    monitoring: true
  };
  category = categoryEnum.WEB;
  sslPendingStatus: Array<string> = ['deleting', 'creating', 'regenerating'];

  constructor(private hostingWebService: HostingWebService, private alertCtrl: AlertController, public navParams: NavParams, modalCtrl: ModalController,
    public analytics: AnalyticsService, public toast: ToastService) {
    super(modalCtrl, navParams);
    this.analytics.trackView('product:hosting-web');

    this.subscription = this.hostingWebService.getAll(this.serviceName)
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
    this.hostingWebService.getChart(this.serviceName, type, period)
      .finally(() => this.loading.monitoring = false)
      .subscribe(
        (stats) => this.stats = stats,
        (err) => this.error.monitoring = true
      );
  }

  selectMonitoring(monitoringCat: string, monitoringPeriod: string) {
    this.getChart(monitoringCat, monitoringPeriod);
  }

  changeSslStatus(): void {
    if (this.server.ssl && this.server.ssl.status === 'none') {
      this.server.ssl = {status: 'creating'};
      this.hostingWebService.createSsl(this.serviceName)
        .subscribe(
          () => this.toast.success('La création de votre certificat SSL est en cours...').present(),
          (err) => {
            this.server.ssl = {status: 'none'};
            this.toast.error('Une erreur est survenue lors de la création de votre certificat SSL : ' + JSON.parse(err._body).message).present();
          }
        );
    } else {
      this.server.ssl.status = 'none';
      let success = () => {
        this.server.ssl = Object.assign({}, this.server.ssl, {status: 'deleting'});
        this.hostingWebService.deleteSsl(this.serviceName)
          .subscribe(
            () => this.toast.success('La suppression de votre certificat SSL est en cours...').present(),
            (err) => {
              this.server.ssl = Object.assign({}, this.server.ssl, {status: 'created'});
              this.toast.error('Une erreur est survenue lors de la suppression de votre certificat SSL : ' + JSON.parse(err._body).message).present();
            }
          );
        };
        let error = () => {
          this.server.ssl.status = 'created';
        };

        let alert = this.getDeleteSslAlert(this.serviceName, success, error);
        alert.present();
    }
  }

  sslIsPending(status: string): boolean {
    return this.sslPendingStatus.indexOf(status) !== -1;
  }

  getDeleteSslAlert(serviceName: string, success: Function, error: Function) {
    return this.alertCtrl.create({
      title: 'Supprimer le certificat SSL/TLS',
      message: 'Êtes vous sur de supprimer le certificat SSL/TLS de ' + serviceName + ' et de couper l\'accès de votre site en HTTPS ?',
      buttons: [
        {
          text: 'Non',
          handler: error
        },
        {
          text: 'Oui',
          handler: success
        }
      ]
    });
  }
}
