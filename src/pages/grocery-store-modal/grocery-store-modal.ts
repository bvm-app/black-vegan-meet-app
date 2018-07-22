import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController, LoadingController, AlertController, ActionSheetController } from 'ionic-angular';
import { GroceryStore } from '../../models/grocery-store';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { GroceryStoresProvider } from '../../providers/grocery-stores/grocery-stores';
import { DragulaService } from 'ng2-dragula';
import { GeoLocationProvider } from '../../providers/geo-location/geo-location';
import { Subscription } from 'rxjs';
import { AngularFireDatabase } from 'angularfire2/database';
import { FirebaseStorageProvider } from '../../providers/firebase-storage/firebase-storage';
import { UserProvider } from '../../providers/user/user';
import { AdMobFreeBannerConfig, AdMobFree } from '../../../node_modules/@ionic-native/admob-free';
/**
 * Generated class for the GroceryStoreModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

declare var google;

@IonicPage()
@Component({
  selector: 'page-grocery-store-modal',
  templateUrl: 'grocery-store-modal.html',
})
export class GroceryStoreModalPage {

  @ViewChild('map') mapElement: ElementRef;
  cordova = window['cordova'];
  map: any;
  markers: any[] = [];

  addModal: boolean = false;
  editModal: boolean = false;
  displayModal: boolean = true;
  store: GroceryStore = new GroceryStore();
  storeForm: FormGroup;
  submitAttempt: boolean = false;

  isAdmin: boolean = false;

  storeImages: any[] = [];
  storeImagesSubscription: Subscription;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private viewCtrl: ViewController, private formBuilder: FormBuilder,
    private groceryStoresProvider: GroceryStoresProvider,
    private geoLocationProvider: GeoLocationProvider, private toastCtrl: ToastController,
    private loadingCtrl: LoadingController, private dragulaService: DragulaService,
    private alertCtrl: AlertController, private actionSheetCtrl: ActionSheetController,
    private db: AngularFireDatabase, private dbStorage: FirebaseStorageProvider,
    private admob: AdMobFree, private userProvider: UserProvider) {


    this.storeForm = formBuilder.group({
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

  addGroceryStore() {
    this.submitAttempt = true;

    if (this.storeForm.valid) {
      let name = this.store.name;
      let loading = this.loadingCtrl.create({
        content: 'Adding grocery store...'
      });
      loading.present();

      if (this.addModal) {
        this.groceryStoresProvider.add(this.store).then((res) => {
          this.updateStorePhotos(res);

          let toast = this.toastCtrl.create({
            message: 'A new grocery store was successfully added.',
            duration: 3000,
            position: 'top'
          });

          toast.present();
          loading.dismiss();
          this.navCtrl.pop();
        });
      } else if (this.editModal) {
        this.groceryStoresProvider.update(this.store).then((res) => {
          let toast = this.toastCtrl.create({
            message: 'The grocery store was successfully updated.',
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

  loadMap() {
    this.geoLocationProvider.getCurrentPosition().then((res) => {
      let latLng = new google.maps.LatLng(res.coords.latitude, res.coords.longitude);
      if (this.displayModal || this.editModal) {
        latLng = new google.maps.LatLng(this.store.coordinates.latitude, this.store.coordinates.longitude);
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

  delete() {
    let alert = this.alertCtrl.create({
      title: 'Remove store',
      message: 'Are you sure you want to remove this store?',
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
            this.groceryStoresProvider.delete(this.store).then(res => {
              this.navCtrl.popToRoot();
            });
          }
        }
      ]
    });
    alert.present();
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

    this.store.coordinates.latitude = position.lat();
    this.store.coordinates.longitude = position.lng();


    let content = "<h4>" + this.store.name + "</h4>";
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
            this.storeImages = this.storeImages.filter(image => image !== toBeRemovedImage);
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
              this.storeImages.push(imageData.downloadUrl);
            });
          }
        },
        {
          text: 'Upload from photo library',
          handler: () => {
            this.dbStorage.uploadImageFromGallery().then(imageData => {
              this.storeImages.push(imageData.downloadUrl);
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

          this.storeImages.push(imageData.downloadUrl);

          console.log('storeImages:', this.storeImages);
        })
        .catch((err: Error) => {
          console.log('File upload error:', err.message);
        });
    }
  }

  updateStorePhotos(storeId) {
    this.db
      .object(`groceryStore/${storeId}/images`)
      .set(this.storeImages)
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

  showBanner() {
    let bannerConfig: AdMobFreeBannerConfig = {
      isTesting: true, // Remove in production
      autoShow: true,
      id: 'ca-app-pub-4917220357544982/9420529379'
    };

    this.admob.banner.config(bannerConfig);

    this.admob.banner.prepare().then(() => {
      // success
      this.admob.banner.show();
      console.log("SUCCESS BANNER");
    }).catch(e => {
      console.log("ERROR: ", e);
    });
  }

  ionViewWillEnter() {
    this.storeImages = [];
    this.isAdmin = this.userProvider.getAdminStatus();

    console.log(this.navParams.get('GroceryStore'));
    console.log(this.navParams.get('Type'));
    let type = this.navParams.get('Type');

    this.addModal = (type === 'Add');
    this.displayModal = (type === 'Display');
    this.editModal = (type === 'Edit');

    if (this.displayModal || this.editModal) this.store = this.navParams.get('Store');

    if (this.editModal) {
      this.storeImages = this.store.images;
    }

    this.loadMap();
  }

  openEditPage() {
    this.navCtrl.push(GroceryStoreModalPage, { Store: this.store, Type: 'Edit' });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GroceryStoreModalPage');
  }

  ionViewDidEnter() {
    this.showBanner();
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
    this.storeImages = [];

    // Iterate through the retrieved list data
    val.childNodes.forEach(item => {
      console.log('item id:', item.id);
      // Do we have data?
      if (item.id) {
        // Re-populate the items array with new list order
        this.storeImages.push(item.id);
      }
    });

    // Here we console log the directory structure of the array
    // but we could add functionality to save the re-populated
    // array items (and new list order) to a database for 'session'
    //persistence
    console.dir(this.storeImages);
  }

}
