import {Page, Modal, NavController} from 'ionic-angular';
import {SupportService} from './support.service';
import {TicketComponent} from '../../components/ticket/ticket';
import {AnalyticsService} from '../../services/analytics/analytics.service';
import {ToastService} from '../../services/toast/toast.service';
import {TicketCreateModal} from '../../modals/ticket-create/ticket-create';

@Page({
  templateUrl: 'build/pages/support/support.html',
  providers: [SupportService],
  directives: [TicketComponent]
})
export class SupportPage {
  infos: any;
  error: any;
  loading: boolean = false;
  reload: boolean = false;
  pageNumber: number = 0;
  ticketIds: Array<number> = [];
  ticketIdsFiltered: Array<number> = [];
  ticketsLoaded: number = 0;
  constructor(private supportService: SupportService, private toast: ToastService, private analytics: AnalyticsService, private nav: NavController) {
    this.getTickets();
    this.analytics.trackView('Support');
  }

  getTickets() {
    this.loading = true;
    return this.supportService.getTickets()
      .then(ticketsId => {
        this.ticketIds = ticketsId;
        this.refreshTicketsList();
        this.loading = false;
      }, err => {
        this.error = err;
        this.nav.present(this.toast.error('Erreur de chargement: ' + (err.message ? err.message : err)));
        this.loading = false;
      });
  }

  refreshTicketsList(): void {
    let newTicketIds = this.supportService.getNextIds(this.ticketIds, this.pageNumber, 20);

    this.ticketIdsFiltered = this.ticketIdsFiltered.concat(newTicketIds);
    this.pageNumber++;
  }

  loadMore(infiniteScroll): void {
    setTimeout(() => {
      this.refreshTicketsList();
      infiniteScroll.complete();
      if (this.ticketIdsFiltered.length >= this.ticketIds.length) {
        infiniteScroll.enable(false);//Pour desactiver
      }
    }, 500);
  }

  ticketLoaded(state: boolean): void {
    if (state) {
      this.ticketsLoaded++;
    }

    this.loading = this.ticketsLoaded !== this.ticketIdsFiltered.length;
  }

  doRefresh(refresher): void {
    this.ticketsLoaded = 0;
    this.ticketIds = [];
    this.pageNumber = 0;
    this.ticketIdsFiltered = [];

    this.getTickets();
    setTimeout(() => {
      refresher.complete();
    }, 300);
  }

  createTicket(): void {
    let addModal = Modal.create(TicketCreateModal);
    addModal.onDismiss(() => {
      this.reload = true;
      this.getTickets()
        .then(() => this.reload = false)
        .catch(() => this.reload = false)
    });
    this.nav.present(addModal);
  }

}
