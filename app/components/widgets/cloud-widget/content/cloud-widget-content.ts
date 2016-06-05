import {Component, Input, EventEmitter, Output, OnChanges, OnInit, SimpleChange} from 'angular2/core';
import {IONIC_DIRECTIVES, Modal, NavController, Alert} from 'ionic-angular';
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
  @Output() collapsedChange: EventEmitter<any> = new EventEmitter();

  cloud: any = {};
  loading: boolean;
  viewMode: string = 'general';
  tasksLoaded: boolean = false;
  emptyTasks: boolean;
  error: any;
  ips: Array<any> = [];

  constructor(private cloudWidgetService: CloudWidgetService, private widgetsService: WidgetsService,
    private nav: NavController, private toastService: ToastService) {

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
        this.cloud = Object.assign(resp[0], resp[1], resp[2], resp[3]);;
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
    let profileModal = Modal.create(NetworkStateModal, { category: '18', categoryName: 'Cloud' });
    this.nav.present(profileModal);
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
            this.nav.present(this.toastService.success('Redémarrage en cours...'));
            this.getInfos();
          },
          (err) => this.nav.present(this.toastService.success(`Une erreur est survenue (${JSON.stringify(err)})`))
        );
    };

    let handlerHard = () => {
      this.cloudWidgetService.rebootInstance(this.serviceName, id, 'soft')
        .then(
          () => {
            this.nav.present(this.toastService.success('Redémarrage en cours...'));
            this.getInfos();
          },
          (err) => this.nav.present(this.toastService.success(`Une erreur est survenue (${JSON.stringify(err)})`))
        );
    };

    let rebootAlert = Alert.create({
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

    this.nav.present(rebootAlert);
  }

  createSnapshot(id: string): void {
    let handler = (data) => {
      this.cloudWidgetService.createSnapshot(this.serviceName, id, data.snapshotName)
        .then(
          () => {
            this.nav.present(this.toastService.success('Snapshot en cours de création...'));
            this.getInfos();
          },
          (err) => this.nav.present(this.toastService.success(`Une erreur est survenue (${JSON.stringify(err)})`))
        );
    };

    let deleteAlert = Alert.create({
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


    this.nav.present(deleteAlert);
  }

  deleteSnapshot(id: string): void {
    let handler = () => {
      this.cloudWidgetService.deleteSnapshot(this.serviceName, id)
        .then(
          () => {
            this.nav.present(this.toastService.success('Suppression effectuée avec succès'));
            this.getInfos();
          },
          (err) => this.nav.present(this.toastService.success(`Une erreur est survenue (${JSON.stringify(err)})`))
        );
    };

    let deleteAlert = Alert.create({
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


    this.nav.present(deleteAlert);
  }
}
