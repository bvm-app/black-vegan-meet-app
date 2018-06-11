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

  getRestaurants() {
    this.restaurants = [];
    var storesRef = this.db.list('/restaurant');

    this.getRestaurantsUsingPlacesApi();

    return firebase.database().ref('/restaurant').once('value').then((res: DataSnapshot) => {
      res.forEach(item => {
        let restaurant: Restaurant = item.val();

        console.log("restaurant: ", restaurant.images);
        restaurant.image_url = (restaurant.images != undefined && restaurant.images.length > 0) ? restaurant.images[0] : undefined;

        this.geoLocationProvider.getDistanceFromCurrentLocation({
          latitude: restaurant.coordinates.latitude,
          longitude: restaurant.coordinates.longitude,
          latitudeType: 'N',
          longitudeType: 'E'
        }).then((distance) => {
          restaurant.distance = distance;
          this.addRestaurantToList(restaurant);
        });
      });
    });
  }

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
    if (this.restaurantsSubscription) this.restaurantsSubscription.unsubscribe();
  }

}
