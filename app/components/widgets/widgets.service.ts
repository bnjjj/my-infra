import {Injectable} from '@angular/core';
import {AlertController} from 'ionic-angular';

@Injectable()
export class WidgetsService {
  constructor(private alertCtrl: AlertController) {

  }

  getDeleteAlert(serviceName: string, handler: Function) {
    return this.alertCtrl.create({
      title: 'Supression de widget',
      message: 'Voulez-vous supprimer le widget de ' + serviceName,
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
  }
}
