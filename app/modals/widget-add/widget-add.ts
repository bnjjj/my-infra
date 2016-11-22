declare var require;
import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';
import { AnalyticsService } from '../../services/analytics/analytics.service';
import { ProductsService } from '../../services/products/common.service';
import { categoryEnum } from '../../config/constants';
const _ = require('lazy.js');

@Component({
  templateUrl: 'build/modals/widget-add/widget-add.html'
})
export class WidgetAddModal {
  categoryKeys: Array<string> = Object.keys(categoryEnum);
  subCategoryKeys: Array<string> = Object.keys(categoryEnum).filter((cat) => cat !== 'PROJECT');
  CategoryEnum: any = categoryEnum;
  category: any = this.CategoryEnum.DOMAIN;
  subCategory: any = this.CategoryEnum.DOMAIN;
  loading: boolean = true;
  terminate: boolean = false;
  projectName: string;
  errors: any;
  products: Array<any> = [];
  project: Array<any> = [];
  projectByCategories: any = {};
  categories: Array<string> = Object.keys(categoryEnum).filter((cat) => cat !== 'PROJECT');

  constructor(
    private viewCtrl: ViewController,
    private productService: ProductsService,
    private params: NavParams,
    private analytics: AnalyticsService
  ) {
    this.fetchProducts(this.category.url);
    this.category = this.CategoryEnum[this.params.get('type') ? this.params.get('type') : 'DOMAIN'];
    this.analytics.trackView('Widget-add');
    this.projectByCategories = Object.keys(categoryEnum)
      .reduce((globalObj, key) => Object.assign({}, globalObj, { [key]: [] }), {});
  }

  close(): void {
    this.viewCtrl.dismiss({});
  }

  addWidget(serviceName: string): void {
    this.viewCtrl.dismiss({
      category: this.category,
      serviceName
    });
  }

  addSubProduct(serviceName: string, category: any): void {
    this.fetchProducts(this.subCategory.url);
    this.project = this.project.concat([{ serviceName, category }]);
    this.projectByCategories[category.name].push({ serviceName, category });
  }

  addProject(serviceName: string): void {
    this.viewCtrl.dismiss({
      category: this.category,
      project: this.project, serviceName
    });
  }

  selectCategory(category: any): void {
    this.analytics.trackEvent('Widget-add', 'addWidgetCategory', 'Add', category);
    if (category !== this.CategoryEnum.PROJECT) {
      this.project = [];
      this.projectName = null;
      this.fetchProducts(category.url);
      this.subCategoryKeys = this.categories;
    }
  }

  selectProduct(category: any): void {
    this.analytics.trackEvent('Widget-add', 'addWidgetProduct', 'Add', category);
    this.fetchProducts(category.url);
  }

  fetchProducts(category: string): void {
    this.loading = true;
    this.productService.getAll(category)
      .then((products) => {
        if (this.category !== this.CategoryEnum.PROJECT) {
          this.products = products.filter((product) => {
            return !(this.params.get('widgets').find(
              (widget) => widget.serviceName === product && this.category.name === widget.category.name)
            );
          });
        } else {
          this.products = products.filter((product) => {
            let productFound = _(this.project).findWhere({ serviceName: product });

            return !this.project.length || !(productFound && this.category !== productFound.category.name);
          });
        }

        this.loading = false;
      })
      .catch((err) => {
        this.errors = err;
        this.loading = false;
        this.analytics.trackEvent('Widget-add', 'fetchProducts', 'Error', JSON.stringify(err));
      });
  }
}
