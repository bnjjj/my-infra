declare var require;
import {Injectable} from 'angular2/core';
import {OvhRequestService} from '../../services/ovh-request/ovh-request.service';
import 'rxjs/add/operator/toPromise';
let moment = require('moment');

@Injectable()
export class MessagesService {
  constructor(private ovhRequest: OvhRequestService) {

  }

  getMessages(ticketId: number) {
    return this.ovhRequest.get(['/support/tickets', ticketId, 'messages'].join('/')).toPromise()
      .then(messages => {
        return messages.map(message => {
          message.creationDateText = moment(new Date(message.creationDate)).format('DD/MM/YYYY à HH:mm');
          message.updateDateText = moment(new Date(message.updateDate)).format('DD/MM/YYYY à HH:mm');

          return message;
        });
      });
  }

  reply(id: number, body: string) {
    return this.ovhRequest.post(['/support/tickets', id,'reply'].join('/'), JSON.stringify({body})).toPromise();
  }

  reopen(id: number, body: string) {
    return this.ovhRequest.post(['/support/tickets', id, 'reopen'].join('/'), JSON.stringify({ body })).toPromise();
  }
}
