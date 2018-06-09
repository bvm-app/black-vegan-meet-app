import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import firebase from 'firebase';
import { GroceryStore } from '../../models/grocery-store';
import { AngularFireDatabase } from 'angularfire2/database';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs';
import { DataSnapshot } from 'angularfire2/database/interfaces';
import { GeoLocationProvider } from '../geo-location/geo-location';

/*
  Generated class for the GroceryStoresProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GroceryStoresProvider {
  groceryStores: GroceryStore[] = [];

  groceryStoresSubscription: Subscription;

  groceryStoresSubject: Subject<GroceryStore[]> = new Subject();

  constructor(private db: AngularFireDatabase, private geoLocationProvider: GeoLocationProvider) {
  }

  add(groceryStore: GroceryStore) {
    // return this.db.list('/groceryStore').push(groceryStore);

    let id = this.db.list('/groceryStore').push(groceryStore).key;
    return this.db.object(`/groceryStore/${id}`).update({
      id: id
    });
  }

  getGroceryStores() {
    this.groceryStores = [];
    var storesRef = this.db.list('/groceryStore');

    this.getStoresUsingPlacesApi();

    return firebase.database().ref('/groceryStore').once('value').then((res: DataSnapshot) => {
      res.forEach(item => {
        let store: GroceryStore = item.val();

        this.geoLocationProvider.getDistanceFromCurrentLocation({
          latitude: store.coordinates.latitude,
          longitude: store.coordinates.longitude,
          latitudeType: 'N',
          longitudeType: 'E'
        }).then((distance) => {
          store.distance = distance;
          this.addStoreToList(store);
        });
      });
    });
  }

  private addStoreToList(store: GroceryStore) {
    this.groceryStores.push(store);

    this.groceryStores = this.groceryStores.sort((l, r): number => {
      if (l.distance < r.distance) return -1;
      if (l.distance > r.distance) return 1;
      return 0
    });

    this.groceryStoresSubject.next(this.groceryStores);
  }

  getStoresUsingPlacesApi() {
    this.geoLocationProvider.nearbyApi().then((res) => {
      res.subscribe(data => {
        data.results.forEach(element => {
          let imageUrl = undefined;

          this.geoLocationProvider.getDistanceFromCurrentLocation({
            latitude: element.geometry.location.lat,
            longitude: element.geometry.location.lng,
            latitudeType: 'N',
            longitudeType: 'E'
          }).then((distance) => {
            if (element.photos) {
              imageUrl = 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference='
                + element.photos[0].photo_reference +
                '&key=AIzaSyAnsLLV7D_TSP-UpC7gRayKScoz_YahpkA';
            }

            this.addStoreToList({
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
          }).catch(() => {
            // this.navCtrl.pop();
          });
        });
      });
    });
  }


  unsubscribeSubscriptions() {
    if (this.groceryStoresSubscription) this.groceryStoresSubscription.unsubscribe();
  }

}
