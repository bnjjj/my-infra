import {Component} from '@angular/core';
import { NavParams, IONIC_DIRECTIVES, ModalController } from 'ionic-angular';
import {ToastService} from '../../../services/toast/toast.service';
import {HostingWebService} from './hosting-web.service';
import {AnalyticsService} from '../../../services/analytics/analytics.service';
import {TitleSeparationComponent} from '../../../components/title-separation/title-separation';
import {ProductCore} from '../product';
import {categoryEnum} from '../../../config/constants';

@Component({
  templateUrl: 'build/pages/products/hosting-web/hosting-web.html',
  directives: [IONIC_DIRECTIVES, TitleSeparationComponent],
  providers: [HostingWebService]
})
export class HostingWebPage extends ProductCore {
  server: any;
  serviceName: string;
  loading: boolean = true;
  category = categoryEnum.WEB;
  sslPendingStatus: Array<string> = ['deleting', 'creating', 'regenerating'];

  constructor(private hostingWebService: HostingWebService, private navParams: NavParams, modalCtrl: ModalController,
    public analytics: AnalyticsService, public toast: ToastService) {
    super(modalCtrl);
    this.analytics.trackView('product:hosting-web');
    this.serviceName = navParams.get('serviceName');

    this.subscription = this.hostingWebService.getAll(this.serviceName)
      .subscribe((server) => {
        this.server = server;
        this.loading = false;
      });
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
