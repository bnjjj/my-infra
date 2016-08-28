import {Component} from '@angular/core';
import {LoginPage} from '../login/login';
import {DashboardPage} from '../dashboard/dashboard';
import {SupportPage} from '../support/support';
import {AccountPage} from '../account/account';

@Component({
  templateUrl: 'build/pages/tabs/tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Components
  // should be each tab's root Component
  facturationTab: any = LoginPage;
  dashboardTab: any = DashboardPage;
  compteTab: any = AccountPage;
  supportTab: any = SupportPage;
}
