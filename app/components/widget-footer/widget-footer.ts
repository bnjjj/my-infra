import {Component, EventEmitter, Output} from '@angular/core';
import {IONIC_DIRECTIVES} from 'ionic-angular';

@Component({
  selector: 'widget-footer',
  template: `
    <ion-row no-padding class="widget-content">
      <ion-col text-center width-33>
        <button full class="button-ovh" (click)="openTasks.emit()">
          Tâches
        </button>
      </ion-col>
      <ion-col text-center width-33>
        <button full class="button-ovh" (click)="openInfos.emit()">
          Plus d'infos
        </button>
      </ion-col>
      <ion-col text-center width-33>
        <button class="button-ovh danger-color" full (click)="remove.emit()">
          Supprimer
        </button>
      </ion-col>
    </ion-row>
  `,
  directives: [IONIC_DIRECTIVES]
})
export class WidgetFooterComponent {
  @Output() openTasks: EventEmitter<any> = new EventEmitter();
  @Output() remove: EventEmitter<any> = new EventEmitter();
  @Output() openInfos: EventEmitter<any> = new EventEmitter();

  constructor() {

  }
}
