declare var require;
import {Page, ViewController, NavParams} from 'ionic-angular';
import {AppVersion} from 'ionic-native';
import {AnalyticsService} from '../../services/analytics/analytics.service';
// import {SocialSharing} from 'ionic-native';

@Page({
  templateUrl: 'build/modals/about/about.html',
  providers: []
})
export class AboutModal {
  version: string = '';

  constructor(private viewCtrl: ViewController, params: NavParams, private analytics: AnalyticsService) {
    this.analytics.trackView('About-page');
    AppVersion.getVersionNumber()
      .then(
        (version) => this.version = version,
        (err) => console.log(err)
      );
  }

  // share(): void {

  // }

  close(): void {
    this.viewCtrl.dismiss({});
  }
}
