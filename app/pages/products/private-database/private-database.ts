import {Component} from '@angular/core';
import { NavParams, IONIC_DIRECTIVES, ModalController } from 'ionic-angular';
import {ToastService} from '../../../services/toast/toast.service';
import {PrivateDatabaseService} from './private-database.service';
import {AnalyticsService} from '../../../services/analytics/analytics.service';
import {TitleSeparationComponent} from '../../../components/title-separation/title-separation';
import {ProductCore} from '../product';
import {categoryEnum} from '../../../config/constants';

@Component({
  templateUrl: 'build/pages/products/private-database/private-database.html',
  directives: [IONIC_DIRECTIVES, TitleSeparationComponent],
  providers: [PrivateDatabaseService]
})
export class PrivateDatabasePage extends ProductCore {
  db: any;
  serviceName: string;
  loading: boolean = true;
  category = categoryEnum.PRIVATE_DATABASE;

  constructor(private privateDatabaseService: PrivateDatabaseService, private navParams: NavParams, modalCtrl: ModalController,
    public analytics: AnalyticsService, public toast: ToastService) {
    super(modalCtrl);
    this.analytics.trackView('product:private-database');
    this.serviceName = navParams.get('serviceName');

    this.subscription = this.privateDatabaseService.getAll(this.serviceName)
      .subscribe((db) => {
        this.db = db;
        this.loading = false;
      });
  }
}
