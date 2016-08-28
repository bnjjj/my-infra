declare var require;
import {OvhRequestService} from '../../../services/ovh-request/ovh-request.service';
import {Injectable} from '@angular/core';
import {categoryEnum} from '../../../config/constants';
import 'rxjs/add/operator/toPromise';

let moment = require('moment');

@Injectable()
export class PrivateDatabaseWidgetService {
  constructor(private ovhRequest: OvhRequestService) {

  }

  getInfos(serviceName: string) {
    return this.ovhRequest.get([categoryEnum.PRIVATE_DATABASE.url, serviceName].join('/')).toPromise()
      .then(infos => {
        return Object.assign({}, infos, {quotaPercentage: this.getQuotaPercentage(infos.quotaSize, infos.quotaUsed)});
      });
  }

  getServiceInfos(serviceName: string) {
    return this.ovhRequest.get([categoryEnum.PRIVATE_DATABASE.url, serviceName, 'serviceInfos'].join('/')).toPromise()
      .then((resp) => {
        resp.expirationText = moment(new Date(resp.expiration)).format('DD/MM/YYYY');
        resp.warning = !moment(new Date()).add(7, 'days').isBefore(new Date(resp.expiration));

        return resp;
      });
  }

  getQuotaPercentage(quotaSize: any, quotaUsed: any) {
    switch (quotaUsed.unit) {
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

  getTasks(serviceName: string) {
    return this.ovhRequest.get([categoryEnum.PRIVATE_DATABASE.url, serviceName, 'tasks'].join('/')).toPromise();
  }

  getTask(serviceName: string, id: number) {
    return this.ovhRequest.get([categoryEnum.PRIVATE_DATABASE.url, serviceName, 'tasks', id].join('/')).toPromise();
  }
}
