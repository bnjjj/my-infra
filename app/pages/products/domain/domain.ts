import {Component} from '@angular/core';
import { NavParams, IONIC_DIRECTIVES, ModalController } from 'ionic-angular';
import {DomainService} from './domain.service';
import {AnalyticsService} from '../../../services/analytics/analytics.service';
import {TitleSeparationComponent} from '../../../components/title-separation/title-separation';
import {ProductCore} from '../product';
import { categoryEnum } from '../../../config/constants';
import { ToastService } from '../../../services/toast/toast.service';

@Component({
  templateUrl: 'build/pages/products/domain/domain.html',
  directives: [IONIC_DIRECTIVES, TitleSeparationComponent],
  providers: [DomainService]
})
export class DomainPage extends ProductCore {
  domain: any;
  error: boolean = false;
  loading: boolean = true;
  category = categoryEnum.DOMAIN;

  constructor(private domainService: DomainService, public navParams: NavParams, modalCtrl: ModalController,
      public analytics: AnalyticsService, public toast: ToastService) {
    super(modalCtrl, navParams);
    this.analytics.trackView('product:domain');

    this.subscription = this.domainService.getAll(this.serviceName)
      .finally(() => this.loading = false)
      .subscribe(
        (domain) => this.domain = domain,
        (err) => {
          this.error = true;
          this.toast.error('Une erreur est survenue lors du chargement : ' + JSON.parse(err._body).message).present();
        }
      );
  }

  changeTransferLockStatus(): void {
    this.domain.transferLockStatus = this.domain.transferLockStatus === 'locked' ? 'unlocked' : 'locked';
    this.domainService.putInfos(this.serviceName, { transferLockStatus: this.domain.transferLockStatus })
      .subscribe(
        () => this.domain.transferLockStatus = 'loading',
        () => this.domain.transferLockStatus = this.domain.transferLockStatus === 'locked' ? 'unlocked' : 'locked'
      );
  }
}
