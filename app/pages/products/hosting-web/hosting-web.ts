import { Component } from '@angular/core';
import { NavParams, IONIC_DIRECTIVES, ModalController } from 'ionic-angular';
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
  error: boolean = false;
  loading: boolean = true;
  category = categoryEnum.WEB;
  sslPendingStatus: Array<string> = ['deleting', 'creating', 'regenerating'];

  constructor(private hostingWebService: HostingWebService, public navParams: NavParams, modalCtrl: ModalController,
    public analytics: AnalyticsService, public toast: ToastService) {
    super(modalCtrl, navParams);
    this.analytics.trackView('product:hosting-web');

    this.subscription = this.hostingWebService.getAll(this.serviceName)
      .finally(() => this.loading = false)
      .subscribe(
        (server) => this.server = server,
        (err) => {
          this.error = true;
          this.toast.error('Une erreur est survenue lors du chargement : ' + JSON.parse(err._body).message).present();
        }
      );
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
      this.server.ssl = Object.assign({}, this.server.ssl, {status: 'deleting'});
      this.hostingWebService.deleteSsl(this.serviceName)
        .subscribe(
          () => this.toast.success('La suppression de votre certificat SSL est en cours...').present(),
          (err) => {
            this.server.ssl = Object.assign({}, this.server.ssl, {status: 'created'});
            this.toast.error('Une erreur est survenue lors de la suppression de votre certificat SSL : ' + JSON.parse(err._body).message).present();
          }
        );
    }
  }

  sslIsPending(status: string): boolean {
    return this.sslPendingStatus.indexOf(status) !== -1;
  }
}
