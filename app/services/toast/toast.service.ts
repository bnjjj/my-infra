import {Injectable} from '@angular/core';
import {ToastController} from 'ionic-angular';

@Injectable()
export class ToastService {
  constructor(private toastCtrl: ToastController) {

  }

  alert(message: string, options?: any) {
    let opts = Object.assign({}, {
      message,
      duration: 2000,
      position: 'top',
      cssClass: 'toast-alert'
    }, options);

    return this.toastCtrl.create(opts);
  }

  error(message: string, options?: any) {
    let opts = Object.assign({}, {
      message,
      duration: 2000,
      position: 'top',
      cssClass: 'toast-error'
    }, options);

    return this.toastCtrl.create(opts);
  }

  success(message: string, options?: any) {
    let opts = Object.assign({}, {
      message,
      duration: 2000,
      position: 'top',
      cssClass: 'toast-success'
    }, options);

    return this.toastCtrl.create(opts);
  }
}
