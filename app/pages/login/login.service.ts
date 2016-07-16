declare var require;

import {Http, Headers} from 'angular2/http';
import {Injectable} from 'angular2/core';
import {Storage, LocalStorage, NavController} from 'ionic-angular';
import 'rxjs/add/operator/toPromise';
import {OvhRequestService} from '../../services/ovh-request/ovh-request.service';
import {AnalyticsService} from '../../services/analytics/analytics.service';
import {loginConfiguration} from '../../config/constants';
import {LoginPage} from './login';
let _ = require('lazy.js');

@Injectable()
export class LoginService {
  localStorage: Storage;
  rootUrl: string= loginConfiguration['ovh-eu'].rootUrl;
  constructor(private http: Http, private ovhRequest: OvhRequestService, private nav: NavController, private analytics: AnalyticsService) {
    this.localStorage = new Storage(LocalStorage);
  }

  configureAccess(login: string, password: string, appKey: string) {
    let accessRules = '{"accessRules":[{"method":"GET","path":"/*"},{"method":"POST","path":"/*"},{"method":"PUT","path":"/*"},{"method":"DELETE","path":"/*"}]}';
    let validationInfo: any;
    let credentialToken: string;

    return this.http.post(this.rootUrl + '/1.0/auth/credential', accessRules,
      {headers: new Headers({'Content-Type': 'application/json', 'X-Ovh-Application': appKey})}).toPromise()
      .then((resp) => {
        validationInfo = resp.json();

        this.analytics.trackEvent('LoginService', 'configureAccess', 'Good', resp);

        localStorage.removeItem('consumerKey');
        localStorage.setItem('consumerKey', validationInfo.consumerKey);

        return this.http.get(validationInfo.validationUrl).toPromise();
      })
      .then((resp) => {
        let inputArray, loginId, passwordId;
        let tempDiv = document.createElement('div');
        credentialToken = validationInfo.validationUrl.split('credentialToken=')[1];
        this.analytics.trackEvent('LoginService', 'validation', 'Good', resp);

        tempDiv.innerHTML = resp.text();
        inputArray = tempDiv.getElementsByTagName('input');

        if (inputArray.length > 2) {
          loginId = inputArray[1].getAttribute('id');
          passwordId = inputArray[2].getAttribute('id');
        }

        return this.http.post(validationInfo.validationUrl, loginId + '=' + login + '&' + passwordId + '=' + password + '&duration=0&credentialToken=' + credentialToken,
          {headers: new Headers({'Content-Type': 'application/x-www-form-urlencoded'})}).toPromise();
      })
      .then((resp) => {
        let tmpDiv = document.createElement('div')
        tmpDiv.innerHTML = resp.text();

        let inputs = tmpDiv.getElementsByTagName('input');
        let inputSms = _(inputs).find((elt) => elt.id === 'codeSMS');
        let inputSessionId = _(inputs).find((elt) => elt.name === 'sessionId');

        if (tmpDiv.getElementsByClassName('error').length !== 0) {
          return Promise.reject('Error during activation token');
        } else if (inputSms && inputSessionId) {
          // DOUBLE AUTH SMS
          return { sms: true, credentialToken, sessionId: inputSessionId.value };
        }

        this.analytics.trackEvent('LoginService', 'finalValidation', 'Good', resp);

        return { sms: false, credentialToken, sessionId: null };
      });
  }

  doubleAuthSmsValidation(smsCode: string, credentialToken: string, sessionId: string) {
    return this.http.post(this.rootUrl + '/auth/?credentialToken=' + credentialToken, 'sessionId=' + sessionId + '&credentialToken=' + credentialToken + '&duration=0' + '&sms=' + smsCode + '&otpMethod=sms',
      {headers: new Headers({'Content-Type': 'application/x-www-form-urlencoded'})}).toPromise();
  }

  login(login: string, password: string) {
    let validationUrl;

    localStorage.removeItem('appKey');
    localStorage.removeItem('appSecret');
    localStorage.setItem('appKey', loginConfiguration['ovh-eu'].appKey);
    localStorage.setItem('appSecret', loginConfiguration['ovh-eu'].appSecret);

    return this.configureAccess(login, password, loginConfiguration['ovh-eu'].appKey)
      .then((infos: any) => {
        let config = {
          endpoint: 'ovh-eu',
          appKey: localStorage.getItem('appKey'),
          appSecret: localStorage.getItem('appSecret'),
          consumerKey: localStorage.getItem('consumerKey')
        };

        this.ovhRequest.setConfiguration(config);
        localStorage.removeItem('connected');
        localStorage.setItem('connected', 'true');

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

    return this.nav.setRoot(LoginPage);
  }
}
