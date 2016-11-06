import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
import { MeService } from '../../services/me/me.service';
import { AnalyticsService } from '../../services/analytics/analytics.service';
import { ToastService } from '../../services/toast/toast.service';

@Component({
  templateUrl: 'build/modals/sla/sla.html',
  providers: [],
  directives: []
})
export class SlaModal {
  ids: Array<string> = [];
  slas: any = [];
  loading: boolean = true;
  error: any;

  constructor(private navParams: NavParams, private viewCtrl: ViewController, public analytics: AnalyticsService,
     public meService: MeService, public toast: ToastService) {
    this.ids = this.navParams.get('ids');
    this.getSlas();
    this.analytics.trackView('sla');
  }

  getSlas() {
    this.loading = true;

    this.meService.getSlasDetails(this.ids)
      .finally(() => this.loading = false)
      .subscribe((slas) => {
        console.log(slas);
        this.slas = slas;
        this.loading = false;
      });
  }

  close(): void {
    this.viewCtrl.dismiss({});
  }

  apply(id: number): void {
    this.meService.applySla(id)
      .subscribe(
        () => {
          this.toast.success('Votre compensation SLA a bien été appliquée').present();
          this.slas = this.slas.filter((sla) => sla.id !== id);
        },
        (err) => this.toast.error(`Une erreur est survenue : ${JSON.parse(err._body).message}`).present()
      );
  }

  doRefresh(refresher): void {
    this.getSlas();
    setTimeout(() => {
      refresher.complete();
    }, 300);
  }
}
