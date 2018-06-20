import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Event } from '../../models/Event';
import { EventProvider } from '../../providers/event/event';
import { env } from '../../app/env';
import { UserProvider } from '../../providers/user/user';
import { EventModalPage } from '../event-modal/event-modal';

/**
 * Generated class for the EventDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var google;

@IonicPage()
@Component({
  selector: 'page-event-detail',
  templateUrl: 'event-detail.html',
})
export class EventDetailPage {

  event: Event;
  defaultEventImagePlaceholder = env.DEFAULT.eventImagePlaceholder;

  @ViewChild('map') mapElement: ElementRef;
  map: any;
  markers: any[] = [];
  isAdmin: boolean = false;


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private eventProvider: EventProvider,
    private userProvider: UserProvider
  ) {
  }

  ionViewDidLoad() {
    this.event = this.navParams.get('event');
    this.loadMap();

    if (!this.event.images || this.event.images.length <= 0) {
      this.event.images = [this.defaultEventImagePlaceholder];
    }

    if (this.event.slug) {
      this.eventProvider.getEventDescription(this.event.slug)
        .subscribe(description => {
          this.event.description = description;
          this.event.images = [this.event.image_url];

          console.log('EventDetailPage', this.event);
        });
    }

  }

  openEditPage() {
    this.navCtrl.push(EventModalPage, { Event: this.event, Type: 'Edit' });
  }


  ionViewWillEnter() {
    this.isAdmin = this.userProvider.getAdminStatus();
  }

  loadMap() {
    let latLng = new google.maps.LatLng(this.event.coordinates.latitude, this.event.coordinates.longitude);
    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    this.addMarker();
  }

  addMarker() {
    let position = this.map.getCenter();

    this.markers.forEach(marker => {
      marker.setMap(null);
    });

    this.markers.push(new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: position
    }));

    this.event.coordinates.latitude = position.lat();
    this.event.coordinates.longitude = position.lng();
  }

}
