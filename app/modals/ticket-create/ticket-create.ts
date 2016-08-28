import {Component, ViewChild} from '@angular/core';
import {ViewController, NavParams, Nav} from 'ionic-angular';
import {AnalyticsService} from '../../services/analytics/analytics.service';
import {ProductsService} from '../../services/products/common.service';
import {SupportService} from '../../pages/support/support.service';
import {ToastService} from '../../services/toast/toast.service';
import {categoryEnum, ticketCategoryEnum} from '../../config/constants';

@Component({
  templateUrl: 'build/modals/ticket-create/ticket-create.html',
  providers: [SupportService]
})
export class TicketCreateModal {
  @ViewChild(Nav) nav: Nav;
  categoryKeys: Array<string> = Object.keys(categoryEnum).filter((cat) => cat !== 'PROJECT');
  CategoryEnum: any = categoryEnum;
  TicketCategoryEnum: any = ticketCategoryEnum;
  ticket: any = {
    category: null,
    product: this.CategoryEnum.DOMAIN,
    type: 'genericRequest',
    serviceName: null,
    subject: null,
    body: null
  };
  products: Array<string> = [];
  loading: boolean = true;
  errors: any;

  constructor(private viewCtrl: ViewController, private productService: ProductsService,
    private params: NavParams, private analytics: AnalyticsService, private supportService: SupportService,
      private toast: ToastService) {
    this.fetchProducts(this.ticket.product.url);
    this.analytics.trackView('Ticket-create');
  }

  close(): void {
    this.viewCtrl.dismiss({});
  }

  addProduct(product: string): void {
    this.ticket.serviceName = product;
  }

  createTicket(): void {
    this.ticket.product = this.ticket.product.supportRef;
    this.loading = true;
    this.supportService.createTicket(this.ticket)
      .then(() => {
        this.viewCtrl.dismiss();
        this.loading = false;
      })
      .catch(() => {
        this.toast.error('La création du ticket a échouée').present();
        this.viewCtrl.dismiss();
        this.loading = false;
      });
  }

  fetchProducts(category: string): void {
    this.loading = true;
    this.productService.getAll(category)
      .then(products => {
        this.products = products;
        this.loading = false;
      })
      .catch(err => {
        this.errors = err;
        this.loading = false;
        this.analytics.trackEvent('Ticket-create', 'fetchProducts', 'Error', JSON.stringify(err));
      });
  }
}
