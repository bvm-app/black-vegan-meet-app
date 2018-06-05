import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import firebase from 'firebase';
import { GroceryStore } from '../../models/grocery-store';

/*
  Generated class for the GroceryStoresProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GroceryStoresProvider {
  groceryStores: GroceryStore[] = [];

  constructor() {
    this.groceryStores.push({
      id: '1',
      name: 'first store',
      image_url: null,
      coordinates: {
        latitude: 40.741895,
        latitudeType: "N",
        longitude: -73.989308,
        longitudeType: "E"
      }
    });

    this.groceryStores.push({
      id: '2',
      name: 'second one',
      image_url: null,
      coordinates: {
        latitude: 40.741895,
        latitudeType: "N",
        longitude: -78.989308,
        longitudeType: "E"
      }
    });
  }

  add(groceryStore: GroceryStore) {
    // this.groceryStores.push(groceryStore);
    var storesRef = firebase.database().ref('/groceryStore');
    return storesRef.push(groceryStore, (err) => {
      console.log(err);
    });
  }

  getGroceryStores(amount: number): GroceryStore[] {
    return this.groceryStores;
  }

}
