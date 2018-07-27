import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { EventProvider } from '../../providers/event/event';
import { Geolocation } from '@ionic-native/geolocation';
import { env } from '../../app/env';
import { Event } from '../../models/Event';
import { AngularFireDatabase } from 'angularfire2/database';
import { take } from 'rxjs/operators';
import { GeoLocationProvider } from '../../providers/geo-location/geo-location';
import { EventDetailPage } from '../event-detail/event-detail';
import * as moment from 'moment';
import { AdMobFree, AdMobFreeBannerConfig } from '../../../node_modules/@ionic-native/admob-free';

/**
 * Generated class for the EventsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-events',
  templateUrl: 'events.html',
})
export class EventsPage {
  query: string = 'vegan';
  events: Event[];
  defaultEventImagePlaceholder = env.DEFAULT.eventImagePlaceholder;
  isFetching = true;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    public geolocation: Geolocation,
    public eventProvider: EventProvider,
    private db: AngularFireDatabase,
    private geolocationProvider: GeoLocationProvider,
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EventsPage');

    this.eventProvider.getEvents(this.query)
      .subscribe(data => {
        this.getFirebaseEvents(data);
      }, error => this.getFirebaseEvents());
  }

  getFirebaseEvents(data: Event[] = []) {
    let subscription = this.db.object(`events`).valueChanges().pipe(take(1))
      .subscribe(events => {
        subscription.unsubscribe();

        for (let key in events) {
          data.push(new Event(events[key]));
        }

        data = data.filter(x => moment(x.endDateTime).isAfter(moment()));
        // this.events = data;
        // this.isFetching = false;

        this.filterEventsByDistanceFromCoordinates(data).then(filtered => {
          this.events = filtered
          this.isFetching = false;
        });
      });
  }

  async filterEventsByDistanceFromCoordinates(events: Event[], maxDistance: number = 100) {
    let position = await this.geolocation.getCurrentPosition();
    let distanceBetweenCoordinates;
    if (position && position.coords) {
      let filteredEvents = [...events];
      filteredEvents = events.filter(event => {
        if (!event.coordinates) return false;

        distanceBetweenCoordinates = this.geolocationProvider.getDistanceBetweenCoordinates(
          position.coords,
          event.coordinates
        );

        // Convert to miles
        distanceBetweenCoordinates = this.geolocationProvider.convertKMtoMile(distanceBetweenCoordinates);
        event.distance = distanceBetweenCoordinates;
        return distanceBetweenCoordinates <= maxDistance;
      });

      return filteredEvents;
    }

    return events;
  }

  openEventDetail(event) {
    // TODO go to event
    console.log('go to event', event);
    this.navCtrl.push(EventDetailPage, { event: event });

  }

}
