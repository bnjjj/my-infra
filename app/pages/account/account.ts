declare var require;
import {Page, Keyboard, NavController, Alert, Modal} from 'ionic-angular';
import {OnInit} from 'angular2/core';
import {AccountService} from './account.service';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/finally';
import {AnalyticsService} from '../../services/analytics/analytics.service';
import {AboutModal} from '../../modals/about/about';
import {ToastService} from '../../services/toast/toast.service';
import {LoginService} from '../login/login.service';
let _ = require('lazy.js');

@Page({
  templateUrl: 'build/pages/account/account.html',
  providers: [AccountService, LoginService]
})
export class AccountPage implements OnInit{
  loading: boolean;
  error: any;
  accountInfos: any;
  previousInfos: any;
  newAccountModel: any;
  meModel: any;
  keys: Array<string>;

  constructor(private accountService: AccountService, private keyboard: Keyboard,
    private analytics: AnalyticsService, private nav: NavController, private login: LoginService, private toast: ToastService) {
    this.init();
    this.analytics.trackView('Account');
  }

  init(): void {
    this.loading = true;
    this.accountService.getInfos();
    this.accountService.getMeModel();
    this.accountService.getNewAccountModel()
  }

  ngOnInit(): void {
    this.accountService.accountInfosObservable
      .subscribe(dataStore => {
        this.accountInfos = dataStore.accountInfos;
        this.previousInfos = dataStore.accountInfos;
        this.meModel = dataStore.meModel;
        this.newAccountModel = dataStore.newAccountModel;
        this.loading = !['accountInfos', 'previousInfos', 'meModel', 'newAccountModel'].reduce((prev, curr) => prev && Object.keys(this[curr]).length > 0, true);
      }, err => {
        this.error = err;
        this.nav.present(this.toast.error('Une erreur est survenue : ' + err.message));
        this.loading = false;
      });
  }

  getInfos(): void {
    this.loading = true;
    this.accountService.getInfos();
  }

  doRefresh(refresher): void {
    this.accountService.getInfos();
    this.accountService.accountInfosObservable
      .subscribe(
        () => refresher.complete(),
        () => refresher.complete()
      );
  }

  save() {
    let args = ['firstname',
      'birthDay',
      'nationalIdentificationNumber',
      'spareEmail',
      'city',
      'fax',
      'address',
      'companyNationalIdentificationNumber',
      'birthCity',
      'language',
      'name',
      'phone',
      'sex',
      'zip',
      'corporationType',
      'legalform'
    ];

    this.analytics.trackEvent('Account', 'save', 'Launch', 'Action is launched');
    this.loading = true;
    console.log(_(this.accountInfos).pick(args).value());
    this.accountService.save(_(this.accountInfos).pick(args).value());
  }

  cancel(): void {
    this.accountInfos = Object.assign({}, this.previousInfos);
  }

  closeKeyboard(): void {
    this.keyboard.close();
  }

  logout(): void {
    let handler = () => {
      return this.login.logout();
    };

    let alert = Alert.create({
      title: 'Déconnection',
      message: 'Voulez-vous vraiment vous déconnecter ?',
      buttons: [
        {
          text: 'Non'
        },
        {
          text: 'Oui',
          handler: handler
        }
      ]
    });

    this.nav.present(alert);
  }

  about() {
    let addModal = Modal.create(AboutModal);
    this.nav.present(addModal);
  }
}
