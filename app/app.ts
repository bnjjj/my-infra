import {App, Platform} from 'ionic-angular';
import {Keyboard} from 'ionic-native';
import {TabsPage} from './pages/tabs/tabs';
import {Http, HTTP_PROVIDERS} from 'angular2/http';
import {provide} from 'angular2/core';
import {PLATFORM_DIRECTIVES} from 'angular2/core';
import {OvhRequestService} from './services/ovh-request/ovh-request.service';
import {ToastService} from './services/toast/toast.service';
import {AnalyticsService} from './services/analytics/analytics.service';
import {ProductsService} from './services/products/common.service';
import {LoaderComponent} from './components/loader/loader';
import {AsyncBoxComponent} from './components/async-box/async-box';
import {Type} from 'angular2/core';
import {LoginPage} from './pages/login/login';

let providers = [
  HTTP_PROVIDERS,
  OvhRequestService,
  provide(PLATFORM_DIRECTIVES, {useValue: LoaderComponent, multi: true}),
  provide(PLATFORM_DIRECTIVES, {useValue: AsyncBoxComponent, multi: true}),
  ProductsService,
  ToastService,
  AnalyticsService
];

@App({
  template: '<ion-nav [swipeBackEnabled]="false" [root]="rootPage"></ion-nav>',
  config: {
    swipeBackEnabled: false
  }, // http://ionicframework.com/docs/v2/api/config/Config/
  prodMode: true,
  providers: providers
})
export class MyApp {
  rootPage: Type;
  connected: boolean = false;

  constructor(platform: Platform) {
    this.rootPage = LoginPage;
    platform.ready().then(() => {
      document.addEventListener('backbutton', (event) => {
        event.preventDefault();
        event.stopPropagation();
      }, false);

      Keyboard.hideKeyboardAccessoryBar(false);
    });
  }
}
