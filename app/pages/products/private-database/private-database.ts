import { Component } from '@angular/core';
import { NavParams, IONIC_DIRECTIVES, ModalController } from 'ionic-angular';
import { ToastService } from '../../../services/toast/toast.service';
import { PrivateDatabaseService } from './private-database.service';
import { AnalyticsService } from '../../../services/analytics/analytics.service';
import { TitleSeparationComponent } from '../../../components/title-separation/title-separation';
import { ProductCore } from '../product';
import { categoryEnum } from '../../../config/constants';

@Component({
  templateUrl: 'build/pages/products/private-database/private-database.html',
  directives: [IONIC_DIRECTIVES, TitleSeparationComponent],
  providers: [PrivateDatabaseService]
})
export class PrivateDatabasePage extends ProductCore {
  db: any;
  error: boolean = false;
  loading: boolean = true;
  category = categoryEnum.PRIVATE_DATABASE;

  constructor(private privateDatabaseService: PrivateDatabaseService, public navParams: NavParams, modalCtrl: ModalController,
    public analytics: AnalyticsService, public toast: ToastService) {
    super(modalCtrl, navParams);
    this.analytics.trackView('product:private-database');

    this.subscription = this.privateDatabaseService.getAll(this.serviceName)
      .finally(() => this.loading = false)
      .subscribe(
        (db) => this.db = db,
        (err) => {
          this.error = true;
          this.toast.error('Une erreur est survenue lors du chargement : ' + JSON.parse(err._body).message).present();
        }
      );
  }
}
