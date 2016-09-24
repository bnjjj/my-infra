declare var require;

import {Http, Headers} from '@angular/http';
import {Injectable} from '@angular/core';
import {Storage, LocalStorage, NavController} from 'ionic-angular';
import 'rxjs/add/operator/toPromise';
import {OvhRequestService} from '../../services/ovh-request/ovh-request.service';
import {AnalyticsService} from '../../services/analytics/analytics.service';
import {loginConfiguration} from '../../config/constants';
let _ = require('lazy.js');

@Injectable()
export class LoginService {
  localStorage: Storage;
  rootUrl: string = loginConfiguration['ovh-eu'].rootUrl;
  validationUrl: string;
  loginId: string;
  passwordId: string;

  constructor(private http: Http, private ovhRequest: OvhRequestService, private analytics: AnalyticsService, private nav: NavController) {
    this.localStorage = new Storage(LocalStorage);
  }

  configureAccess(login: string, password: string, appKey: string) {
    let accessRules = '{"accessRules":[{"method":"GET","path":"/*"},{"method":"POST","path":"/*"},{"method":"PUT","path":"/*"},{"method":"DELETE","path":"/*"}]}';
    let validationInfo: any;
    let credentialToken: string;

    return new Promise((resolve, reject) => {
      this.http.post(this.rootUrl + '/1.0/auth/credential', accessRules,
        {headers: new Headers({'Content-Type': 'application/json', 'X-Ovh-Application': appKey})}).toPromise()
        .then((resp) => {
          validationInfo = resp.json();
          this.validationUrl = validationInfo.validationUrl;

          this.analytics.trackEvent('LoginService', 'configureAccess', 'Good', resp);

          localStorage.removeItem('consumerKey');
          localStorage.setItem('consumerKey', validationInfo.consumerKey);

          return this.http.get(validationInfo.validationUrl).toPromise();
        })
        .then((resp) => {
          let inputArray;
          let tempDiv = document.createElement('div');
          credentialToken = validationInfo.validationUrl.split('credentialToken=')[1];
          this.analytics.trackEvent('LoginService', 'validation', 'Good', resp);

          tempDiv.innerHTML = resp.text();
          inputArray = tempDiv.getElementsByTagName('input');

          if (inputArray.length > 2) {
            this.loginId = inputArray[1].getAttribute('id');
            this.passwordId = inputArray[2].getAttribute('id');
          }

          return this.askAuthentication(login, password, credentialToken);
        })
        .then((resp) => {
          let tmpDiv = document.createElement('div');
          tmpDiv.innerHTML = resp.text();

          let inputs = tmpDiv.getElementsByTagName('input');
          let inputSms = _(inputs).find((elt) => elt.id === 'codeSMS');
          let inputSessionId = _(inputs).find((elt) => elt.name === 'sessionId');

          if (tmpDiv.getElementsByClassName('error').length !== 0) {
            return /*Promise.*/reject('Error during activation token');
          } else if (inputSms && inputSessionId) {
            // DOUBLE AUTH SMS
            return resolve({ sms: true, credentialToken, sessionId: inputSessionId.value });
          }

          this.analytics.trackEvent('LoginService', 'finalValidation', 'Good', resp);

          return resolve({ sms: false, credentialToken, sessionId: null });
        })
        .catch((err) => reject(err));

    });


  }

  askAuthentication(login: string, password: string, credentialToken: string) {
    return this.http.post(this.validationUrl, this.loginId + '=' + login + '&' + this.passwordId + '=' + password + '&duration=0&credentialToken=' + credentialToken,
      {headers: new Headers({'Content-Type': 'application/x-www-form-urlencoded'})}).toPromise();
  }

  doubleAuthSmsValidation(smsCode: string, credentialToken: string, sessionId: string) {
    return this.http.post(this.rootUrl + '/auth/?credentialToken=' + credentialToken, 'sessionId=' + sessionId + '&credentialToken=' + credentialToken + '&duration=0' + '&sms=' + smsCode + '&otpMethod=sms',
      {headers: new Headers({'Content-Type': 'application/x-www-form-urlencoded'})}).toPromise()
      .then(
        (resp) => {
          let tmpDiv = document.createElement('div');
          tmpDiv.innerHTML = resp.text();

          let inputs = tmpDiv.getElementsByTagName('input');
          let inputSms = _(inputs).find((elt) => elt.id === 'codeSMS');

          if (inputSms == null || inputSms.length === 0) {
            localStorage.removeItem('connected');
            localStorage.setItem('connected', 'true');

            return true;
          } else {
            return false;
          }
        }
      );
  }

  login(login: string, password: string) {
    return this.configureAccess(login, password, loginConfiguration['ovh-eu'].appKey)
      .then((infos: any) => {
        let config = {
          endpoint: 'ovh-eu',
          appKey: loginConfiguration['ovh-eu'].appKey,
          appSecret: loginConfiguration['ovh-eu'].appSecret,
          consumerKey: localStorage.getItem('consumerKey')
        };

        this.ovhRequest.setConfiguration(config);
        if (!infos.sms) {
          localStorage.removeItem('connected');
          localStorage.setItem('connected', 'true');
        }


        return infos;
      });
  }

  logout() {
    localStorage.removeItem('appKey');
    localStorage.removeItem('appSecret');
    localStorage.removeItem('consumerKey');
    localStorage.removeItem('widgets');
    localStorage.removeItem('credentials');
    localStorage.removeItem('connected');
    this.ovhRequest.setConfiguration({});
    location.reload();
  }
}
