import {Http, Headers} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import {Injectable} from 'angular2/core';
import {NavController, Alert} from 'ionic-angular';
import 'rxjs/add/operator/toPromise';
import {OvhRequestService} from '../../services/ovh-request/ovh-request.service';
import {AnalyticsService} from '../../services/analytics/analytics.service';
import {LoginPage} from './login';
import {endpointsConfiguration, credentialParams} from './config';

@Injectable()
export class LoginService {
  constructor(private http: Http, public ovhRequest: OvhRequestService, private nav: NavController, private analytics: AnalyticsService) {
  }

  requestToken(endpoint: string) {
    if(!endpointsConfiguration[endpoint]) {
      let alert = Alert.create({
        title: 'Site ' + endpoint,
        message: 'Le site sur lequel vous souhaitez vous connecter sera bientôt disponible',
        buttons: ['OK']
      });
      this.nav.present(alert);
      return Promise.reject(new Error('Site ' + endpoint + ' indisponible'));
    }
    this.ovhRequest.setConfiguration(null);
    this.ovhRequest.setConfiguration(endpointsConfiguration[endpoint]);
    return this.http.post(endpointsConfiguration[endpoint].urlRoot + '/auth/credential', JSON.stringify(credentialParams),
      {headers: new Headers({'Content-Type': 'application/json', 'X-Ovh-Application': endpointsConfiguration[endpoint].appKey})}).toPromise()
      .then(resp => {
        let validationInfo = resp.json();
        let config = {
          consumerKey: validationInfo.consumerKey,
          validationUrl: validationInfo.validationUrl,
        };
        this.ovhRequest.setConfiguration(config);
        return this.ovhRequest.config;
      });
  }

  startLogin(endpoint: string) {
    return this.requestToken(endpoint);
  }
  checkConfig() {
    return this.ovhRequest.checkConfig();
  }
  checkLogin() {
    return this.ovhRequest.get('/auth/currentCredential').toPromise();
  }
  logout() {
    this.ovhRequest.setConfiguration(null);
    localStorage.removeItem('widgets');
    localStorage.removeItem('credentials');
    return this.nav.setRoot(LoginPage);
  }
}
