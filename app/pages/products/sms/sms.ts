import { Component } from '@angular/core';
import { NavParams, IONIC_DIRECTIVES, ModalController } from 'ionic-angular';
import { SmsService } from './sms.service';
import { AnalyticsService } from '../../../services/analytics/analytics.service';
import { TitleSeparationComponent } from '../../../components/title-separation/title-separation';
import { ProductCore } from '../product';
import { categoryEnum } from '../../../config/constants';
import { ToastService } from '../../../services/toast/toast.service';

@Component({
  templateUrl: 'build/pages/products/sms/sms.html',
  directives: [IONIC_DIRECTIVES, TitleSeparationComponent],
  providers: [SmsService],
})
export class SmsPage extends ProductCore {
  sms: any;
  error: boolean = false;
  loading: boolean = true;
  category = categoryEnum.SMS;

  constructor(
    private smsService: SmsService,
    public navParams: NavParams,
    modalCtrl: ModalController,
    public analytics: AnalyticsService,
    public toast: ToastService
  ) {
    super(modalCtrl, navParams);
    // @TODO: enable tracking by uncommenting the next line of code.
    // this.analytics.trackView('product:sms');

    this.subscription = this.smsService.getAll(this.serviceName)
      .finally(() => this.loading = false)
      .subscribe(
        (sms) => {
          // if (sms.creditsLeft < 0) {
          //   sms.creditsLeft = 0
          // };
          this.sms = sms;
          console.log('salut');
        },
        (err) => {
          this.error = true;
          this.toast.error(`Une erreur est survenue lors du chargement : ${JSON.parse(err._body).message}`).present();
        }
      );
  }
}
