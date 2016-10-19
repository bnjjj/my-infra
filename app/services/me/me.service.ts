import {Injectable} from '@angular/core';
import {OvhRequestService} from '../ovh-request/ovh-request.service';
import {AlertsService} from '../alerts/alerts.service';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class MeService {
  constructor(private ovhRequest: OvhRequestService, public alertsService: AlertsService) {

  }

  getSlas() {
    let alertsFilter = Object.keys(this.alertsService.get());
    if (alertsFilter.indexOf('SLA') !== -1) {
      return Observable.create((subscriber) => subscriber.next([]));
    }

    return this.ovhRequest.get('/me/sla');
  }

  getSla(id: number) {
    return this.ovhRequest.get(['/me/sla', id].join('/'));
  }

  getSlaCanBeApplied(id: number) {
    return this.ovhRequest.get(`/me/sla/${id}/canBeApplied`);
  }

  getSlasAvailable() {
    return this.getSlas()
      .mergeMap((slas) => Observable.merge(slas.map((sla) => this.getSlaCanBeApplied(sla))))
      .mergeMap((slaApplied) => slaApplied)
      .reduce((count, slaApplied) => slaApplied ? count + 1 : count, 0);

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

  getDebtAccount() {
    return this.ovhRequest.get('/me/debtAccount');
  }

  getDomainTasks(status: string) {
    let alertsFilter = Object.keys(this.alertsService.get());
    if (alertsFilter.indexOf('DOMAIN_TASKS') !== -1) {
      return Observable.create((subscriber) => subscriber.next([]));
    }

    return this.ovhRequest.get('/me/task/domain', {search: {status}});
  }

  getContactChange(state: string) {
    let alertsFilter = Object.keys(this.alertsService.get());
    if (alertsFilter.indexOf('CONTACT_CHANGES') !== -1) {
      return Observable.create((subscriber) => subscriber.next([]));
    }

    return this.ovhRequest.get('/me/task/contactChange', {search: {state}});
  }

  getAmount() {
    let ovhAccountInfos;
    let alertsFilter = Object.keys(this.alertsService.get());

    if (alertsFilter.indexOf('DEBT') !== -1) {
      return Observable.create((subscriber) => subscriber.next({currencyCode: null, value: 0}));
    }

    return this.getDebt()
      .mergeMap((ovhAccountResp) => {
        ovhAccountInfos = ovhAccountResp;

        return this.getDebtAccount();
      })
      .map((debtAccount) => {
        let value = ovhAccountInfos.balance.value - debtAccount.dueAmount.value;

        return { currencyCode: debtAccount.dueAmount.currencyCode, value };
      });
  }
}
