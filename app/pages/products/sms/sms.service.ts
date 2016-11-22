declare var require;
import { OvhRequestService } from '../../../services/ovh-request/ovh-request.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';

const moment = require('moment');

@Injectable()
export class SmsService {
  constructor(private ovhRequest: OvhRequestService) {

  }

  get() {
    return this.ovhRequest.get('/sms');
  }

  getInfos(serviceName: string) {
    return this.ovhRequest.get(`/sms/${serviceName}`);
  }

  putInfos(serviceName: string, data: any) {
    return this.ovhRequest.put(`/sms/${serviceName}`, JSON.stringify(data));
  }

  getServiceInfos(serviceName: string) {
    return this.ovhRequest.get(`/sms/${serviceName}/serviceInfos`);
  }

  getTasks(serviceName: string) {
    return this.ovhRequest.get(`/sms/${serviceName}/task`);
  }

  getTask(serviceName: string, id: number) {
    return this.ovhRequest.get(`/sms/${serviceName}/task/${id}`);
  }

  getIncomings(serviceName: string) {
    return this.ovhRequest.get(`/sms/${serviceName}/incoming`, {
      search: {
        'creationDatetime.from': moment().startOf('month').format('YYYY-MM-DD'),
        'creationDatetime.to': moment().endOf('month').format('YYYY-MM-DD')
      }
    }).map((incomings) => incomings.length);
  }

  getJobs(serviceName: string) {
    return this.ovhRequest.get(`/sms/${serviceName}/jobs`)
      .map((jobs) => jobs.length);
  }

  getOutgoings(serviceName: string) {
    return this.ovhRequest.get(`/sms/${serviceName}/outgoing`, {
      search: {
        'creationDatetime.from': moment().startOf('month').format('YYYY-MM-DD'),
        'creationDatetime.to': moment().endOf('month').format('YYYY-MM-DD')
      }
    }).map((outgoings) => outgoings.length);
  }

  getAll(serviceName: string) {
    return Observable.forkJoin(
      this.getInfos(serviceName),
      this.getServiceInfos(serviceName),
      this.getIncomings(serviceName),
      this.getJobs(serviceName),
      this.getOutgoings(serviceName)
    ).map((resp) => Object.assign({}, resp[0], resp[1], {
      consumption: {
        incomings: resp[2],
        jobs: resp[3],
        outgoings: resp[4]
      }
    }));
  }
}
