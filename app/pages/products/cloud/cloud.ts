import { Component } from '@angular/core';
import { NavParams, IONIC_DIRECTIVES, ModalController, AlertController } from 'ionic-angular';
import { ToastService } from '../../../services/toast/toast.service';
import { CloudService } from './cloud.service';
import { AnalyticsService } from '../../../services/analytics/analytics.service';
import { StatusDetailsComponent } from '../../../components/widgets/cloud-widget/status-details/status-details';
import { TitleSeparationComponent } from '../../../components/title-separation/title-separation';
import { ProductCore } from '../product';
import { categoryEnum } from '../../../config/constants';

@Component({
  templateUrl: 'build/pages/products/cloud/cloud.html',
  directives: [IONIC_DIRECTIVES, TitleSeparationComponent, StatusDetailsComponent],
  providers: [CloudService]
})
export class CloudPage extends ProductCore {
  cloud: any;
  error: boolean = false;
  loading: boolean = true;
  category = categoryEnum.CLOUD;

  constructor(private cloudService: CloudService, public navParams: NavParams, modalCtrl: ModalController,
      public analytics: AnalyticsService, public toast: ToastService, public alertCtrl: AlertController) {
    super(modalCtrl, navParams);
    this.analytics.trackView('product:cloud');

    this.getInfos();
  }

  getInfos() {
    this.loading = true;
    this.subscription = this.cloudService.getAll(this.serviceName)
      .finally(() => this.loading = false)
      .subscribe(
        (cloud) => this.cloud = cloud,
        (err) => {
          this.error = true;
          this.toast.error(`Une erreur est survenue lors du chargement (${JSON.stringify(err)})`).present();
        }
      );
  }

  rebootInstance(id: string): void {
    let handlerSoft = () => {
      this.cloudService.rebootInstance(this.serviceName, id, 'soft').toPromise()
        .then(
          () => {
            this.toast.success('Redémarrage en cours…').present();
            this.getInfos();
          },
          (err) => this.toast.error(`Une erreur est survenue (${JSON.stringify(err)})`).present()
        );
    };

    let handlerHard = () => {
      this.cloudService.rebootInstance(this.serviceName, id, 'soft').toPromise()
        .then(
          () => {
            this.toast.success('Redémarrage en cours…').present();
            this.getInfos();
          },
          (err) => this.toast.error(`Une erreur est survenue (${JSON.stringify(err)})`).present()
        );
    };

    let rebootAlert = this.alertCtrl.create({
      title: 'Redémarrer votre instance',
      message: 'Quel type de redémarrage souhaitez-vous pour redémarrer votre instance maintenant ?',
      buttons: [
        {
          text: 'Hard',
          handler: handlerHard
        },
        {
          text: 'Soft',
          handler: handlerSoft
        },
        {
          text: 'Annuler'
        }
      ]
    });

    rebootAlert.present();
  }

  createSnapshot(id: string): void {
    let handler = (data) => {
      this.cloudService.createSnapshot(this.serviceName, id, data.snapshotName).toPromise()
        .then(
          () => {
            this.toast.success('Snapshot en cours de création…').present();
            this.getInfos();
          },
          (err) => this.toast.error(`Une erreur est survenue (${JSON.stringify(err)})`).present()
        );
    };

    let deleteAlert = this.alertCtrl.create({
      title: 'Création snapshot',
      message: 'Voulez-vous créer un snapshot de cette instance ?',
      inputs: [
        {
          name: 'snapshotName',
          placeholder: 'Nom du snapshot'
        }
      ],
      buttons: [
        {
          text: 'Non'
        },
        {
          text: 'Oui',
          handler: handler
        }
      ]
    });


    deleteAlert.present();
  }

  deleteSnapshot(id: string): void {
    let handler = () => {
      this.cloudService.deleteSnapshot(this.serviceName, id).toPromise()
        .then(
          () => {
            this.toast.success('Suppression effectuée avec succès').present();
            this.getInfos();
          },
          (err) => this.toast.error(`Une erreur est survenue (${JSON.stringify(err)})`).present()
        );
    };

    let deleteAlert = this.alertCtrl.create({
      title: 'Suppression snapshot',
      message: 'Voulez-vous supprimer ce snapshot ?',
      buttons: [
        {
          text: 'Non'
        },
        {
          text: 'Oui',
          handler: handler
        }
      ]
    });

    deleteAlert.present();
  }
}
