import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { Restaurant } from '../../models/restaurant';
import { RestaurantsProvider } from '../../providers/restaurants/restaurants';
import { RestaurantModalPage } from '../restaurant-modal/restaurant-modal';
import { GeoLocationProvider } from '../../providers/geo-location/geo-location';

/**
 * Generated class for the RestaurantsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-restaurants',
  templateUrl: 'restaurants.html',
})
export class RestaurantsPage {

  restaurants: Restaurant[];
  isFetching: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private restaurantsProvider: RestaurantsProvider,
    private geoLocationProvider: GeoLocationProvider) {
  }

  ionViewDidLoad() {
    this.getGroceryStores();
  }

  openRestaurant(restaurant: Restaurant) {
    this.navCtrl.push(RestaurantModalPage, { Restaurant: restaurant, Type: 'Display' });
  }

  getGroceryStores() {
    this.isFetching = true;

    this.restaurantsProvider.getRestaurants().then(res => {

      this.restaurantsProvider.restaurantsSubject.subscribe(data => {
        const restaurants = [];

        data.forEach(element => {
          restaurants.push(element);
        });

        this.restaurants = restaurants.sort((l, r): number => {
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

}
