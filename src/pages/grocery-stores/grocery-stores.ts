import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { GroceryStoresProvider } from '../../providers/grocery-stores/grocery-stores';
import { GeoLocationProvider } from '../../providers/geo-location/geo-location';
import { GroceryStore } from '../../models/grocery-store';
import { GroceryStoreModalPage } from '../grocery-store-modal/grocery-store-modal';
import { MapSearchParameters } from '../../models/map-search-parameters';

/**
 * Generated class for the GroceryStoresPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-grocery-stores',
  templateUrl: 'grocery-stores.html',
})
export class GroceryStoresPage {

  stores: GroceryStore[] = [];
  dbStores: GroceryStore[] = [];
  mapStores: GroceryStore[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private groceryStoresProvider: GroceryStoresProvider,
    private geoLocationProvider: GeoLocationProvider,
    private modalCtrl: ModalController) {
  }

  ionViewDidEnter() {
    this.initStores().then((res) => {
    });
  }

  private async initStores() {
    this.groceryStoresProvider.getGroceryStores(5).forEach(async store => {
      store.distance = await this.geoLocationProvider.getDistanceFromCurrentLocation(store.coordinates);
      this.dbStores.push(store);
    });

    this.nearbyPlaceApi();
  }

  async nearbyPlaceApi() {
    this.geoLocationProvider.nearbyApi().then((res) => {
      res.subscribe(data => {
        data.results.forEach(async element => {

          console.log("ELEMENT: ", element);

          let distance = await this.geoLocationProvider.getDistanceFromCurrentLocation({
            latitude: element.geometry.location.lat,
            longitude: element.geometry.location.lng,
            latitudeType: 'N',
            longitudeType: 'E'
          });

          if (element.photos) {
            this.geoLocationProvider.getPhoto(element.photos[0].photo_reference).subscribe((data) => {
              this.pushMapStore(element, null, distance);
            })
          } else {
            this.pushMapStore(element, null, distance);
          }
        });
      });
    });
  }

  private pushMapStore(element, imageUrl, distance) {
    this.mapStores.push({
      id: element.id,
      name: element.name,
      coordinates: {
        latitude: element.geometry.location.lat,
        longitude: element.geometry.location.lng,
        latitudeType: 'N',
        longitudeType: 'E'
      },
      image_url: imageUrl,
      distance: distance,
    });

    let allStores = this.mapStores.concat(this.dbStores);

    this.stores = allStores.sort((l, r): number => {
      if (l.distance < r.distance) return -1;
      if (l.distance > r.distance) return 1;
      return 0
    });
  }

  openAddGroceryStoreModal() {
    var data = { 'GroceryStore': new GroceryStore(), 'Type': 'Add' };
    var modalPage = this.modalCtrl.create(GroceryStoreModalPage, data);
    modalPage.present();
  }

  doInfinite(infiniteScroll) {
    console.log('Begin async operation');

    console.log('Async operation has ended');
    infiniteScroll.complete();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GroceryStoresPage');
  }

}
