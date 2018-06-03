import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
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

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public geolocation: Geolocation,
    public eventProvider: EventProvider
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EventsPage');

    let loader = this.loadingCtrl.create({
      content: 'Searching for Events...',
      dismissOnPageChange: true
    });

    loader.present();

    this.eventProvider.getEvents(this.query).subscribe(data => {
      this.events = data;
      loader.dismiss();
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
