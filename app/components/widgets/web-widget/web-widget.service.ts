declare var require;
import {OvhRequestService} from '../../../services/ovh-request/ovh-request.service';
import {Injectable} from 'angular2/core';
import 'rxjs/add/operator/toPromise';

let moment = require('moment');

@Injectable()
export class WebWidgetService {
  constructor(private ovhRequest: OvhRequestService) {

  }

  getInfos(serviceName: string) {
    return this.ovhRequest.get(['/hosting/web', serviceName].join('/')).toPromise()
      .then(infos => {
        return Object.assign({}, infos, {quotaPercentage: this.getQuotaPercentage(infos.quotaSize, infos.quotaUsed)});
      });
  }

  getServiceInfos(serviceName: string) {
    return this.ovhRequest.get(['/hosting/web', serviceName, 'serviceInfos'].join('/')).toPromise()
      .then((resp) => {
        resp.expirationText = moment(new Date(resp.expiration)).format('DD/MM/YYYY');
        resp.warning = !moment(new Date()).add(7, 'days').isBefore(new Date(resp.expiration));

        return resp;
      });
  }

  getQuotaPercentage(quotaSize: any, quotaUsed: any) {
    switch(quotaUsed.unit) {
      case 'MB':
        if (quotaSize.unit === 'MB') {
          return (quotaUsed.value / quotaSize.value) * 100;
        } else {
          return ((quotaUsed.value / 1000) / quotaSize.value) * 100;
        }
      case 'GB':
        if (quotaSize.unit === 'MB') {
          return ((quotaUsed.value * 1000) / quotaSize.value) * 100;
        } else {
          return (quotaUsed.value / quotaSize.value) * 100;
        }
      default:
        return (quotaUsed.value / quotaSize.value) * 100;
    }
  }

  getSsl(serviceName: string) {
    return new Promise((resolve) => {
      this.ovhRequest.get(['/hosting/web', serviceName, 'ssl'].join('/')).toPromise()
        .then((resp) => resolve(resp))
        .catch(() => resolve({status: 'none'}));
    });
  }

  createSsl(serviceName: string) {
    return this.ovhRequest.post(['/hosting/web', serviceName, 'ssl'].join('/'), JSON.stringify({})).toPromise();
  }

  deleteSsl(serviceName: string) {
    return this.ovhRequest.delete(['/hosting/web', serviceName, 'ssl'].join('/')).toPromise();
  }

  getTasks(serviceName: string) {
    return this.ovhRequest.get(['/hosting/web', serviceName, 'tasks'].join('/')).toPromise();
  }

  getTask(serviceName: string, id: number) {
    return this.ovhRequest.get(['/hosting/web', serviceName, 'tasks', id].join('/')).toPromise();
  }
}
