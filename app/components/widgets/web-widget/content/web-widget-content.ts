import {Component, Input, EventEmitter, Output, OnChanges, OnInit, SimpleChange, ViewChild} from '@angular/core';
import {IONIC_DIRECTIVES, ModalController, Nav} from 'ionic-angular';
import {WebWidgetService} from '../web-widget.service';
import {WidgetsService} from '../../widgets.service';
import {ToastService} from '../../../../services/toast/toast.service';
import {TaskDetailsWebComponent} from '../task-details/task-details';
import {WidgetHeaderComponent} from '../../../widget-header/widget-header';
import {categoryEnum} from '../../../../config/constants';

@Component({
  selector: 'web-widget-content',
  templateUrl: 'build/components/widgets/web-widget/content/web-widget-content.html',
  directives: [IONIC_DIRECTIVES, TaskDetailsWebComponent, WidgetHeaderComponent],
  providers: [WebWidgetService, WidgetsService]
})
export class WebWidgetContentComponent implements OnChanges, OnInit {
  @Input() serviceName: string;
  @Input() showWorks: boolean = false;
  @Input() reload: boolean;
  @Input() collapsed: boolean;
  @Output() collapsedChange: EventEmitter<any> = new EventEmitter();
  @ViewChild(Nav) nav: Nav;

  server: any = {};
  loading: boolean;
  viewMode: string = 'general';
  tasksLoaded: boolean = false;
  emptyTasks: boolean;
  error: any;
  tasks: Array<any> = [];
  sslPendingStatus: Array<string> = ['deleting', 'creating', 'regenerating'];
  constants = categoryEnum.WEB;

  constructor(private webWidgetService: WebWidgetService, private widgetsService: WidgetsService,
    private toast: ToastService, private modalCtrl: ModalController) {

  }

  ngOnInit(): void {
    this.getInfos();
  }

  getInfos(): void {
    this.loading = true;
    Promise.all([this.webWidgetService.getInfos(this.serviceName),
        this.webWidgetService.getServiceInfos(this.serviceName),
        this.webWidgetService.getSsl(this.serviceName)
      ])
      .then(resp => {
        this.server = Object.assign(resp[0], resp[1], { ssl: resp[2] });
        this.loading = false;
      })
      .catch(err => {
        this.error = err;
        this.loading = false;
      });
  }

  changeSslStatus(): void {
    if (this.server.ssl && this.server.ssl.status === 'none') {
      this.server.ssl = {status: 'creating'};
      this.webWidgetService.createSsl(this.serviceName)
        .then(
          () => this.toast.success('La création de votre certificat SSL est en cours...').present(),
          (err) => {
            this.server.ssl = {status: 'none'};
            this.toast.error('Une erreur est survenue lors de la création de votre certificat SSL : ' + JSON.parse(err._body).message).present();
          }
        );
    } else {
      this.server.ssl = Object.assign({}, this.server.ssl, {status: 'deleting'});
      this.webWidgetService.deleteSsl(this.serviceName)
        .then(
          () => this.toast.success('La suppression de votre certificat SSL est en cours...').present(),
          (err) => {
            this.server.ssl = Object.assign({}, this.server.ssl, {status: 'created'});
            this.toast.error('Une erreur est survenue lors de la suppression de votre certificat SSL : ' + JSON.parse(err._body).message).present();
          }
        );
    }
  }

  sslIsPending(status: string): boolean {
    return this.sslPendingStatus.indexOf(status) !== -1;
  }


  getTasks(): void {
    if (!this.tasksLoaded) {
      this.loading = true;
      this.webWidgetService.getTasks(this.serviceName)
        .then(tasks => {
          this.emptyTasks = !tasks.length;
          this.tasks = tasks;
          this.loading = false;
          this.tasksLoaded = true;
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

  updateCollapse(): void {
    this.collapsed = !this.collapsed;
    this.collapsedChange.emit(this.collapsed);
  }
}
