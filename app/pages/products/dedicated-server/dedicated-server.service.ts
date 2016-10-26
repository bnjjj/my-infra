declare var require;
import { OvhRequestService } from '../../../services/ovh-request/ovh-request.service';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import {Observable} from 'rxjs/Observable';
let moment = require('moment');

@Injectable()
export class DedicatedServerService {
  constructor(private ovhRequest: OvhRequestService) {

  }

  get() {
    return this.ovhRequest.get('/dedicated/server');
  }

  getInfos(serviceName: string) {
    return this.ovhRequest.get(['/dedicated/server', serviceName].join('/'));
  }

  getHardware(serviceName: string) {
    return this.ovhRequest.get(`/dedicated/server/${serviceName}/specifications/hardware`);
  }

  getServiceInfos(serviceName: string) {
    return this.ovhRequest.get(['/dedicated/server', serviceName, 'serviceInfos'].join('/'))
      .map((resp) => {
        resp.expirationText = moment(new Date(resp.expiration)).format('DD/MM/YYYY');
        resp.warning = !moment(new Date()).add(7, 'days').isBefore(new Date(resp.expiration));

        return resp;
      });
  }

  getChart(serviceName: string, type: string, period: string) {
    return this.ovhRequest.get(`/dedicated/server/${serviceName}/statistics/chart`, {
      search: {
        type,
        period
      }
    }).map((stats) => {
      let series = stats.values.map((point) => ([point.timestamp * 1000, point.value]));
      return {
        chart: {
          type: 'line',
          backgroundColor: 'transparent',
          marginLeft: 42,
          marginTop: 20,
          spacingLeft: 0,
          height: 250
        },
        title: {
          text: null
        },
        legend: {
          enabled: false
        },
        plotOptions: {
          series: {
            enableMouseTracking: false
          }
        },
        xAxis: {
          type: 'datetime'
        },
        yAxis: {
          title: {
            text: stats.unit
          },
          max: stats.unit === '%' ? 100 : null,
          min: stats.unit === '%' ? 0 : null,
          labels: {
            format: `{value}${stats.unit}`
          }
        },
        series: [{
          data: series,
          connectNulls: true
        }]
      };
    });
  }

  getTasks(serviceName: string) {
    return this.ovhRequest.get(['/dedicated/server', serviceName, 'task'].join('/'));
  }

  getTask(serviceName: string, id: number) {
    return this.ovhRequest.get(['/dedicated/server', serviceName, 'task', id].join('/'));
  }

  reboot(serviceName: string) {
    return this.ovhRequest.post(['/dedicated/server', serviceName, 'reboot'].join('/'), JSON.stringify({}));
  }

  getAll(serviceName: string) {
    return Observable.forkJoin(this.getInfos(serviceName),
      this.getServiceInfos(serviceName),
      this.getHardware(serviceName)
    ).map((resp) => Object.assign({}, resp[0], resp[1], {hardware: resp[2]}));
  }
}
