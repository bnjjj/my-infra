import {Page, NavParams} from 'ionic-angular';
import {ToastService} from '../../services/toast/toast.service';
import {AnalyticsService} from '../../services/analytics/analytics.service';
import {MessagesService} from './messages.service';

@Page({
  templateUrl: 'build/pages/messages/messages.html',
  providers: [MessagesService]
})
export class MessagesPage {
  loading: boolean = true;
  error: any;
  messages: Array<any> = [];
  response: string = "";
  ticket: any;
  constructor(private messagesService: MessagesService, private params: NavParams, private toast: ToastService, private analytics: AnalyticsService) {
    this.ticket = this.params.get('ticket');
    this.getMessages();
    this.analytics.trackView('Messages');
  }

  getMessages(): void {
    this.loading = true;
    this.messagesService.getMessages(this.ticket.ticketId)
      .then(messages => {
        this.messages = messages;
        this.loading = false;
      }, err => {
        this.error = err;
        this.toast.error('Erreur de chargement: ' + (err.message ? err.message : err));
        this.loading = false;
      });
  }

  reply(): void {
    this.analytics.trackEvent('Messages', 'Reply', 'Launch', 'Tempting to reply for a ticket');
    this.messagesService[this.ticket.state !== 'closed' ? 'reply' : 'reopen'](this.ticket.ticketId, this.response)
      .then(() => {
        this.getMessages();
        this.response = "";
        this.analytics.trackEvent('Messages', 'Reply', 'Success', 'Replying is a success');
      })
      .catch(err => {
        this.error = err.message ? err.message : err;
        this.toast.error('Une erreur est survenue lors de l\'envoi de votre message: ' + this.error);
        this.loading = false;
        this.analytics.trackEvent('Messages', 'Reply', 'Error', this.error);
      });
  }
}
