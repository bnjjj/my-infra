import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {IONIC_DIRECTIVES} from 'ionic-angular';
import {TicketService} from './ticket.service';
import {MessagesPage} from '../../pages/messages/messages';
import {ticketCategoryEnum} from '../../config/constants';


@Component({
  selector: 'ticket',
  templateUrl: 'build/components/ticket/ticket.html',
  directives: [IONIC_DIRECTIVES],
  providers: [TicketService]
})
export class TicketComponent implements OnInit {
  @Input() ticketId: number;
  @Output() loaded: EventEmitter<any> = new EventEmitter();

  TicketCategoryEnum: any = ticketCategoryEnum;
  loading: boolean = true;
  ticket: Object;
  error: any;
  messagePage = MessagesPage;

  constructor(private ticketService: TicketService) {

  }

  ngOnInit(): void {
    this.getDetail();
  }

  getDetail(): void {
    this.sendLoadedEvent(false);
    this.ticketService.getDetail(this.ticketId)
      .then(ticket => {
        this.ticket = ticket;
        this.sendLoadedEvent(true);
      }, err => {
        this.error = err;
        this.sendLoadedEvent(true);
      });
  }

  sendLoadedEvent(state: boolean): void {
   this.loading = !state;
   this.loaded.emit(state);
  }
}
