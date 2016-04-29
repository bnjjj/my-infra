'http://rss2json.com/api.json?rss_url='
import {Injectable} from 'angular2/core';
import {Http} from 'angular2/http';

@Injectable()
export class NetworkStateService {
  constructor(private http: Http) {

  }

  getAll() {
    return this.http.get('http://rss2json.com/api.json?rss_url=' + encodeURIComponent('http://travaux.ovh.net/rss.php'))
      .map(resp => resp.json());
  }

  getOneByCategory(category: string) {
    return this.http.get('http://rss2json.com/api.json?rss_url=' + encodeURIComponent('http://travaux.ovh.net/rss.php?proj=' + category))
      .map(resp => resp.json());
  }
}
