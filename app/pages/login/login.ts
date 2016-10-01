import {Component} from '@angular/core';
import {NavController, Keyboard} from 'ionic-angular';
import {LoginService} from './login.service';
import {AppVersion} from 'ionic-native';
import {ToastService} from '../../services/toast/toast.service';
import {AnalyticsService} from '../../services/analytics/analytics.service';
import {TabsPage} from '../tabs/tabs';

@Component({
  templateUrl: 'build/pages/login/login.html',
  directives: [],
  providers: [LoginService, ToastService]
})
export class LoginPage {
  infos: any;
  error: any;
  login: string;
  password: string;
  loading: boolean = false;
  loadingCode: boolean = false;
  version: string = '';
  doubleAuthSmsEnabled: boolean = false;
  smsCode: string;
  credentialToken: string;
  sessionId: string;

  constructor(private loginService: LoginService,
                private keyboard: Keyboard, private analytics: AnalyticsService,
                 private toast: ToastService, private nav: NavController) {

    this.analytics.trackView('Login');
    AppVersion.getVersionNumber()
      .then(
        version => this.version = version,
        err => console.log(err)
      );
  }

  logme() {
    if (!this.login || !this.password) {
      return;
    }
    this.loading = true;
    this.error = null;
    this.keyboard.close();
    this.analytics.trackEvent('Login', 'logme', 'Launch', 'pending');
    if (this.login.indexOf('@') === -1) {
      this.login = this.login.indexOf('-ovh') === -1 ? [this.login, '-ovh'].join('') : this.login;
    }
    this.loginService.login(this.login, this.password)
      .then(
        authTypeInfos => {
          if (authTypeInfos.sms) {
            this.doubleAuthSmsEnabled = true;
            this.loading = false;
            this.credentialToken = authTypeInfos.credentialToken;
            this.sessionId = authTypeInfos.sessionId;
            this.analytics.trackEvent('Login', 'logme', 'DoubleAuth', 'detected');
          } else {
            this.analytics.trackEvent('Login', 'logme', 'Basic', 'Good');
            this.redirectSuccess();
          }
        },
        err => {
          this.error = err.message ? err.message : JSON.stringify(err);
          this.analytics.trackEvent('Login', 'logme', 'Error', 'error : ' + this.error);
          this.keyboard.close();
          this.toast.error('Erreur lors de la connection').present();
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
        connected => {
          if (connected) {
            this.redirectSuccess();
          } else {
            this.toast.error('Mauvais code, un nouveau code va vous être envoyé', {duration: 4000}).present();
            this.loading = false;
          }
          this.analytics.trackEvent('Login', 'doubleAuthSmsConfirm', 'Success', 'good');
        },
        err => {
          this.redirectError(err);
          this.error = err.message ? err.message : JSON.stringify(err);
          this.analytics.trackEvent('Login', 'doubleAuthSmsConfirm', 'Error', 'error : ' + this.error);
        }
      );
  }

  sendCode() {
    this.loadingCode = true;
    this.smsCode = '';

    this.loginService.askAuthentication(this.login, this.password, this.credentialToken)
      .then(
        () => {
          this.loadingCode = false;
          this.toast.success('Un nouveau code vous a été envoyé').present();
          this.analytics.trackEvent('Login', 'doubleAuthResendCode', 'Success', 'good');
        },
        err => {
          this.loadingCode = false;
          this.toast.error('Une ereur est survenue lors de votre demande').present();
          this.analytics.trackEvent('Login', 'doubleAuthResendCode', 'Error', JSON.stringify(err));
        }
      );
  }

  redirectSuccess() {
    this.analytics.trackEvent('Login', 'logme', 'Success', 'good');
    this.keyboard.close();
    this.toast.success('Compte activé avec succès').present();
    this.nav.push(TabsPage);
  }

  redirectError(err: any) {
    this.error = err.message ? err.message : JSON.stringify(err);
    this.analytics.trackEvent('Login', 'logme', 'Error', 'error : ' + this.error);
    this.keyboard.close();
    this.toast.error('Erreur lors de la connexion').present();
    this.loading = false;
  }
}
