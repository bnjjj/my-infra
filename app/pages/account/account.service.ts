import {Injectable} from '@angular/core';
import {OvhRequestService} from '../../services/ovh-request/ovh-request.service';
import {AnalyticsService} from '../../services/analytics/analytics.service';

import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/share';

@Injectable()
export class AccountService {
  private dataStore: {
    accountInfos: any,
    newAccountModel: any,
    meModel: any
  };
  accountInfosObservable: Observable<any>;
  accountInfosObserver: Observer<any>;

  constructor(
    private ovhRequest: OvhRequestService,
    private analytics: AnalyticsService
  ) {
    this.dataStore = { accountInfos: {}, newAccountModel: {}, meModel: {} };

    this.accountInfosObservable = new Observable((observer) =>  this.accountInfosObserver = observer)
      .share();
  }

  getNewAccountModel() {
    this.ovhRequest.get('/newAccount.json')
      .finally(() => this.accountInfosObserver.next(this.dataStore))
      .subscribe(
        (resp) => {
          this.dataStore = Object.assign({}, this.dataStore, { newAccountModel: resp });
          this.accountInfosObserver.next(this.dataStore);
        },
        (err) => {
          this.accountInfosObserver.error(err);
          this.analytics.trackEvent('Account', 'getNewAccountModel', 'Error', JSON.stringify(err));
        }
      );
  }

  getMeModel() {
    // return this.ovhRequest.get('/me.json');
    this.ovhRequest.get('/me.json')
      .finally(() => this.accountInfosObserver.next(this.dataStore))
      .subscribe(
        (resp) => this.dataStore = Object.assign({}, this.dataStore, { meModel: resp }),
        (err) => {
          this.accountInfosObserver.error(err);
          this.analytics.trackEvent('Account', 'getMeModel', 'Error', JSON.stringify(err));
        }
      );
  }

  getInfos() {
    let accountInfos: any;

    this.ovhRequest.get('/me')
      .mergeMap((me) => {
        accountInfos = me;
        return this.ovhRequest.get(`/newAccount/legalform?country=${me.country}`);
      })
      .map((legalformEnum) => {
        accountInfos.legalformEnum = legalformEnum;
        return accountInfos;
      })
      .finally(() => this.accountInfosObserver.next(this.dataStore))
      .subscribe(
        (resp) => this.dataStore = Object.assign({}, this.dataStore, { accountInfos: resp }),
        (err) => {
          this.accountInfosObserver.error(err);
          this.analytics.trackEvent('Account', 'getInfos', 'Error', JSON.stringify(err));
        }
      );
  }

  save(accountInfos: any) {
    this.ovhRequest.put('/me', JSON.stringify(accountInfos))
      .finally(() => this.accountInfosObserver.next(this.dataStore))
      .subscribe(
        () => this.dataStore = Object.assign({}, this.dataStore, { accountInfos }),
        (err) => {
          this.accountInfosObserver.error(err);
          this.analytics.trackEvent('Account', 'save', 'Error', JSON.stringify(err));
        }
      );
  }
}
