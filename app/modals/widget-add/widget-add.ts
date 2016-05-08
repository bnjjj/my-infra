import {Page, ViewController, NavParams} from 'ionic-angular';
import {AnalyticsService} from '../../services/analytics/analytics.service';
import {ProductsService} from '../../services/products/common.service';
import {categoryEnum} from '../../config/constants';

@Page({
  templateUrl: 'build/modals/widget-add/widget-add.html'
})
export class WidgetAddModal {
  categoryKeys: Array<string> = Object.keys(categoryEnum);
  subCategoryKeys: Array<string> = Object.keys(categoryEnum).filter((cat) => cat !== 'PROJECT');
  CategoryEnum: any = categoryEnum;
  category: any = this.CategoryEnum.DOMAIN;
  subCategory: any = this.CategoryEnum.DOMAIN;
  loading: boolean = true;
  projectName: string;
  errors: any;
  products: Array<any> = [];
  project: Array<any> = [];

  constructor(private viewCtrl: ViewController, private productService: ProductsService, private params: NavParams, private analytics: AnalyticsService) {
    this.fetchProducts(this.category.url);
    this.analytics.trackView('Widget-add');
  }

  close(): void {
    this.viewCtrl.dismiss({});
  }

  addWidget(serviceName: string): void {
    this.viewCtrl.dismiss({category: this.category, serviceName});
  }


  addSubProduct(serviceName: string, category: any): void {
    this.filterCategories(category);
    this.fetchProducts(this.subCategory.url);
    this.project = this.project.concat([{ serviceName, category }]);
  }

  addProject(serviceName: string): void {
    if (this.project.length === 2) {
      this.viewCtrl.dismiss({ category: this.category, project: this.project, serviceName });
    }
  }

  filterCategories(category: any): void{
    if (!category.hardware) {
      this.subCategoryKeys = this.subCategoryKeys.filter((cat) => this.CategoryEnum[cat].hardware);
      this.subCategory = this.CategoryEnum.WEB;
    } else {
      this.subCategoryKeys = this.subCategoryKeys.filter((cat) => !this.CategoryEnum[cat].hardware);
      this.subCategory = this.CategoryEnum.DOMAIN;
    }
  }

  selectCategory(category: any): void {
    this.analytics.trackEvent('Widget-add', 'addWidgetCategory', 'Add', category);
    if (category !== this.CategoryEnum.PROJECT) {
      this.project = [];
      this.projectName = null;
      this.fetchProducts(category.url);
      this.subCategoryKeys = Object.keys(categoryEnum).filter((cat) => cat !== 'PROJECT');
    }
  }

  selectProduct(category: any): void {
    this.analytics.trackEvent('Widget-add', 'addWidgetProduct', 'Add', category);
    this.fetchProducts(category.url);
  }

  fetchProducts(category: string): void {
    this.loading = true;
    this.productService.getAll(category)
      .then(products => {
        if (this.category !== this.CategoryEnum.PROJECT) {
          this.products = products.filter(product => {
            return !(this.params.get('widgets').find(widget => widget.serviceName === product && this.category === widget.category));
          });
        } else {
          this.products = products;
        }

        this.loading = false;
      })
      .catch(err => {
        this.errors = err;
        this.loading = false;
        this.analytics.trackEvent('Widget-add', 'fetchProducts', 'Error', JSON.stringify(err));
      });
  }
}
