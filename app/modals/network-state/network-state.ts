declare var require;
import {Page, ViewController, NavParams} from 'ionic-angular';
import {NetworkStateService} from './network-state.service';
import {AnalyticsService} from '../../services/analytics/analytics.service';
let moment = require('moment');

@Page({
  templateUrl: 'build/modals/network-state/network-state.html',
  providers: [NetworkStateService]
})
export class NetworkStateModal {
  loading: boolean = true;
  category: string;
  categoryName: string;
  networkTasks: any;
  error: any;

  constructor(private viewCtrl: ViewController, private networkState: NetworkStateService, params: NavParams, private analytics: AnalyticsService) {
    this.category = params.get('category');
    this.categoryName = params.get('categoryName');
    this.init();
    this.analytics.trackView('Network-state');
  }

  close(): void {
    this.viewCtrl.dismiss({});
  }

  init(): void {
    this.loading = true;
    this.networkState.getOneByCategory(this.category)
      .subscribe(networkTasks => {
        this.networkTasks = networkTasks;
        this.networkTasks.items.map(item => {
          item.pubDateText = moment(new Date(item.pubDate)).format('DD/MM/YYYY à HH:mm');

          return item;
        });
        this.loading = false;
      }, err => {
        this.error = err;
        this.loading = false;
        this.analytics.trackEvent('Network-state', 'init', 'Error', JSON.stringify(err));
      });
  }


}
