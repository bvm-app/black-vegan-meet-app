import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { Restaurant } from '../../models/restaurant';
import { RestaurantsProvider } from '../../providers/restaurants/restaurants';
import { RestaurantModalPage } from '../restaurant-modal/restaurant-modal';

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

  restaurants: Restaurant[] = [];
  isFetching: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private restaurantsProvider: RestaurantsProvider) {
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
        this.restaurants = [];

        data.forEach(element => {
          this.restaurants.push(element);
        });

        this.restaurants = this.restaurants.sort((l, r): number => {
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

}
