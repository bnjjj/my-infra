import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { OvhRequestService } from '../../../services/ovh-request/ovh-request.service';
import { categoryEnum } from '../../../config/constants';
import { Subscription } from 'rxjs/Subscription';

@Component({
  templateUrl: 'build/pages/products/product-list/product-list.html',
  providers: []
})
export class ProductListPage {
  loading: boolean = true;
  search: string;
  products: Array<string> = [];
  productsFiltered: Array<string> = [];
  category: any = categoryEnum.DOMAIN;
  categoryKeys: Array<string> = Object.keys(categoryEnum).filter((category) => category !== 'PROJECT');
  categoryEnum: any = categoryEnum;
  subscribtion: Subscription;

  constructor(public ovhRequest: OvhRequestService, public navController: NavController) {
    this.getProducts(this.category);
  }

  getProducts(category: any) {
    if (this.subscribtion != null) {
      this.subscribtion.unsubscribe();
    }
    this.loading = true;
    this.search = '';
    this.subscribtion = this.ovhRequest.get(category.url)
      .subscribe(
        (products) => {
          this.products = products;
          this.sortProducts();
        },
        null,
        () => this.loading = false
      );
  }

  sortProducts() {
    if (!this.search) {
      this.productsFiltered = this.products;
    } else {
      this.productsFiltered = this.products.filter((product) => product.indexOf(this.search) !== -1);
    }
  }

  moreInfos(serviceName: string) {
    this.navController.push(this.category.page, { serviceName });
  }
}
