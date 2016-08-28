declare var require;
import {OvhRequestService} from '../../../services/ovh-request/ovh-request.service';
import {Injectable} from '@angular/core';
import 'rxjs/add/operator/toPromise';

let moment = require('moment');

@Injectable()
export class DomainWidgetService {
  constructor(private ovhRequest: OvhRequestService) {

  }

  getInfos(serviceName: string) {
    return this.ovhRequest.get(['/domain', serviceName].join('/')).toPromise();
  }

  putInfos(serviceName: string, data: any) {
    return this.ovhRequest.put(['/domain', serviceName].join('/'), JSON.stringify(data));
  }

  getServiceInfos(serviceName: string) {
    return this.ovhRequest.get(['/domain', serviceName, 'serviceInfos'].join('/')).toPromise()
      .then((resp) => {
        resp.expirationText = moment(new Date(resp.expiration)).format('DD/MM/YYYY');
        resp.warning = !moment(new Date()).add(7, 'days').isBefore(new Date(resp.expiration));

        return resp;
      });
  }

  getTasks(serviceName: string) {
    return this.ovhRequest.get(['/domain', serviceName, 'task'].join('/')).toPromise();
  }

  getTask(serviceName: string, id: number) {
    return this.ovhRequest.get(['/domain', serviceName, 'task', id].join('/')).toPromise();
  }
}
