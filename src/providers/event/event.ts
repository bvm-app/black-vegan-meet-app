import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import moment, { Moment } from 'moment';
import { Event } from '../../models/Event';
import { Coordinates } from '../../models/coordinates';
import { Observable } from 'rxjs';
import 'rxjs/Rx';
import { take } from 'rxjs/operators';

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

  getEventDescription(slug: string): Observable<string> {
    return this.http.get(`${this.apiUrl}/${slug}`)
      .map(result => <string>result['description']);
  }

  getEvents(query: string): Observable<Event[]> {
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
    ).map(events => {
      console.log(events);
      return (<any[]>events).map(event => new Event({
        id: event['id'],
        name: event['name'],
        image_url: event['pic_cover']['source'],
        startDateTime: event['start_time'],
        endDateTime: event['end_time'],
        organizer: event['creator_name'],
        location: event['location'],
        coordinates: <Coordinates>{ latitude: event['lat'], longitude: event['lon'] },
        slug: event['slug']
      }))
    }
    );
  }

  add(event: Event) {
    return new Promise(resolve => {
      let id = this.db.list('/events').push(event).key;
      this.db.object(`/events/${id}`).update({
        id: id
      });

      resolve(id);
    });
  }

  update(event: Event) {
    return new Promise(resolve => {
      resolve(this.db.object(`/events/${event.id}`).update(event));
    });
  }

  delete(event: Event) {
    return new Promise(resolve => {
      resolve(this.db.object(`/events/${event.id}`).remove());
    });
  }

  createEvent(event: Event): void {
    this.eventsRef.push(event);
  }

  updateEvent(key: string, value: any): void {
    this.eventsRef.update(key, value).catch(error => this.handleError(error));
  }

  deleteEvent(key: string): void {
    this.eventsRef.remove(key).catch(error => this.handleError(error));
  }

  getEventList() {
    return this.eventsRef.valueChanges();
  }

  deleteAll(): void {
    this.eventsRef.remove().catch(error => this.handleError(error));
  }

  private handleError(error) {
    console.log(error);
  }

}
