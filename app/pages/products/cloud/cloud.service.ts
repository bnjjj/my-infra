declare var require;
import {OvhRequestService} from '../../../services/ovh-request/ovh-request.service';
import {Injectable} from '@angular/core';
import 'rxjs/add/operator/toPromise';
import {Observable} from 'rxjs/Observable';
import {categoryEnum} from '../../../config/constants';

let moment = require('moment');

@Injectable()
export class CloudService {
  constructor(private ovhRequest: OvhRequestService) {

  }

  get() {
    return this.ovhRequest.get(categoryEnum.CLOUD.url);
  }

  getInfos(serviceName: string) {
    return this.ovhRequest.get([categoryEnum.CLOUD.url, serviceName].join('/'));
  }

  getServiceInfos(serviceName: string) {
    return this.ovhRequest.get([categoryEnum.CLOUD.url, serviceName, 'serviceInfos'].join('/'))
      .map((resp) => {
        resp.expirationText = moment(new Date(resp.expiration)).format('DD/MM/YYYY');
        resp.warning = !moment(new Date()).add(7, 'days').isBefore(new Date(resp.expiration));

        return resp;
      });
  }

  getSnapshots(serviceName: string) {
    return this.ovhRequest.get([categoryEnum.CLOUD.url, serviceName, 'snapshot'].join('/'))
      .map((snapshots) => {
        if (Array.isArray(snapshots)) {
          return { snapshots: this.sortInstances(snapshots, true) };
        }

        return { snapshots: this.sortInstances([]) };
      });
  }

  getInstances(serviceName: string) {
    return this.ovhRequest.get([categoryEnum.CLOUD.url, serviceName, 'instance'].join('/'))
      .map((instances) => {
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
      instance.creationDateText = moment(new Date(instance.creationDate)).format('DD/MM/YYYY à HH:mm');
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

  rebootInstance(serviceName: string, id: string, type: string) {
    return this.ovhRequest.post([categoryEnum.CLOUD.url, serviceName, 'instance', id, 'reboot'].join('/'),
      JSON.stringify({ type }));
  }

  deleteSnapshot(serviceName: string, id: string) {
    return this.ovhRequest.delete([categoryEnum.CLOUD.url, serviceName, 'snapshot', id].join('/'));
  }

  createSnapshot(serviceName: string, id: string, snapshotName: string) {
    return this.ovhRequest.post([categoryEnum.CLOUD.url, serviceName, 'instance', id, 'snapshot'].join('/'),
      JSON.stringify({ snapshotName }));
  }

  getIps(serviceName) {
    return this.ovhRequest.get([categoryEnum.CLOUD.url, serviceName, 'ip'].join('/'));
  }

  getAll(serviceName: string) {
    return Observable.forkJoin(this.getInfos(serviceName),
      this.getServiceInfos(serviceName),
      this.getInstances(serviceName),
      this.getSnapshots(serviceName),
      this.getIps(serviceName)
    ).map((resp) => Object.assign({}, resp[0], resp[1], resp[2], resp[3], { ips: resp[4] }));
  }
}
