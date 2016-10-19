import {Component, Input, Output, EventEmitter} from '@angular/core';
import {IONIC_DIRECTIVES, AlertController} from 'ionic-angular';
import {alertConfiguration} from '../../config/constants';
import {AlertsService} from '../../services/alerts/alerts.service';
import {AnalyticsService} from '../../services/analytics/analytics.service';

@Component({
  selector: 'ovh-alert',
  templateUrl: 'build/components/ovh-alert/ovh-alert.html',
  directives: [IONIC_DIRECTIVES],
  providers: []
})
export class OvhAlertComponent {
  @Input() alertName: string;
  @Input() alertType: string;
  @Input() link: string;
  @Output() deleted: EventEmitter<any> = new EventEmitter();

  constructor(public alertCtrl: AlertController, public alertsService: AlertsService, public analytics: AnalyticsService) {
    this.analytics.trackView('Ovh-alert');
    this.analytics.trackView(`Ovh-alert:${this.alertType}`);
  }

  openLink() {
    window.open(this.link, '_system', 'location=yes');
  }

  close(event) {
    event.stopPropagation();
    let alert = this.alertCtrl.create();
    alert.setTitle('Ne plus afficher ce type de notification pendant : ');

    alertConfiguration.durations.forEach(({ label, value }, key) => {
      alert.addInput({
        type: 'radio',
        label,
        value,
        checked: key === 0
      });
    });

    alert.addButton('Annuler');
    alert.addButton({
      text: 'Confirmer',
      handler: (duration) => {
        this.alertsService.remove(this.alertType, duration);
        this.deleted.emit(this.alertType);
      }
    });

    alert.present();
  }
}
