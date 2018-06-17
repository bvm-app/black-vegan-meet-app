import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { GroceryStore } from '../../models/grocery-store';
import { AngularFireDatabase } from 'angularfire2/database';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs';
import { DataSnapshot } from 'angularfire2/database/interfaces';
import { GeoLocationProvider } from '../geo-location/geo-location';
import { env } from '../../app/env';
import { MapSearchParameters } from '../../models/map-search-parameters';

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
    return new Promise(resolve => {
      let id = this.db.list('/groceryStore').push(groceryStore).key;
      this.db.object(`/groceryStore/${id}`).update({
        id: id
      });

      resolve(id);
    });
  }

  update(groceryStore: GroceryStore) {
    console.log("UPDATED STORE: ", groceryStore);
    return new Promise(resolve => {
      resolve(this.db.object(`/groceryStore/${groceryStore.id}`).update(groceryStore));
    });
  }

  delete(groceryStore: GroceryStore) {
    return new Promise(resolve => {
      resolve(this.db.object(`/groceryStore/${groceryStore.id}`).remove());
    });
  }

  getGroceryStores() {
    this.groceryStores = [];

    this.getStoresUsingPlacesApi();

    return new Promise(resolve => {
      firebase.database().ref('/groceryStore').once('value').then((res: DataSnapshot) => {
        var idx = 0;
        let resArray = this.snapshotToArray(res);
        console.log("RES", resArray);
        resArray.forEach((item, idx) => {
          let store: GroceryStore = item;

          store.image_url = (store.images != undefined && store.images.length > 0) ? store.images[0] : undefined;
          store.isAppStore = true;

          this.geoLocationProvider.getDistanceFromCurrentLocation({
            latitude: store.coordinates.latitude,
            longitude: store.coordinates.longitude,
            latitudeType: 'N',
            longitudeType: 'E'
          }).then((distance) => {
            store.distance = distance;
            this.addStoreToList(store);
            resolve({ Result: "Finished" });
          });
        });
      });
    });
  }

  private snapshotToArray(snapshot) {
    var returnArr = [];

    snapshot.forEach(function (childSnapshot) {
      var item = childSnapshot.val();
      item.key = childSnapshot.key;

      returnArr.push(item);
    });

    return returnArr;
  };

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
    let searchParmas = new MapSearchParameters();
    searchParmas.radius = 5000;
    searchParmas.keyword = "vegan";
    searchParmas.type = "store";

    this.geoLocationProvider.nearbyApi(searchParmas).then((res) => {
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
                '&key=' + env.API_KEYS.GOOGLE_MAPS;
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
              images: [imageUrl],
              distance: distance,
              isAppStore: false
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
