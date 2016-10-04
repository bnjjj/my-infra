import {Component} from '@angular/core';
import { NavParams, IONIC_DIRECTIVES, ModalController } from 'ionic-angular';
import {DomainService} from './domain.service';
import {AnalyticsService} from '../../../services/analytics/analytics.service';
import {TitleSeparationComponent} from '../../../components/title-separation/title-separation';
import {ProductCore} from '../product';
import {categoryEnum} from '../../../config/constants';

@Component({
  templateUrl: 'build/pages/products/domain/domain.html',
  directives: [IONIC_DIRECTIVES, TitleSeparationComponent],
  providers: [DomainService]
})
export class DomainPage extends ProductCore {
  domain: any;
  serviceName: string;
  loading: boolean = true;
  category = categoryEnum.DOMAIN;

  constructor(private domainService: DomainService, private navParams: NavParams, modalCtrl: ModalController, public analytics: AnalyticsService) {
    super(modalCtrl);
    this.analytics.trackView('product:domain');
    this.serviceName = navParams.get('serviceName');

    this.subscription = this.domainService.getAll(this.serviceName)
      .subscribe((domain) => {
        this.domain = domain;
        this.loading = false;
      });
  }

  changeTransferLockStatus(): void {
    this.domain.transferLockStatus = this.domain.transferLockStatus === 'locked' ? 'unlocked' : 'locked';
    this.domainService.putInfos(this.serviceName, { transferLockStatus: this.domain.transferLockStatus })
      .subscribe(() => this.domain.transferLockStatus = 'loading', () => {
        this.domain.transferLockStatus = this.domain.transferLockStatus === 'locked' ? 'unlocked' : 'locked';
      });
  }
}
