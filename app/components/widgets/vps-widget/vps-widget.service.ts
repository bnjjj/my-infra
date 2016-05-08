declare var require;
import {OvhRequestService} from '../../../services/ovh-request/ovh-request.service';
import {Injectable} from 'angular2/core';
import 'rxjs/add/operator/toPromise';

let moment = require('moment');

@Injectable()
export class VpsWidgetService {
  constructor(private ovhRequest: OvhRequestService) {

  }

  getInfos(serviceName: string) {
    return this.ovhRequest.get(['/vps', serviceName].join('/')).toPromise();
  }

  putInfos(serviceName: string, data: any) {
    return this.ovhRequest.put(['/vps', serviceName].join('/'), JSON.stringify(data));
  }

  getServiceInfos(serviceName: string) {
    return this.ovhRequest.get(['/vps', serviceName, 'serviceInfos'].join('/')).toPromise()
      .then((resp) => {
        resp.expirationText = moment(new Date(resp.expiration)).format('DD/MM/YYYY');
        resp.warning = !moment(new Date()).add(7, 'days').isBefore(new Date(resp.expiration));

        return resp;
      });
  }

  getDistributionInfos(serviceName: string) {
    return this.ovhRequest.get(['/vps', serviceName, 'distribution'].join('/')).toPromise();
  }

  getTasks(serviceName: string) {
    return this.ovhRequest.get(['/vps', serviceName, 'tasks'].join('/')).toPromise();
  }

  getTask(serviceName: string, id: number) {
    return this.ovhRequest.get(['/vps', serviceName, 'tasks', id].join('/')).toPromise();
  }

  reboot(serviceName: string) {
    return this.ovhRequest.post(['/vps', serviceName, 'reboot'].join('/'), JSON.stringify({})).toPromise();
  }
}
