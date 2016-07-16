import {Page, NavController, Keyboard} from 'ionic-angular';
import {LoginService} from './login.service';
import {AppVersion} from 'ionic-native';
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
  login: string;
  password: string;
  loading: any = false;
  version: string = '';
  doubleAuthSmsEnabled: boolean = false;
  smsCode: string;
  credentialToken: string;
  sessionId: string;

  constructor(private loginService: LoginService, private nav: NavController,
                private keyboard: Keyboard, private analytics: AnalyticsService,
                 private toast: ToastService) {

    this.analytics.trackView('Login');
    AppVersion.getVersionNumber()
      .then(
        (version) => this.version = version,
        (err) => console.log(err)
      );
  }

  logme() {
    if (!this.login || !this.password) {
      return;
    }
    this.loading = true;
    this.error = null;
    this.keyboard.close();
    this.analytics.trackEvent('Login', 'logme', 'Launch', this.login);
    if (this.login.indexOf('@') === -1) {
      this.login = this.login.indexOf('-ovh') === -1 ? [this.login, '-ovh'].join('') : this.login;
    }
    this.loginService.login(this.login, this.password)
      .then(
        (authTypeInfos) => {
          if (authTypeInfos.sms) {
            this.doubleAuthSmsEnabled = true;
            this.loading = false;
            this.credentialToken = authTypeInfos.credentialToken;
            this.sessionId = authTypeInfos.sessionId;
          } else {
            this.redirectSuccess();
          }
        },
        (err) => {
          this.error = err.message ? err.message : JSON.stringify(err);
          this.analytics.trackEvent('Login', 'logme', 'Error', 'error : ' + this.error + ' login: ' + this.login);
          this.keyboard.close();
          this.nav.present(this.toast.error('Erreur lors de la connection'));
          this.loading = false;
        }
      );
  }

  doubleAuthSmsConfirm() {
    if (!this.smsCode) {
      return;
    }

    this.loading = true;

    this.loginService.doubleAuthSmsValidation(this.smsCode, this.credentialToken, this.sessionId)
      .then(
        () => this.redirectSuccess(),
        (err) => this.redirectError(err)
      );
  }

  redirectSuccess() {
    this.analytics.trackEvent('Login', 'logme', 'Success', this.login);
    this.keyboard.close();
    this.nav.present(this.toast.success('Compte activé avec succès'));
    this.nav.push(TabsPage);
  }

  redirectError(err: any) {
    this.error = err.message ? err.message : JSON.stringify(err);
    this.analytics.trackEvent('Login', 'logme', 'Error', 'error : ' + this.error + ' login: ' + this.login);
    this.keyboard.close();
    this.nav.present(this.toast.error('Erreur lors de la connection'));
    this.loading = false;
  }
}
