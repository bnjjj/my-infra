import {Component, OnDestroy} from '@angular/core';
import { NavParams, IONIC_DIRECTIVES, ModalController } from 'ionic-angular';
import {DomainService} from './domain.service';
import {TitleSeparationComponent} from '../../../components/title-separation/title-separation';
import {ProductCore} from '../product';
import {categoryEnum} from '../../../config/constants';

@Component({
  templateUrl: 'build/pages/products/domain/domain.html',
  directives: [IONIC_DIRECTIVES, TitleSeparationComponent],
  providers: [DomainService]
})
export class DomainPage extends ProductCore implements OnDestroy {
  subscription: any;
  domain: Object;
  serviceName: string;
  loading: boolean = true;
  category = categoryEnum.DOMAIN;

  constructor(private domainService: DomainService, private navParams: NavParams, modalCtrl: ModalController) {
    super(modalCtrl);
    this.serviceName = navParams.get('serviceName');

    this.subscription = this.domainService.getAll(this.serviceName)
      .subscribe((domain) => {
        this.domain = domain;
        this.loading = false;
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
