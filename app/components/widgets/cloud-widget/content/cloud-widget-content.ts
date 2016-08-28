import {Component, Input, EventEmitter, Output, OnChanges, OnInit, SimpleChange, ViewChild} from '@angular/core';
import {IONIC_DIRECTIVES, ModalController, Nav, AlertController} from 'ionic-angular';
import {NetworkStateModal} from '../../../../modals/network-state/network-state';
import {CloudWidgetService} from '../cloud-widget.service';
import {WidgetsService} from '../../widgets.service';
import {StatusDetailsComponent} from '../status-details/status-details';
import {ToastService} from '../../../../services/toast/toast.service';

@Component({
  selector: 'cloud-widget-content',
  templateUrl: 'build/components/widgets/cloud-widget/content/cloud-widget-content.html',
  directives: [IONIC_DIRECTIVES, StatusDetailsComponent],
  providers: [CloudWidgetService, WidgetsService]
})
export class CloudWidgetContentComponent implements OnChanges, OnInit {
  @Input() serviceName: string;
  @Input() showWorks: boolean = false;
  @Input() reload: boolean;
  @Input() collapsed: boolean;
  @ViewChild(Nav) nav: Nav;
  @Output() collapsedChange: EventEmitter<any> = new EventEmitter();

  cloud: any = {};
  loading: boolean;
  viewMode: string = 'general';
  tasksLoaded: boolean = false;
  emptyTasks: boolean;
  error: any;
  ips: Array<any> = [];

  constructor(private cloudWidgetService: CloudWidgetService, private widgetsService: WidgetsService,
    private toastService: ToastService, private modalCtrl: ModalController, private alertCtrl: AlertController) {

  }

  ngOnInit(): void {
    this.getInfos();
  }

  getInfos(): void {
    this.loading = true;
    Promise.all([this.cloudWidgetService.getInfos(this.serviceName), this.cloudWidgetService.getServiceInfos(this.serviceName),
        this.cloudWidgetService.getInstances(this.serviceName), this.cloudWidgetService.getSnapshots(this.serviceName)
      ])
      .then(resp => {
        this.cloud = Object.assign(resp[0], resp[1], resp[2], resp[3]);
        this.loading = false;
      })
      .catch(err => {
        this.error = err;
        this.loading = false;
      });
  }

  getIps(): void {
    this.loading = true;
    this.cloudWidgetService.getIps(this.serviceName)
      .then((ips) => {
        this.ips = ips;
        this.loading = false;
      }, (err) => {
        this.error = err;
        this.loading = false;
      });
  }

  ngOnChanges(changes: { [propName: string]: SimpleChange }): void {
    if (changes['reload'] && changes['reload'].currentValue !== changes['reload'].previousValue) {
      this.getInfos();
      this.tasksLoaded = false;
      if (this.viewMode === 'ips') {
        this.getIps();
      }
    }
  }

  openNetworkStateModal(): void {
    let profileModal = this.modalCtrl.create(NetworkStateModal, { category: '18', categoryName: 'Cloud' });
    profileModal.present();
  }

  updateCollapse(): void {
    this.collapsed = !this.collapsed;
    this.collapsedChange.emit(this.collapsed);
  }

  rebootInstance(id: string): void {
    let handlerSoft = () => {
      this.cloudWidgetService.rebootInstance(this.serviceName, id, 'soft')
        .then(
          () => {
            this.toastService.success('Redémarrage en cours...').present();
            this.getInfos();
          },
          (err) => this.toastService.success(`Une erreur est survenue (${JSON.stringify(err)})`).present()
        );
    };

    let handlerHard = () => {
      this.cloudWidgetService.rebootInstance(this.serviceName, id, 'soft')
        .then(
          () => {
            this.toastService.success('Redémarrage en cours...').present();
            this.getInfos();
          },
          (err) => this.toastService.success(`Une erreur est survenue (${JSON.stringify(err)})`).present()
        );
    };

    let rebootAlert = this.alertCtrl.create({
      title: 'Redémarrer votre instance',
      message: 'Quel type de redémarrage souhaitez-vous pour redémarrer votre instance maintenant ?',
      buttons: [
        {
          text: 'Hard',
          handler: handlerHard
        },
        {
          text: 'Soft',
          handler: handlerSoft
        },
        {
          text: 'Annuler'
        }
      ]
    });

    rebootAlert.present();
  }

  createSnapshot(id: string): void {
    let handler = (data) => {
      this.cloudWidgetService.createSnapshot(this.serviceName, id, data.snapshotName)
        .then(
          () => {
            this.toastService.success('Snapshot en cours de création...').present();
            this.getInfos();
          },
          (err) => this.toastService.success(`Une erreur est survenue (${JSON.stringify(err)})`).present()
        );
    };

    let deleteAlert = this.alertCtrl.create({
      title: 'Création snapshot',
      message: 'Voulez-vous créer un snapshot de cet instance ?',
      inputs: [
        {
          name: 'snapshotName',
          placeholder: 'Nom du snapshot'
        }
      ],
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


    deleteAlert.present();
  }

  deleteSnapshot(id: string): void {
    let handler = () => {
      this.cloudWidgetService.deleteSnapshot(this.serviceName, id)
        .then(
          () => {
            this.toastService.success('Suppression effectuée avec succès').present();
            this.getInfos();
          },
          (err) => this.toastService.success(`Une erreur est survenue (${JSON.stringify(err)})`).present()
        );
    };

    let deleteAlert = this.alertCtrl.create({
      title: 'Suppression snapshot',
      message: 'Voulez-vous supprimer ce snapshot ?',
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


    deleteAlert.present();
  }
}
