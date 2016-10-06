import {Component} from '@angular/core';
import { NavParams, IONIC_DIRECTIVES, ModalController, AlertController } from 'ionic-angular';
import {VpsService} from './vps.service';
import {AnalyticsService} from '../../../services/analytics/analytics.service';
import {ToastService} from '../../../services/toast/toast.service';
import {TitleSeparationComponent} from '../../../components/title-separation/title-separation';
import {ProductCore} from '../product';
import {categoryEnum} from '../../../config/constants';

@Component({
  templateUrl: 'build/pages/products/vps/vps.html',
  directives: [IONIC_DIRECTIVES, TitleSeparationComponent],
  providers: [VpsService]
})
export class VpsPage extends ProductCore {
  vps: any = {};
  monitoring: any = {};
  serviceName: string;
  loading: any = {
    init: true,
    monitoring: true
  };
  category = categoryEnum.VPS;

  constructor(private vpsService: VpsService, private navParams: NavParams, modalCtrl: ModalController,
      public analytics: AnalyticsService, public toast: ToastService, public alertCtrl: AlertController) {
    super(modalCtrl);
    this.analytics.trackView('product:vps');
    this.serviceName = navParams.get('serviceName');

    this.subscription = this.vpsService.getAll(this.serviceName)
      .subscribe(
        (vps) => {
          this.vps = vps;
        },
        null,
        () => this.loading.init = false
      );
    this.getMonitoring();
  }

  getMonitoring() {
    this.loading.monitoring = true;
    this.vpsService.getMonitoring(this.serviceName)
      .subscribe(
        (monitoring) => this.monitoring = monitoring,
        null,
        () => this.loading.monitoring = false
      );
  }

  changeSlaMonitoring() {
    this.vps.slaMonitoring = !this.vps.slaMonitoring;
    this.vpsService.putInfos(this.serviceName, { slaMonitoring: this.vps.slaMonitoring })
      .subscribe(
        () => this.toast.success('Votre changement a bien été pris en compte et sera effectif d\'ici quelques minutes').present(),
        (err) => {
          this.vps.slaMonitoring = !this.vps.slaMonitoring;
          this.toast.error(`Une erreur est survenue (${JSON.parse(err._body).message})`).present();
        }
      );
  }

  changeNetbootMode() {
    let previousNetboot = this.vps.netbootMode;
    this.vps.netbootMode = this.vps.netbootMode === 'local' ? 'rescue' : 'local';
    this.vpsService.putInfos(this.serviceName, { netbootMode: this.vps.netbootMode })
      .subscribe(
        () => this.toast.success('Votre changement a bien été pris en compte et sera effectif d\'ici quelques minutes').present(),
        (err) => {
          this.vps.netbootMode = previousNetboot;
          this.toast.error(`Une erreur est survenue (${JSON.parse(err._body).message})`).present();
        }
      );
  }

  reboot(): void {
    let alert = this.alertCtrl.create({
      title: 'Redémarrage',
      message: `Voulez-vous redémarrer le vps ${this.serviceName}`,
      buttons: [
        {
          text: 'Non'
        },
        {
          text: 'Oui',
          handler: () => {
            this.vpsService.reboot(this.serviceName).toPromise()
              .then(
                () => this.toast.success('Redémarrage en cours…').present(),
                (err) => this.toast.error(`Une erreur est survenue : ${err.message}`).present()
              );
          }
        }
      ]
    });

    alert.present();
  }
}
