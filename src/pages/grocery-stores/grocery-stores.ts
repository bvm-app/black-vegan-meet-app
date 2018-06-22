import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { GroceryStoresProvider } from '../../providers/grocery-stores/grocery-stores';
import { GroceryStore } from '../../models/grocery-store';
import { GroceryStoreModalPage } from '../grocery-store-modal/grocery-store-modal';

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
  isFetching: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private groceryStoresProvider: GroceryStoresProvider,
    private loadingCtrl: LoadingController) {
  }

  openStore(store: GroceryStore) {
    this.navCtrl.push(GroceryStoreModalPage, { Store: store, Type: 'Display' });
  }

  getGroceryStores() {
    this.isFetching = true;

    this.groceryStoresProvider.getGroceryStores().then(res => {

      this.groceryStoresProvider.groceryStoresSubject.subscribe(data => {
        this.stores = [];

        data.forEach(element => {
          this.stores.push(element);
        });

        this.stores = this.stores.sort((l, r): number => {
          if (l.distance < r.distance) return -1;
          if (l.distance > r.distance) return 1;
          return 0
        });

        this.isFetching = false;

      });

      return new Promise(resolve => {
        resolve({ Result: true });
      })
    });
  }

  doInfinite(infiniteScroll) {
    console.log('Begin async operation');

    console.log('Async operation has ended');
    infiniteScroll.complete();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GroceryStoresPage');
    this.getGroceryStores();
  }

}
