import {Page} from 'ionic-angular';
import {LoginPage} from '../login/login';
import {DashboardPage} from '../dashboard/dashboard';
import {SupportPage} from '../support/support';
import {AccountPage} from '../account/account';

@Page({
  templateUrl: 'build/pages/tabs/tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  facturationTab: any = LoginPage;
  dashboardTab: any = DashboardPage;
  compteTab: any = AccountPage;
  supportTab: any = SupportPage;
}
