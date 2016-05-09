import {Injectable} from 'angular2/core';
import {OvhRequestService} from '../ovh-request/ovh-request.service';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class IpService {
  constructor(private ovhRequest: OvhRequestService) {

  }

  getAll(description: string, ip: string, routedTo: string, type: string) {
    return this.ovhRequest.get('/ip', { search: { description, ip, type, 'routedTo.serviceName': routedTo } }).toPromise();
  }
}
