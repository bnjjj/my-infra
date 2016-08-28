import {Injectable} from '@angular/core';
import {OvhRequestService} from '../ovh-request/ovh-request.service';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class ProductsService {
  constructor(private ovhRequest: OvhRequestService) {

  }

  getAll(univers) {
    return this.ovhRequest.get(univers).toPromise();
  }
}
