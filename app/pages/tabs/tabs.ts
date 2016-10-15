import {Component} from '@angular/core';
import {DashboardPage} from '../dashboard/dashboard';
import {SupportPage} from '../support/support';
import {AccountPage} from '../account/account';
import {ProductListPage} from '../products/product-list/product-list';

@Component({
  templateUrl: 'build/pages/tabs/tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Components
  // should be each tab's root Component
  dashboardTab: any = DashboardPage;
  productListTab: any = ProductListPage;
  accountTab: any = AccountPage;
  supportTab: any = SupportPage;
}
