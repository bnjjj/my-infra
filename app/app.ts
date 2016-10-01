import {Platform, ionicBootstrap} from 'ionic-angular';
import {Keyboard} from 'ionic-native';
import {TabsPage} from './pages/tabs/tabs';
import {Http, HTTP_PROVIDERS} from '@angular/http';
import {provide} from '@angular/core';
import {Component, PLATFORM_DIRECTIVES} from '@angular/core';
import {OvhRequestService} from './services/ovh-request/ovh-request.service';
import {ToastService} from './services/toast/toast.service';
import {AnalyticsService} from './services/analytics/analytics.service';
import {ProductsService} from './services/products/common.service';
import {LoaderComponent} from './components/loader/loader';
import {AsyncBoxComponent} from './components/async-box/async-box';
import {StateLabelComponent} from './components/state-label/state-label';
import {Type} from '@angular/core';
import {LoginPage} from './pages/login/login';
import {loginConfiguration} from './config/constants';

let providers = [
  HTTP_PROVIDERS,
  provide(OvhRequestService, {
    useFactory: http => {
      let myService = new OvhRequestService(http);
      let appKey = loginConfiguration['ovh-eu'].appKey;
      let appSecret = loginConfiguration['ovh-eu'].appSecret;
      let consumerKey = localStorage.getItem('consumerKey');

      if (appKey && appSecret && consumerKey) {
        myService.setConfiguration({
          endpoint: 'ovh-eu',
          appKey,
          appSecret,
          consumerKey
        });
      }

      return myService;
    },
    deps: [Http]
  }),
  provide(PLATFORM_DIRECTIVES, { useValue: LoaderComponent, multi: true}),
  provide(PLATFORM_DIRECTIVES, { useValue: AsyncBoxComponent, multi: true}),
  provide(PLATFORM_DIRECTIVES, { useValue: StateLabelComponent, multi: true }),
  ProductsService,
  ToastService,
  AnalyticsService
];

@Component({
  template: '<ion-nav [swipeBackEnabled]="false" [root]="rootPage"></ion-nav>'
})
export class MyApp {
  rootPage: Type;
  connected: boolean = false;

  constructor(platform: Platform) {
    let credentials = localStorage.getItem('connected') && localStorage.getItem('consumerKey');

    this.rootPage = credentials ? TabsPage : LoginPage;
    platform.ready().then(() => {
      document.addEventListener('backbutton', event => {
        event.preventDefault();
        event.stopPropagation();
      }, false);

      Keyboard.hideKeyboardAccessoryBar(false);
    });
  }
}

ionicBootstrap(MyApp, providers, {
  backButtonText: '',
  backButtonIcon: 'md-arrow-back',
  swipeBackEnabled: false,
  prodMode: true
});
