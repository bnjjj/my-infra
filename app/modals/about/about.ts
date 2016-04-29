declare var require;
import {Page, ViewController, NavParams} from 'ionic-angular';
import {AnalyticsService} from '../../services/analytics/analytics.service';
// import {SocialSharing} from 'ionic-native';

@Page({
  templateUrl: 'build/modals/about/about.html',
  providers: []
})
export class AboutModal {

  constructor(private viewCtrl: ViewController, params: NavParams, private analytics: AnalyticsService) {
    this.analytics.trackView('About-page');
  }

  // share(): void {

  // }

  close(): void {
    this.viewCtrl.dismiss({});
  }
}
