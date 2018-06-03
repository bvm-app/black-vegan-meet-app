import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import moment, { Moment } from 'moment';

/*
  Generated class for the EventProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class EventProvider {

  apiUrl = 'https://cors-anywhere.herokuapp.com/https://world.timeout.com/api/events';

  constructor(public http: HttpClient) {
    console.log('Hello EventProvider Provider');
  }

  getEvents(query: string) {

    return this.http.get(this.apiUrl,
      {
        params: {
          order: 'query',
          vierport: 'true',
          lat_low: '-89.38862291855794',
          lat_high: '89.59761728769129',
          lon_low: '-180',
          lon_high: '180',
          start_time: moment().format('YYYY-MM-DD HH:mm:ss').toString(),
          end_time: moment().add(1, 'M').format('YYYY-MM-DD HH:mm:ss').toString(),
          query: query,
          offset: '0',
          limit: '30'
        }
      }
    );

  }

}
