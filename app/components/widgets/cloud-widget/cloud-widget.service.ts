declare var require;
import {OvhRequestService} from '../../../services/ovh-request/ovh-request.service';
import {Injectable} from 'angular2/core';
import {categoryEnum} from '../../../config/constants';
import 'rxjs/add/operator/toPromise';

let moment = require('moment');

@Injectable()
export class CloudWidgetService {
  constructor(private ovhRequest: OvhRequestService) {

  }

  getInfos(serviceName: string) {
    return this.ovhRequest.get([categoryEnum.CLOUD.url, serviceName].join('/')).toPromise();
  }

  getServiceInfos(serviceName: string) {
    return this.ovhRequest.get([categoryEnum.CLOUD.url, serviceName, 'serviceInfos'].join('/')).toPromise()
      .then((resp) => {
        resp.expirationText = moment(new Date(resp.expiration)).format('DD/MM/YYYY');
        resp.warning = !moment(new Date()).add(7, 'days').isBefore(new Date(resp.expiration));

        return resp;
      });
  }

  getSnapshots(serviceName: string) {
    return this.ovhRequest.get([categoryEnum.CLOUD.url, serviceName, 'snapshot'].join('/')).toPromise()
      .then((snapshots) => {
        if (Array.isArray(snapshots)) {
          return { snapshots: this.sortInstances(snapshots, true) }
          }

          return { snapshots: this.sortInstances([]) }
      });
  }

  getInstances(serviceName: string) {
    return this.ovhRequest.get([categoryEnum.CLOUD.url, serviceName, 'instance'].join('/')).toPromise()
      .then((instances) => {
        if (Array.isArray(instances)) {
          return this.sortInstances(instances);
        }

        return this.sortInstances([]);
      });
  }

  sortInstances(instances: Array<any>, isSnapshot?: boolean) {
    let inSuccess = [];
    let inError = [];
    let inOther = [];

    instances.forEach((instance) => {
      instance.status = isSnapshot ? instance.status.toUpperCase() : instance.status;
      switch (instance.status) {
        case 'ACTIVE':
          inSuccess.push(instance);
          break;
        case 'ERROR':
          inError.push(instance);
          break;
        case 'SHUTOFF':
          inError.push(instance);
          break;
        case 'SUSPENDED':
          inError.push(instance);
          break;
        case 'STOPPED':
          inError.push(instance);
          break;
        default:
          inOther.push(instance);
      }
    });

    return { [isSnapshot ? 'list' : 'instances']: instances, inError, inSuccess, inOther };
  }

  getTasks(serviceName: string) {
    return this.ovhRequest.get([categoryEnum.CLOUD.url, serviceName, 'tasks'].join('/')).toPromise();
  }

  getTask(serviceName: string, id: number) {
    return this.ovhRequest.get([categoryEnum.CLOUD.url, serviceName, 'tasks', id].join('/')).toPromise();
  }
}
