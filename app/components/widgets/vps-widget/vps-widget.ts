import {Component, Input, EventEmitter, Output, OnChanges, OnInit, SimpleChange} from 'angular2/core';
import {IONIC_DIRECTIVES, Modal, NavController, Alert} from 'ionic-angular';
import {NetworkStateModal} from '../../../modals/network-state/network-state';
import {VpsWidgetService} from './vps-widget.service';
import {WidgetsService} from '../widgets.service';
import {VpsWidgetContentComponent} from './content/vps-widget-content';
import {AnalyticsService} from '../../../services/analytics/analytics.service';
import {ToastService} from '../../../services/toast/toast.service';

@Component({
  selector: 'vps-widget',
  templateUrl: 'build/components/widgets/vps-widget/vps-widget.html',
  directives: [IONIC_DIRECTIVES, VpsWidgetContentComponent],
  providers: [VpsWidgetService, WidgetsService]
})
export class VpsWidgetComponent implements OnChanges, OnInit {
  @Input() serviceName: string;
  @Input() reload: boolean;
  @Output() remove: EventEmitter<string> = new EventEmitter();
  viewMode: string = 'general';
  loading: boolean;
  collapsed: boolean = false;
  tasksLoaded: boolean = false;
  emptyTasks: boolean;
  server: any;
  error: any;
  tasks: Array<any> = [];
  constructor(private vpsWidgetService: VpsWidgetService, private widgetsService: WidgetsService,
      private nav: NavController, private analytics: AnalyticsService, private toast: ToastService) {
    this.analytics.trackView('Vps-widget');
  }

  ngOnInit(): void {
    this.getInfos();
  }

  getInfos(): void {
    this.loading = true;
    this.vpsWidgetService.getInfos(this.serviceName)
      .then(resp => {
        this.server = resp;
        this.loading = false;
      })
      .catch(err => {
        this.error = err;
        this.loading = false;
      });
  }

  getTasks(): void {
    if (!this.tasksLoaded) {
      this.loading = true;
      this.vpsWidgetService.getTasks(this.serviceName)
        .then(tasks => {
          this.emptyTasks = tasks.length === 0;
          this.tasks = tasks;
        })
        .then(() => {
          this.tasksLoaded = true;
          this.loading = false;
        }, err => {
          this.error = err;
          this.loading = false;
        });
    }
  }

  ngOnChanges(changes: { [propName: string]: SimpleChange }): void {
    if (changes['reload'] && changes['reload'].currentValue !== changes['reload'].previousValue) {
      this.getInfos();
      this.tasksLoaded = false;
      if (this.viewMode === 'tasks') {
        this.getTasks();
      }
    }
  }

  openNetworkStateModal() {
    let profileModal = Modal.create(NetworkStateModal, { category: '22', categoryName: 'VPS' });
    this.nav.present(profileModal);
  }

  removeMe(): void {
    let handler = () => this.remove.emit(this.serviceName);
    let alert = this.widgetsService.getDeleteAlert(this.serviceName, handler);

    this.nav.present(alert);
  }

  reboot(): void {
    let alert = Alert.create({
      title: 'Redémarrage',
      message: 'Voulez-vous redémarrer le vps ' + this.serviceName,
      buttons: [
        {
          text: 'Non'
        },
        {
          text: 'Oui',
          handler: () => {
            this.vpsWidgetService.reboot(this.serviceName)
              .then(
                () => this.nav.present(this.toast.success('Redémarrage en cours ...')),
                (err) => this.nav.present(this.toast.error('Une erreur est survenue : ' + err.message))
              );
          }
        }
      ]
    });

    this.nav.present(alert);
  }
}
