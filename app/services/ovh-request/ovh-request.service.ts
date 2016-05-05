declare var require: any;
import {Injectable, EventEmitter} from 'angular2/core';
import {Http, Headers} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';
let CryptoJs = require('../../../node_modules/crypto-js/crypto-js');
let timestampValidity = 10000;

@Injectable()
export class OvhRequestService {
  config: any;
  timestampServer: number;
  timestampLocal: number;
  timestampLag: number;
  timeRequestSended: boolean = false;
  timeObservable: Observable<any>;

  constructor(private http: Http) {
    this.config = {
      endpoint: '',
      consumerKey: '',
      validationUrl: '',
      urlRoot: '',
      appKey: '',
      appSecret: ''
    };
    for(var key in this.config) {
      this.config[key] = localStorage.getItem(key);
    }
  }

  setConfiguration(config: any) {
    if(config) {
      for(var key in this.config) {
        if(config[key]) {
          this.config[key] = config[key];
        }
        localStorage.removeItem(key);
        if(this.config[key]) {
          localStorage.setItem(key, this.config[key]);
        }
      }
    } else {
      for(var key in this.config) {
        localStorage.removeItem(key);
        this.config[key] = '';
      }
    }
  }

  checkConfig() {
    return (this.config.urlRoot && this.config.appKey && this.config.appSecret && this.config.consumerKey && this.config.endpoint);
  }

  getHashedSignature(httpMethod, url, body, timestamp) {
    const signature = [
      this.config.appSecret,
      this.config.consumerKey,
      httpMethod,
      url,
      body || '',
      timestamp
    ];

    let hash = CryptoJs.SHA1(signature.join('+'));

    return '$1$' + hash.toString(CryptoJs.enc.Hex);
  }

  getHeaders(url, config: any = {}) {
    if (!this.timestampLag) {
      if (!this.timeRequestSended) {
        this.timeRequestSended = true;
        this.timeObservable = this.http.get(this.config.urlRoot + '/auth/time')
          .retry(3)
          .share()
          .map(resp => resp.json())
          .map(timestamp => {
            this.timestampServer = timestamp;
            this.timestampLocal = Date.now();
            this.timestampLag = timestamp - Math.round(Date.now() / 1000);

            return timestamp;
          });
      }
    } else {
      this.timeObservable = Observable.fromPromise(new Promise(resolve => resolve(Math.round(Date.now() / 1000) + this.timestampLag)))
        .map(resp => resp);
    }
    return this.timeObservable
      .map(timestamp => {
        let reqBody = null;
        let headers = {};

        if (typeof(config.body) === 'object' && Object.keys(config.body).length > 0) {
          if (config.method === 'PUT' || config.method === 'POST') {
            // Escape unicode
            reqBody = JSON.stringify(config.body).replace(/[\u0080-\uFFFF]/g, function(m) {
              return "\\u" + ("0000" + m.charCodeAt(0).toString(16)).slice(-4);
            });
            headers['Content-Length'] = reqBody.length;
          }
        }

        headers = Object.assign({}, {
          'X-Ovh-Consumer': this.config.consumerKey,
          'X-Ovh-Signature': this.getHashedSignature(config.method || 'GET', this.config.urlRoot + url, config.body || null, timestamp),
          'X-Ovh-Timestamp': timestamp,
          'X-Ovh-Application': this.config.appKey
        }, headers);

        if (config.method === 'POST' || config.method === 'PUT') {
          headers['Content-Type'] = 'application/json';
        }

        return { headers: new Headers(headers) };
      });
  }

  get(url, opts = {}) {
    return this.getHeaders(url, { method: 'GET' })
      .map(headers => this.http.get(this.config.urlRoot + url, Object.assign({}, opts, headers)))
      .mergeAll()
      .map(res => res.json());
  }

  post(url, data, opts = {}) {
    return this.getHeaders(url, { method: 'POST', body: data })
      .map(headers => this.http.post(this.config.urlRoot + url, data, Object.assign({}, opts, headers)))
      .mergeAll()
      .map(res => res.json());
  }

  put(url, data, opts = {}) {
    return this.getHeaders(url, { method: 'PUT', body: data })
      .map(headers => this.http.put(this.config.urlRoot + url, data, Object.assign({}, opts, headers)))
      .mergeAll()
      .map(res => res.json());
  }

  delete(url, opts = {}) {
    return this.getHeaders(url, { method: 'DELETE' })
      .map(headers => this.http.delete(this.config.urlRoot + url, Object.assign({}, opts, headers)))
      .mergeAll()
      .map(res => res.json());
  }
}
