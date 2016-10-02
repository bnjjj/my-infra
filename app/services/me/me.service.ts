import {Injectable} from '@angular/core';
import {OvhRequestService} from '../ovh-request/ovh-request.service';

@Injectable()
export class MeService {
  constructor(private ovhRequest: OvhRequestService) {

  }

  getSlas() {
    return this.ovhRequest.get('/me/sla');
  }

  getSla(id: number) {
    return this.ovhRequest.get(['/me/sla', id].join('/'));
  }

  getOvhAccounts() {
    return this.ovhRequest.get('/me/ovhAccount');
  }

  getOvhAccount(id: number) {
    return this.ovhRequest.get(['/me/ovhAccount', id].join('/'));
  }

  getDebt() {
    return this.getOvhAccounts()
      .mergeMap((ids) => this.getOvhAccount(ids[0]));
  }

  getDomainTasks(state: string) {
    return this.ovhRequest.get('/me/task/domain', {search: {state}});
  }

  getContactChange(state: string) {
    return this.ovhRequest.get('/me/task/contactChange', {search: {state}});
  }
}
