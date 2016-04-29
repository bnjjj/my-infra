import {Injectable} from 'angular2/core';
import {Alert} from 'ionic-angular';

@Injectable()
export class WidgetsService {
  constructor() {

  }

  getDeleteAlert(serviceName: string, handler: Function) {
    return Alert.create({
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
