import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { EventProvider } from '../../providers/event/event';
import { Geolocation } from '@ionic-native/geolocation';
import { env } from '../../app/env';

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
  events: any;
  defaultEventImagePlaceholder = env.DEFAULT.eventImagePlaceholder;
  isFetching = true;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    public geolocation: Geolocation,
    public eventProvider: EventProvider
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EventsPage');


    this.eventProvider.getEvents(this.query).subscribe(data => {
      this.events = data;
      this.isFetching = false;
      
    });

    this.geolocation.getCurrentPosition().then((position) => {
      console.log(position);
    }, (err) => {
      console.log(err)
    });

  }

  openEventDetail(event){
    // TODO go to event
    console.log('go to event', event);
  }

}
