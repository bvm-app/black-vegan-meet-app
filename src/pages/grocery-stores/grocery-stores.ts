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

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private groceryStoresProvider: GroceryStoresProvider,
    private geoLocationProvider: GeoLocationProvider,
    private modalCtrl: ModalController) {
  }

  ionViewDidEnter() {
    this.initStores();
  }

  private async initStores() {
    this.groceryStoresProvider.getGroceryStores();

    this.groceryStoresProvider.groceryStoresSubject.subscribe(data => {
      this.stores = [];
      
      data.forEach(element => {
        this.stores.push(element);
      });

      this.stores =  this.stores.sort((l, r): number => {
        if (l.distance < r.distance) return -1;
        if (l.distance > r.distance) return 1;
        return 0
      });
      console.log("ELEMENT!!: ", this.stores);
    });
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
