declare var require;
import {ViewController} from 'ionic-angular';
import {Component} from '@angular/core';
import {AppVersion} from 'ionic-native';
import {AnalyticsService} from '../../services/analytics/analytics.service';
// import {SocialSharing} from 'ionic-native';

@Component({
  templateUrl: 'build/modals/about/about.html',
  providers: []
})
export class AboutModal {
  version: string = '';

  constructor(private viewCtrl: ViewController, private analytics: AnalyticsService) {
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
