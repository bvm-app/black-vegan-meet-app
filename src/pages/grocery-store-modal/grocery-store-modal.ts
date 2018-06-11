import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController, LoadingController } from 'ionic-angular';
import { GroceryStore } from '../../models/grocery-store';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { GroceryStoresProvider } from '../../providers/grocery-stores/grocery-stores';
import { DragulaService } from 'ng2-dragula';
import { GeoLocationProvider } from '../../providers/geo-location/geo-location';
import { Subscription } from 'rxjs';
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
  map: any;
  markers: any[] = [];

  addModal: boolean = false;
  editModal: boolean = false;
  displayModal: boolean = true;
  store: GroceryStore = new GroceryStore();
  storeForm: FormGroup;
  submitAttempt: boolean = false;

  storeImages: any[] = [];
  storeImagesSubscription: Subscription;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private viewCtrl: ViewController, private formBuilder: FormBuilder,
    private groceryStoresProvider: GroceryStoresProvider,
    private geoLocationProvider: GeoLocationProvider, private toastCtrl: ToastController,
    private loadingCtrl: LoadingController, private dragulaService: DragulaService) {
    this.storeForm = formBuilder.group({
      name: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      description: ['', Validators.compose([Validators.pattern('[a-zA-Z., ]*'), Validators.required])],
      longitude: ['', Validators.compose([Validators.pattern('[0-9-.]*'), Validators.required])],
      latitude: ['', Validators.compose([Validators.pattern('[0-9-.]*'), Validators.required])],
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
    
      this.groceryStoresProvider.add(this.store).then((res) => {
        let toast = this.toastCtrl.create({
          message: 'A new grocery store was successfully added.',
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

    this.store.coordinates.latitude = position.lat();
    this.store.coordinates.longitude = position.lng();


    let content = "<h4>" + this.store.name + "</h4>";
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad GroceryStoreModalPage');
  }

}
