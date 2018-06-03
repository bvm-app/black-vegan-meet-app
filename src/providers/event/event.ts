import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import moment, { Moment } from 'moment';
import { Event } from '../../models/Event';


/*
  Generated class for the EventProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class EventProvider {

  private dbPath = '/events';

  eventsRef;

  apiUrl = 'https://cors-anywhere.herokuapp.com/https://world.timeout.com/api/events';

  constructor(
    public http: HttpClient,
    private db: AngularFireDatabase
  ) {
    console.log('Hello EventProvider Provider');
    this.eventsRef = db.list(this.dbPath);
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

  createEvent(event: Event): void {
    this.eventsRef.push(event);
  }

  updateEvent(key: string, value: any): void {
    this.eventsRef.update(key,value).catch(error => this.handleError(error));
  }

  deleteEvent(key: string): void{
    this.eventsRef.remove(key).catch( error => this.handleError(error));
  }

  getEventList() {
    return this.eventsRef.valueChanges();
  }

  deleteAll(): void{
    this.eventsRef.remove().catch( error => this.handleError(error));
  }

  private handleError(error){
    console.log(error);
  }

}
