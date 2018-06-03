import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { EventProvider } from '../../providers/event/event';
import { CreateEventPage } from '../create-event/create-event';
import { Subscription } from 'rxjs/Subscription';
import { AngularFireDatabase } from 'angularfire2/database';


/**
 * Generated class for the ManageEventsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-manage-events',
  templateUrl: 'manage-events.html',
})
export class ManageEventsPage {

  events: any;
  eventsSubscription: Subscription;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public eventProvider: EventProvider,
    public modalCtrl: ModalController,
    private db: AngularFireDatabase
  ) {
  }

  ionViewDidLoad() {
    this.getEvents();
    console.log('ionViewDidLoad ManageEventsPage');
  }

  ionViewDidLeave() {
    if (this.eventsSubscription) this.eventsSubscription.unsubscribe();
  }

  getEvents() {
    this.eventsSubscription = this.db.list(`/events`).valueChanges().subscribe(events => {
      console.log('events:', events);
      this.events = events;
    });
  }

  deleteAllEvents(){
    this.eventProvider.deleteAll();
  }

  addEvent() {
    let modal = this.modalCtrl.create(CreateEventPage);
    modal.present();
  }

}
