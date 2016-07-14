import {Injectable} from 'angular2/core';
import {Toast} from 'ionic-angular';

@Injectable()
export class ToastService {
  constructor() {

  }

  alert(message: string, options?: any) {
    let opts = Object.assign({}, {
      message,
      duration: 2000,
      position: 'top',
      cssClass: 'toast-alert'
    }, options);

    return Toast.create(opts);
  }

  error(message: string, options?: any) {
    let opts = Object.assign({}, {
      message,
      duration: 2000,
      position: 'top',
      cssClass: 'toast-error'
    }, options);

    return Toast.create(opts);
  }

  success(message: string, options?: any) {
    let opts = Object.assign({}, {
      message,
      duration: 2000,
      position: 'top',
      cssClass: 'toast-success'
    }, options);

    return Toast.create(opts);
  }
}

