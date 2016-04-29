declare var require;
import {Injectable} from 'angular2/core';
import {OvhRequestService} from '../../services/ovh-request/ovh-request.service';
import 'rxjs/add/operator/toPromise';

let moment = require('moment');

@Injectable()
export class TicketService {
  constructor(private ovhRequest: OvhRequestService) {

  }

  getDetail(id: number) {
    return this.ovhRequest.get(['/support/tickets', id].join('/')).toPromise()
      .then(resp => {
        resp.updateDateText = moment(new Date(resp.updateDate)).add(1, 'hour').format('DD/MM/YYYY à HH:mm');


        return resp;
      });
  }
}
