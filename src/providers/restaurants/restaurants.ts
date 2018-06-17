import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { Restaurant } from '../../models/restaurant';
import { Subscription, Subject } from 'rxjs';
import { GeoLocationProvider } from '../geo-location/geo-location';
import { AngularFireDatabase } from 'angularfire2/database';
import { DataSnapshot } from 'angularfire2/database/interfaces';
import { env } from '../../app/env';
import { MapSearchParameters } from '../../models/map-search-parameters';

/*
  Generated class for the RestaurantsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class RestaurantsProvider {

  restaurants: Restaurant[] = [];
  restaurantsSubscription: Subscription;
  restaurantsSubject: Subject<Restaurant[]> = new Subject();

  constructor(public http: HttpClient, private db: AngularFireDatabase,
    private geoLocationProvider: GeoLocationProvider) {
  }

  add(restaurant: Restaurant) {
    return new Promise(resolve => {
      let id = this.db.list('/restaurant').push(restaurant).key;
      this.db.object(`/restaurant/${id}`).update({
        id: id
      });

      resolve(id);
    });
  }

  update(restaurant: Restaurant) {
    console.log("UPDATED STORE: ", restaurant);
    return new Promise(resolve => {
      resolve(this.db.object(`/restaurant/${restaurant.id}`).update(restaurant));
    });
  }

  delete(restaurant: Restaurant) {
    return new Promise(resolve => {
      resolve(this.db.object(`/restaurant/${restaurant.id}`).remove());
    });
  }


  getRestaurants() {
    this.restaurants = [];

    this.getRestaurantsUsingPlacesApi();

    return new Promise(resolve => {
      firebase.database().ref('/restaurant').once('value').then((res: DataSnapshot) => {
        var idx = 0;
        let resArray = this.snapshotToArray(res);
        console.log("RES", resArray);
        resArray.forEach((item, idx) => {
          let restaurant: Restaurant = item;

          restaurant.image_url = (restaurant.images != undefined && restaurant.images.length > 0) ? restaurant.images[0] : undefined;
          restaurant.isAppRestaurant = true;

          this.geoLocationProvider.getDistanceFromCurrentLocation({
            latitude: restaurant.coordinates.latitude,
            longitude: restaurant.coordinates.longitude,
            latitudeType: 'N',
            longitudeType: 'E'
          }).then((distance) => {
            restaurant.distance = distance;
            this.addRestaurantToList(restaurant);
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

  private addRestaurantToList(restaurant: Restaurant) {
    this.restaurants.push(restaurant);

    this.restaurants = this.restaurants.sort((l, r): number => {
      if (l.distance < r.distance) return -1;
      if (l.distance > r.distance) return 1;
      return 0
    });

    this.restaurantsSubject.next(this.restaurants);
  }

  getRestaurantsUsingPlacesApi() {
    let searchParmas = new MapSearchParameters();
    searchParmas.radius = 5000;
    searchParmas.keyword = "vegan";
    searchParmas.type = "restaurant";

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

            this.addRestaurantToList({
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
              isAppRestaurant: false
            });
          }).catch(() => {
            // this.navCtrl.pop();
          });
        });
      });
    });
  }


  unsubscribeSubscriptions() {
    if (this.restaurantsSubscription) this.restaurantsSubscription.unsubscribe();
  }

}
