declare var require;
import { OvhRequestService } from '../../../services/ovh-request/ovh-request.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';

const moment = require('moment');

@Injectable()
export class PackXdslService {
  constructor(private ovhRequest: OvhRequestService) {

  }

  get() {
    return this.ovhRequest.get('/pack/xdsl');
  }

  getInfos(serviceName: string) {
    return this.ovhRequest.get(`/pack/xdsl/${serviceName}`);
  }

  putInfos(serviceName: string, data: any) {
    return this.ovhRequest.put(`/pack/xdsl/${serviceName}`, JSON.stringify(data));
  }

  getServiceInfos(serviceName: string) {
    return this.ovhRequest.get(`/pack/xdsl/${serviceName}/serviceInfos`).toPromise()
      .then((resp) => {
        resp.creation = moment(new Date(resp.creation)).format('DD/MM/YYYY');
        resp.engagedUpTo = moment(new Date(resp.engagedUpTo)).format('DD/MM/YYYY');
        resp.expirationText = moment(new Date(resp.expiration)).format('DD/MM/YYYY');
        resp.warning = !moment(new Date()).add(7, 'days').isBefore(new Date(resp.expiration));

        return resp;
      });
  }

  getTasks(serviceName: string) {
    return this.ovhRequest.get(`/pack/xdsl/${serviceName}/tasks`);
  }

  getTask(serviceName: string, id: number) {
    return this.ovhRequest.get(`/pack/xdsl/${serviceName}/tasks/${id}`);
  }

  getServices(serviceName: string) {
    return this.ovhRequest.get(`/pack/xdsl/${serviceName}/services`);
  }

  getDomainServices(serviceName: string) {
    return this.ovhRequest.get(`/pack/xdsl/${serviceName}/domain/services`);
  }

  getExchangeAccountServices(serviceName: string) {
    return this.ovhRequest.get(`/pack/xdsl/${serviceName}/exchangeAccount/services`);
  }

  getExchangeOrganizationServices(serviceName: string) {
    return this.ovhRequest.get(`/pack/xdsl/${serviceName}/exchangeOrganization/services`);
  }

  getHostedEmailServices(serviceName: string) {
    return this.ovhRequest.get(`/pack/xdsl/${serviceName}/hostedEmail/services`);
  }

  getHubicServices(serviceName: string) {
    return this.ovhRequest.get(`/pack/xdsl/${serviceName}/hubic/services`);
  }

  getVoipEcofaxServices(serviceName: string) {
    return this.ovhRequest.get(`/pack/xdsl/${serviceName}/voipEcofax/services`);
  }

  getVoipLineServices(serviceName: string) {
    return this.ovhRequest.get(`/pack/xdsl/${serviceName}/voipLine/services`);
  }

  getXdslAccessServices(serviceName: string) {
    return this.ovhRequest.get(`/pack/xdsl/${serviceName}/xdslAccess/services`);
  }

  getAll(serviceName: string) {
    return Observable.forkJoin(
      this.getInfos(serviceName),
      this.getServiceInfos(serviceName),
      this.getServices(serviceName),
      this.getDomainServices(serviceName),
      this.getExchangeAccountServices(serviceName),
      this.getExchangeOrganizationServices(serviceName),
      this.getHostedEmailServices(serviceName),
      this.getHubicServices(serviceName),
      this.getVoipEcofaxServices(serviceName),
      this.getVoipLineServices(serviceName),
      this.getXdslAccessServices(serviceName)
    ).map((resp) => Object.assign({}, resp[0], resp[1], {
      services: resp[2],
      servicesLinked: {
        domain: resp[3],
        exchangeAccount: resp[4],
        exchangeOrganization: resp[5],
        hostedEmail: resp[6],
        hubic: resp[7],
        voipEcofax: resp[8],
        voipLine: resp[9],
        xdslAccess: resp[10]
      }
    }));
  }
}
