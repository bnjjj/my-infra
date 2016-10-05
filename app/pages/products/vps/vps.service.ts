declare var require;
import {OvhRequestService} from '../../../services/ovh-request/ovh-request.service';
import {Observable} from 'rxjs/Observable';
import {Injectable} from '@angular/core';
const moment = require('moment');

@Injectable()
export class VpsService {
  constructor(private ovhRequest: OvhRequestService) {

  }

  getInfos(serviceName: string) {
    return this.ovhRequest.get(['/vps', serviceName].join('/'));
  }

  getDatacenter(serviceName: string) {
    return this.ovhRequest.get(`/vps/${serviceName}/datacenter`);
  }

  getIps(serviceName: string) {
    return this.ovhRequest.get(`/vps/${serviceName}/ips`);
  }

  getStatus(serviceName: string) {
    return this.ovhRequest.get(`/vps/${serviceName}/status`);
  }

  putInfos(serviceName: string, data: any) {
    return this.ovhRequest.put(['/vps', serviceName].join('/'), JSON.stringify(data));
  }

  getServiceInfos(serviceName: string) {
    return this.ovhRequest.get(['/vps', serviceName, 'serviceInfos'].join('/'))
      .map((resp) => {
        resp.expirationText = moment(new Date(resp.expiration)).format('DD/MM/YYYY');
        resp.warning = !moment(new Date()).add(7, 'days').isBefore(new Date(resp.expiration));

        return resp;
      });
  }

  getDistributionInfos(serviceName: string) {
    return this.ovhRequest.get(['/vps', serviceName, 'distribution'].join('/'));
  }

  getTasks(serviceName: string) {
    return this.ovhRequest.get(['/vps', serviceName, 'tasks'].join('/'));
  }

  getTask(serviceName: string, id: number) {
    return this.ovhRequest.get(['/vps', serviceName, 'tasks', id].join('/'));
  }

  reboot(serviceName: string) {
    return this.ovhRequest.post(['/vps', serviceName, 'reboot'].join('/'), JSON.stringify({}));
  }

  getAll(serviceName: string) {
    let responseObj = {};
    return Observable.merge(
      this.getInfos(serviceName),
      this.getServiceInfos(serviceName),
      this.getDistributionInfos(serviceName).map((distribution) => ({ distribution })),
      this.getDatacenter(serviceName).map((datacenter) => ({ datacenter })),
      this.getIps(serviceName).map((ips) => ({ ips }))
    ).map((resp) => Object.assign(responseObj, resp));
  }

  getMonitoring(serviceName: string) {
    let responseObj = {};
    return Observable.merge(
      this.getStatus(serviceName)
    ).map((resp) => Object.assign(responseObj, resp));
  }
}
