import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { GroceryStoresProvider } from '../../providers/grocery-stores/grocery-stores';
import { GroceryStore } from '../../models/grocery-store';
import { GroceryStoreModalPage } from '../grocery-store-modal/grocery-store-modal';
import { GeoLocationProvider } from '../../providers/geo-location/geo-location';
import { AdMobFreeBannerConfig, AdMobFree } from '../../../node_modules/@ionic-native/admob-free';

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

  stores: GroceryStore[];
  isFetching: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private groceryStoresProvider: GroceryStoresProvider,
    private admob: AdMobFree) {
  }

  openStore(store: GroceryStore) {
    this.navCtrl.push(GroceryStoreModalPage, { Store: store, Type: 'Display' });
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

  getGroceryStores() {
    this.isFetching = true;

    this.groceryStoresProvider.getGroceryStores().then(res => {

      this.groceryStoresProvider.groceryStoresSubject.subscribe(data => {
        const stores = [];

        data.forEach(element => {
          stores.push(element);
        });

        this.stores = stores.sort((l, r): number => {
          if (l.distance < r.distance) return -1;
          if (l.distance > r.distance) return 1;
          return 0
        });

        if (!data.length) {
          const waitingTimeForFirebaseResponse = 2000;
          setTimeout(() => {
            this.isFetching = false;
          }, waitingTimeForFirebaseResponse);
        } else {
          this.isFetching = false;
        }
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

  ionViewDidEnter() {
    this.showBanner();
  }

}
