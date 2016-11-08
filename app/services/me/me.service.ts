import { Injectable } from '@angular/core';
import { OvhRequestService } from '../ovh-request/ovh-request.service';
import { AlertsService } from '../alerts/alerts.service';
import { Observable } from 'rxjs/Observable';
declare var require;
const moment = require('moment');

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
    return this.ovhRequest.get(['/me/sla', id].join('/'))
      .map((sla) => Object.assign({}, sla, { dateText:  moment(new Date(sla.date)).format('DD/MM/YYYY') }));
  }

  getSlaCanBeApplied(id: number) {
    return this.ovhRequest.get(`/me/sla/${id}/canBeApplied`);
  }

  getSlasAvailable() {
    return this.getSlas()
      .mergeMap((slas) => {
        return Observable.merge(...slas.map((sla) => {
          return this.getSlaCanBeApplied(sla).map((applied) => ({ id: sla, applied }));
        }));
      })
      .reduce((list, sla) => [...list, sla], [])
      .filter((sla) => sla.applied === true);
  }

  getSlasDetails(availableIds) {
    return Observable.forkJoin(...availableIds.map((id) => this.getSla(id)));
  }

  applySla(id: number) {
    return this.ovhRequest.post(`/me/sla/${id}/apply`, JSON.stringify({}));
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
