import {Injectable} from 'angular2/core';
import {OvhRequestService} from '../../services/ovh-request/ovh-request.service';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class SupportService {
  constructor(private ovhRequest: OvhRequestService) {

  }

  getTickets() {
    return this.ovhRequest.get('/support/tickets').toPromise();
  }

  getNextIds(ids: Array<number>, pageNumber: number, itemsPerPage: number) {
    let beginId = pageNumber * itemsPerPage;

    return ids.slice(beginId, beginId + itemsPerPage);
  }

  createTicket(data: any) {
    return this.ovhRequest.post('/support/tickets/create', JSON.stringify(data)).toPromise();
  }
}
