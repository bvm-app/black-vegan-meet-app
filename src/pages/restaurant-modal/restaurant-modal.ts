import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController, ActionSheetController, LoadingController, AlertController } from 'ionic-angular';
import { Restaurant } from '../../models/restaurant';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { RestaurantsProvider } from '../../providers/restaurants/restaurants';
import { GeoLocationProvider } from '../../providers/geo-location/geo-location';
import { DragulaService } from 'ng2-dragula';
import { FirebaseStorageProvider } from '../../providers/firebase-storage/firebase-storage';
import { AngularFireDatabase } from 'angularfire2/database';

/**
 * Generated class for the RestaurantModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

declare var google;

@IonicPage()
@Component({
  selector: 'page-restaurant-modal',
  templateUrl: 'restaurant-modal.html',
})
export class RestaurantModalPage {
  @ViewChild('map') mapElement: ElementRef;
  cordova = window['cordova'];
  map: any;
  markers: any[] = [];

  addModal: boolean = false;
  editModal: boolean = false;
  displayModal: boolean = true;
  restaurant: Restaurant = new Restaurant();
  restaurantForm: FormGroup;
  submitAttempt: boolean = false;

  restaurantImages: any[] = [];
  restaurantImagesSubscription: Subscription;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private viewCtrl: ViewController, private formBuilder: FormBuilder,
    private restaurantsProvider: RestaurantsProvider,
    private geoLocationProvider: GeoLocationProvider, private toastCtrl: ToastController,
    private loadingCtrl: LoadingController, private dragulaService: DragulaService,
    private alertCtrl: AlertController, private actionSheetCtrl: ActionSheetController,
    private db: AngularFireDatabase, private dbStorage: FirebaseStorageProvider) {

    this.restaurantForm = formBuilder.group({
      name: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      description: ['', Validators.compose([Validators.pattern('[a-zA-Z., ]*'), Validators.required])],
      longitude: ['', Validators.compose([Validators.pattern('[0-9-.]*'), Validators.required])],
      latitude: ['', Validators.compose([Validators.pattern('[0-9-.]*'), Validators.required])],
    });

    this.dragulaService.drag.subscribe(val => {
      console.log('Is dragging:', val);
    });

    this.dragulaService.drop.subscribe(val => {
      console.log('Is dropped:', val);
      this.onDrop(val[2]);
    });

  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

  addRestaurant() {
    this.submitAttempt = true;

    if (this.restaurantForm.valid) {
      let name = this.restaurant.name;
      let loading = this.loadingCtrl.create({
        content: 'Adding restaurant...'
      });
      loading.present();

      this.restaurantsProvider.add(this.restaurant).then((res) => {

        this.updateStorePhotos(res);


        let toast = this.toastCtrl.create({
          message: 'A new restaurant was successfully added.',
          duration: 3000,
          position: 'top'
        });

        toast.present();
        loading.dismiss();
        this.navCtrl.pop();
      });
    }
  }

  loadMap() {
    this.geoLocationProvider.getCurrentPosition().then((res) => {
      let latLng = new google.maps.LatLng(res.coords.latitude, res.coords.longitude);

      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
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

    console.log("POSITION: ", position);

    this.restaurant.coordinates.latitude = position.lat();
    this.restaurant.coordinates.longitude = position.lng();


    let content = "<h4>" + this.restaurant.name + "</h4>";
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
            this.restaurantImages = this.restaurantImages.filter(image => image !== toBeRemovedImage);
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
              this.restaurantImages.push(imageData.downloadUrl);
            });
          }
        },
        {
          text: 'Upload from photo library',
          handler: () => {
            this.dbStorage.uploadImageFromGallery().then(imageData => {
              this.restaurantImages.push(imageData.downloadUrl);
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
          console.log('imageData:', imageData);

          this.restaurantImages.push(imageData.downloadUrl);

          console.log('restaurantImages:', this.restaurantImages);
        })
        .catch((err: Error) => {
          console.log('File upload error:', err.message);
        });
    }
  }

  updateStorePhotos(restaurantId) {
    this.db
      .object(`restaurant/${restaurantId}/images`)
      .set(this.restaurantImages)
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

  ionViewWillEnter() {
    this.loadMap();
    console.log(this.navParams.get('GroceryStore'));
    console.log(this.navParams.get('Type'));
    let type = this.navParams.get('Type');

    this.addModal = (type === 'Add');
    this.displayModal = (type === 'Display');
    this.editModal = (type === 'Edit');
  }

  // Taken from:
  // http://masteringionic.com/blog/2017-12-15-creating-a-sortable-list-with-ionic-and-dragula/

  /**
   * Extract the reordered list value after the dragged list item
   * has been dropped into its desired location
   *
   * @public
   * @method onDrop
   * @return {None}
   */
  onDrop(val: any): void {
    console.log('val on drop:', val.childNodes);
    // Reset the items array
    this.restaurantImages = [];

    // Iterate through the retrieved list data
    val.childNodes.forEach(item => {
      console.log('item id:', item.id);
      // Do we have data?
      if (item.id) {
        // Re-populate the items array with new list order
        this.restaurantImages.push(item.id);
      }
    });

    // Here we console log the directory structure of the array
    // but we could add functionality to save the re-populated
    // array items (and new list order) to a database for 'session'
    //persistence
    console.dir(this.restaurantImages);
  }

}
