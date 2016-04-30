import {Http, Headers} from 'angular2/http';
import {Injectable} from 'angular2/core';
import {Storage, LocalStorage, NavController} from 'ionic-angular';
import 'rxjs/add/operator/toPromise';
import {OvhRequestService} from '../../services/ovh-request/ovh-request.service';
import {AnalyticsService} from '../../services/analytics/analytics.service';
import {LoginPage} from './login';

@Injectable()
export class LoginService {
  localStorage: Storage;
  constructor(private http: Http, private ovhRequest: OvhRequestService, private nav: NavController, private analytics: AnalyticsService) {
    this.localStorage = new Storage(LocalStorage);
  }

  createApplication(login: string, password: string) {
    let appName = 'myinfra-mobile' + Date.now();
    let credentials: any;
    return this.http.post('https://eu.api.ovh.com/createApp/', 'nic=' + login.toLowerCase() + '&password=' + password + '&applicationName=' + appName + '&applicationDescription=ovh-mobile',
      {headers: new Headers({'Content-Type': 'application/x-www-form-urlencoded'})}).toPromise()
      .then(resp => {
        this.analytics.trackEvent('LoginService', 'createApplication', 'Good', resp);

        let preArray;
        let tempDiv = document.createElement('div');

        tempDiv.innerHTML = resp.text();
        preArray = tempDiv.getElementsByTagName('pre');

        if (preArray.length > 3) {
          credentials = {
            appKey: preArray[2].innerHTML,
            appSecret: preArray[3].innerHTML
          };
        } else {
          return Promise.reject('Error during authentication');
        }

        localStorage.removeItem('appKey');
        localStorage.removeItem('appSecret');
        localStorage.setItem('appKey', credentials.appKey);
        localStorage.setItem('appSecret', credentials.appSecret);

        return credentials;
      });
  }

  configureAccess(login: string, password: string, appKey: string) {
    let accessRules = '{"accessRules":[{"method":"GET","path":"/*"},{"method":"POST","path":"/*"},{"method":"PUT","path":"/*"},{"method":"DELETE","path":"/*"}]}';
    let validationInfo: any;

    return this.http.post('https://eu.api.ovh.com/1.0/auth/credential', accessRules,
      {headers: new Headers({'Content-Type': 'application/json', 'X-Ovh-Application': appKey})}).toPromise()
      .then(resp => {
        validationInfo = resp.json();

        this.analytics.trackEvent('LoginService', 'configureAccess', 'Good', resp);

        localStorage.removeItem('consumerKey');
        localStorage.setItem('consumerKey', validationInfo.consumerKey);

        return this.http.get(validationInfo.validationUrl).toPromise();
      })
      .then(resp => {
        let inputArray, loginId, passwordId;
        let tempDiv = document.createElement('div');
        let credentialToken = validationInfo.validationUrl.split('credentialToken=')[1];
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
      .then(resp => {
        let tmpDiv = document.createElement('div')
        tmpDiv.innerHTML = resp.text();

        if (tmpDiv.getElementsByClassName('error').length !== 0) {
          return Promise.reject('Error during activation token');
        }

        this.analytics.trackEvent('LoginService', 'finalValidation', 'Good', resp);
      });
  }

  login(login: string, password: string) {
    let validationUrl;

    return this.createApplication(login, password)
      .then(resp => this.configureAccess(login, password, resp.appKey))
      .then(() => {
        let config = {
          endpoint: 'ovh-eu',
          appKey: localStorage.getItem('appKey'),
          appSecret: localStorage.getItem('appSecret'),
          consumerKey: localStorage.getItem('consumerKey')
        };

        this.ovhRequest.setConfiguration(config);
        localStorage.removeItem('connected');
        localStorage.setItem('connected', 'true');
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
