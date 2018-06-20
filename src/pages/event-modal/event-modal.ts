import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController, ActionSheetController, AlertController, LoadingController } from 'ionic-angular';
import { Event } from '../../models/Event';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GeoLocationProvider } from '../../providers/geo-location/geo-location';
import { AngularFireDatabase } from 'angularfire2/database';
import { FirebaseStorageProvider } from '../../providers/firebase-storage/firebase-storage';
import { EventProvider } from '../../providers/event/event';
import { UserProvider } from '../../providers/user/user';
import { DragulaService } from 'ng2-dragula';
import { Moment } from 'moment';
import * as moment from 'moment';
import { Coordinates } from '../../models/coordinates';

/**
 * Generated class for the EventModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

declare var google;

@IonicPage()
@Component({
  selector: 'page-event-modal',
  templateUrl: 'event-modal.html',
})
export class EventModalPage {

  @ViewChild('map') mapElement: ElementRef;

  public localDate: Date = new Date();

  cordova = window['cordova'];
  map: any;
  markers: any[] = [];

  addModal: boolean = false;
  editModal: boolean = false;
  displayModal: boolean = true;
  event: Event = new Event();
  eventForm: FormGroup;
  submitAttempt: boolean = false;

  isAdmin: boolean = false;
  eventImages: any[] = [];

  minStartDate = moment().format("YYYY-MM-DD");
  maxStartDate = moment().add('5', 'year').format("YYYY-MM-DD");

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl: ViewController,
    private formBuilder: FormBuilder,
    private geoLocationProvider: GeoLocationProvider,
    private toastCtrl: ToastController,
    private db: AngularFireDatabase,
    private dbStorage: FirebaseStorageProvider,
    private eventProvider: EventProvider,
    private userProvider: UserProvider,
    private dragulaService: DragulaService,
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController
  ) {
    this.eventForm = formBuilder.group({
      name: ['', Validators.compose([Validators.maxLength(30), Validators.required])],
      description: ['', Validators.required],
      longitude: ['', Validators.compose([Validators.pattern('[0-9-.]*'), Validators.required])],
      latitude: ['', Validators.compose([Validators.pattern('[0-9-.]*'), Validators.required])],
      startDate: ['', Validators.required],
      startTime: ['', Validators.required],
      endDate: ['', Validators.required],
      endTime: ['', Validators.required],
      location: [''],
      organizer: ['']
    });

    this.dragulaService.drag.subscribe(val => {
      console.log('Is dragging:', val);
    });

    this.dragulaService.drop.subscribe(val => {
      console.log('Is dropped:', val);
      this.onDrop(val[2]);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EventModalPage');
  }

  ionViewWillEnter() {

    this.eventImages = [];
    this.isAdmin = this.userProvider.getAdminStatus();

    
    let type = this.navParams.get('Type');

    this.addModal = (type === 'Add');
    this.displayModal = (type === 'Display');
    this.editModal = (type === 'Edit');

    if (this.displayModal || this.editModal) this.event = this.navParams.get('Event');

    if (this.editModal) {
      this.eventImages = this.event.images;

      let eventDate = moment(this.event.startDateTime);
      this.event['startDate'] = eventDate.format('YYYY-MM-DD');
      this.event['startTime'] = eventDate.format('HH:mm');

      eventDate = moment(this.event.endDateTime);
      this.event['endDate'] = eventDate.format('YYYY-MM-DD');
      this.event['endTime'] = eventDate.format('HH:mm');
    }

    console.log('update event', this.event);
    this.loadMap();

  }

  addEvent() {
    console.log('this.event', this.event);
    this.submitAttempt = true;

    if (this.eventForm.valid) {
      let name = this.event.name;
      let loading = this.loadingCtrl.create({
        content: 'Adding event...'
      });
      loading.present();

      let dbEvent = new Event({
        coordinates: this.event.coordinates,
        description: this.event.description,
        name: this.event.name,
        startDateTime: `${this.event['startDate']} ${this.event['startTime']}:00`,
        endDateTime: `${this.event['endDate']} ${this.event['endTime']}:00`,
        image_url: this.eventImages[0] || '',
        location: this.event.location || '',
        organizer: this.event.organizer || ''
      });

      console.log('new event', dbEvent);

      if (this.addModal) {
        this.eventProvider.add(dbEvent).then((res) => {
          this.updateEventPhotos(res);

          let toast = this.toastCtrl.create({
            message: 'A new event was successfully added',
            duration: 3000,
            position: 'top'
          });

          toast.present();
          loading.dismiss();
          this.navCtrl.pop();
        });
      } else if (this.editModal) {
        this.eventProvider.update(dbEvent).then((res) => {
          let toast = this.toastCtrl.create({
            message: 'A new event was successfully updated',
            duration: 3000,
            position: 'top'
          });

          toast.present();
          loading.dismiss();
          this.navCtrl.pop();
        });
      }
    }
  }

  delete() {
    let alert = this.alertCtrl.create({
      title: 'Remove event',
      message: 'Are you sure you want to remove this event?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'Confirm',
          handler: () => {
            this.eventProvider.delete(this.event).then(res => {
              this.navCtrl.popToRoot();
            });
          }
        }
      ]
    });
    alert.present();
  }

  loadMap() {
    this.geoLocationProvider.getCurrentPosition().then((res) => {
      let latLng = new google.maps.LatLng(res.coords.latitude, res.coords.longitude);
      if (this.displayModal || this.editModal) {
        latLng = new google.maps.LatLng(this.event.coordinates.latitude, this.event.coordinates.longitude);
      }

      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

      if (this.displayModal || this.editModal) this.addMarker();
    });
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


    let content = "<h4>" + this.event.name + "</h4>";
  }

  onDrop(val: any): void {
    console.log('val on drop:', val.childNodes);
    // Reset the items array
    this.eventImages = [];

    // Iterate through the retrieved list data
    val.childNodes.forEach(item => {
      console.log('item id:', item.id);
      // Do we have data?
      if (item.id) {
        // Re-populate the items array with new list order
        this.eventImages.push(item.id);
      }
    });

    // Here we console log the directory structure of the array
    // but we could add functionality to save the re-populated
    // array items (and new list order) to a database for 'session'
    //persistence
    console.dir(this.eventImages);
  }

  removeImage(toBeRemovedImage) {
    console.log('removing image');
    console.log('index:', toBeRemovedImage);

    let alert = this.alertCtrl.create({
      title: 'Remove image',
      message: 'Are you sure you want to remove this image?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'Confirm',
          handler: () => {
            this.eventImages = this.eventImages.filter(image => image !== toBeRemovedImage);
          }
        }
      ]
    });
    alert.present();
  }

  presentActionSheet() {
    const actionSheet = this.actionSheetCtrl.create({
      title: 'Upload image',
      buttons: [
        {
          text: 'Take photo',
          handler: () => {
            this.dbStorage.uploadImageFromCamera().then(imageData => {
              this.eventImages.push(imageData.downloadUrl);
            });
          }
        },
        {
          text: 'Upload from photo library',
          handler: () => {
            this.dbStorage.uploadImageFromGallery().then(imageData => {
              this.eventImages.push(imageData.downloadUrl);
            });
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => { }
        }
      ]
    });
    actionSheet.present();
  }

  addPhoto() {
    if (this.cordova) {
      this.presentActionSheet();
    } else {
      let inputElem: any = document.querySelector('#fileElem');
      inputElem.click();
    }
  }

  uploadImageFromWeb(file) {
    if (file.length) {
      this.dbStorage
        .uploadImageFromWeb(file[0])
        .then(imageData => {
          this.eventImages.push(imageData.downloadUrl);
        })
        .catch((err: Error) => {
          console.log('File upload error:', err.message);
        });
    }
  }

  updateEventPhotos(eventId) {
    this.db
      .object(`events/${eventId}/images`)
      .set(this.eventImages)
      .then(() => {
        this.presentToast('Successfully updated images');
      })
      .catch(() => {
        this.presentToast('Oops! Something went wrong...');
      });
  }

  presentToast(message: string) {
    this.toastCtrl
      .create({
        message: message,
        duration: 3000
      })
      .present();
  }

}
