import {Injectable} from '@angular/core';
declare var require;
const moment = require('moment');

export interface OvhAlert {
  type: string;
  name: string;
  description: string;
  link: string;
}

@Injectable()
export class AlertsService {
  constructor() {

  }

  getSLA(slas: any): OvhAlert {
    return {
      type: 'SLA',
      name: 'Réduction SLA',
      description: `Vous avez droit à ${slas} réduction(s) SLA`,
      link: 'https://www.ovh.com/manager/web/#/billing/sla'
    };
  }

  getContact(contactChanges: any): OvhAlert {
    return {
      type: 'CONTACT_CHANGES',
      name: 'Changement de contact',
      description: `Vous avez ${contactChanges.length} demande(s) de contact en attente de votre approbation`,
      link: 'https://www.ovh.com/manager/web/#/useraccount/contacts?tab=REQUESTS'
    };
  }

  getDomainTasks(domainTasks: any): OvhAlert {
    return {
      type: 'DOMAIN_TASKS',
      name: 'Opération domaine',
      description: `Vous avez ${domainTasks.length} opération(s) en erreur sur des domaines`,
      link: 'https://www.ovh.com/manager/web/index.html#/configuration/domains_operations'
    };
  }

  getDebt(debt: any): OvhAlert {
    return {
      type: 'DEBT',
      name: 'Solde négatif',
      description: `Votre compte est débiteur de ${-debt.value} ${debt.currencyCode}`,
      link: 'https://www.ovh.com/manager/dedicated/index.html#/billing/ovhaccount'
    };
  }

  get(type?: string) {
    let alertsStorage = localStorage.getItem('alerts');
    if (alertsStorage) {
      let alertStorageJSON = JSON.parse(alertsStorage);
      let alertsFiltered = Object.keys(alertStorageJSON || {})
        .filter((key) => moment(alertStorageJSON[key].timestamp).isAfter(moment()))
        .reduce((globalObj, key) => Object.assign({}, globalObj, {[key]: alertStorageJSON[key]}), {});

      return type ? alertsFiltered[type] : alertsFiltered;
    }

    return {};
  }

  remove(type: string, duration: string) {
    let alerts = this.get();
    localStorage.setItem('alerts', JSON.stringify(Object.assign({}, alerts, {
        [type]: { timestamp: moment().add(1, duration.toLowerCase()).toISOString() }
      })
    ));
  }
}
