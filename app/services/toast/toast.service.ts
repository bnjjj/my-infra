import {Injectable} from 'angular2/core';
import {Toast} from 'ionic-native';

@Injectable()
export class ToastService {
  constructor() {

  }

  alert(message: string, options?: any) {
    let opts = Object.assign({}, {
      message,
      duration: 'long',
      position: 'top',
      styling: {
        opacity: 0.90,
        backgroundColor: '#387ef5',
        cornerRadius: 10
      }
    }, options);

    return Toast.showWithOptions(opts);
  }

  error(message: string, options?: any) {
    let opts = Object.assign({}, {
      message,
      duration: 'long',
      position: 'top',
      styling: {
        opacity: 0.90,
        backgroundColor: '#f53d3d',
        cornerRadius: 10
      }
    }, options);

    return Toast.showWithOptions(opts);
  }

  success(message: string, options?: any) {
    let opts = Object.assign({}, {
      message,
      duration: 'long',
      position: 'top',
      styling: {
        opacity: 0.90,
        backgroundColor: '#32db64',
        cornerRadius: 10
      }
    }, options);

    return Toast.showWithOptions(opts);
  }
}

