import {Page, NavController, Keyboard} from 'ionic-angular';
import {InAppBrowser} from 'ionic-native';
import {LoginService} from './login.service';
import {ToastService} from '../../services/toast/toast.service';
import {AnalyticsService} from '../../services/analytics/analytics.service';
import {TabsPage} from '../tabs/tabs';

@Page({
  templateUrl: 'build/pages/login/login.html',
  directives: [],
  providers: [LoginService, ToastService]
})
export class LoginPage {
  infos: any;
  error: any;
  loadingText: string;
  loading: boolean = false;
  loggingIn: boolean = false;

  constructor(private loginService: LoginService, private nav: NavController,
                private keyboard: Keyboard, private analytics: AnalyticsService,
                 private toast: ToastService) {
    this.analytics.trackView('Login');
    if(loginService.checkConfig()) {
      this.checkLogin(true);
    }
  }

  openLoginPage(): any {
    if(document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1) {
      let browser = InAppBrowser.open(this.loginService.ovhRequest.config.validationUrl, '_blank', 'location=no');
      browser.addEventListener('loadstart', (event) => {
        if(event.url.indexOf('login/success') > -1){
          browser.close();
        }
      });
      browser.addEventListener('exit', (event) => {
        this.checkLogin(false);
      });
    } else {
      window.open(this.loginService.ovhRequest.config.validationUrl, '_blank', 'location=no');
    }
  }

  logout(): any {
    return this.loginService.logout();
  }

  startLogin(endpoint: string): any {
    this.loading = true;
    this.loadingText = 'Connexion à l\'API en cours...';
    this.error = null;
    this.keyboard.close();
    this.loginService.startLogin(endpoint).then(() => {
      this.loading = false;
      this.loggingIn = true;
      this.openLoginPage();
    },
    (err) => {
      this.error = err.message ? err.message : JSON.stringify(err);
      this.keyboard.close();

      this.nav.present(this.toast.error('Erreur lors de la connexion'));
      this.loading = false;
    });
  }

  checkLogin(logoutInvalid: boolean): any {
    this.loading = true;
    this.loadingText = 'Vérification de la connexion à votre compte en cours...';

    return this.loginService.checkLogin().then(resp => {
      this.loggingIn = false;
      if(resp.status === "validated") {
        this.keyboard.close();
        this.nav.present(this.toast.success('Compte activé avec succès'));
        this.nav.push(TabsPage);
      } else {
        this.nav.present(this.toast.error('Erreur lors de la connexion'));
      }
    },
    (err) => {
      if(err.status === 403 && err.json()['errorCode'] === "INVALID_CREDENTIAL") {
        this.loggingIn = true;
        this.loading = false;
        if(logoutInvalid) {
          this.logout();
        }
      } else {
        this.error = err.message ? err.message : JSON.stringify(err);
        this.keyboard.close();
        this.nav.present(this.toast.error('Erreur lors de la connexion'));
        this.loading = false;
      }
    });
  }
}
