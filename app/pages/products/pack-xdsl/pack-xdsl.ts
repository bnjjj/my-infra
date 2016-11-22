import { Component } from '@angular/core';
import { NavParams, IONIC_DIRECTIVES, ModalController } from 'ionic-angular';
import { PackXdslService } from './pack-xdsl.service';
import { AnalyticsService } from '../../../services/analytics/analytics.service';
import { TitleSeparationComponent } from '../../../components/title-separation/title-separation';
import { ProductCore } from '../product';
import { categoryEnum } from '../../../config/constants';
import { ToastService } from '../../../services/toast/toast.service';

@Component({
  templateUrl: 'build/pages/products/pack-xdsl/pack-xdsl.html',
  directives: [IONIC_DIRECTIVES, TitleSeparationComponent],
  providers: [PackXdslService],
})
export class PackXdslPage extends ProductCore {
  packXdsl: any;
  error: boolean = false;
  loading: boolean = true;
  category = categoryEnum.PACK_XDSL;

  constructor(
    private packXdslService: PackXdslService,
    public navParams: NavParams,
    modalCtrl: ModalController,
    public analytics: AnalyticsService,
    public toast: ToastService
  ) {
    super(modalCtrl, navParams);
    this.analytics.trackView('product:packXdsl');

    this.subscription = this.packXdslService.getAll(this.serviceName)
      .finally(() => this.loading = false)
      .subscribe(
        (packXdsl) => this.packXdsl = packXdsl,
        (err) => {
          this.error = true;
          this.toast.error(`Une erreur est survenue lors du chargement : ${JSON.parse(err._body).message}`).present();
        }
      );
  }
}
