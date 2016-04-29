declare var require;
import {OvhRequestService} from '../../../services/ovh-request/ovh-request.service';
import {Injectable} from 'angular2/core';
import 'rxjs/add/operator/toPromise';

let moment = require('moment');

@Injectable()
export class DedicatedWidgetService {
  constructor(private ovhRequest: OvhRequestService) {

  }

  getInfos(serviceName: string) {
    return this.ovhRequest.get(['/dedicated/server', serviceName].join('/')).toPromise();
  }

  getServiceInfos(serviceName: string) {
    return this.ovhRequest.get(['/dedicated/server', serviceName, 'serviceInfos'].join('/')).toPromise()
      .then((resp) => {
        resp.expirationText = moment(new Date(resp.expiration)).format('DD/MM/YYYY');
        resp.warning = !moment(new Date()).add(7, 'days').isBefore(new Date(resp.expiration));

        return resp;
      });
  }

  getTasks(serviceName: string) {
    return this.ovhRequest.get(['/dedicated/server', serviceName, 'task'].join('/')).toPromise();
  }

  getTask(serviceName: string, id: number) {
    return this.ovhRequest.get(['/dedicated/server', serviceName, 'task', id].join('/')).toPromise();
  }

  reboot(serviceName: string) {
    return this.ovhRequest.post(['/dedicated/server', serviceName, 'reboot'].join('/'), null).toPromise();
  }
}
