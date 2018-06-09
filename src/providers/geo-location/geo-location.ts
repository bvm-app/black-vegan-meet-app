import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import { Coordinates } from '../../models/coordinates';
import { Observable } from '@firebase/util';

/*
  Generated class for the GeoLocationProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GeoLocationProvider {

  currentPosition;

  constructor(public http: HttpClient, private geoLocation: Geolocation) {
    console.log('Hello GeoLocationProvider Provider');
  }

  private toRad(number: number): number {
    return number * Math.PI / 180;
  }

  getCurrentPosition() {
    return this.geoLocation.getCurrentPosition();
  }

  // Uses Haversine Formula
  // https://stackoverflow.com/questions/14560999/using-the-haversine-formula-in-javascript
  async getDistanceFromCurrentLocation(coordinates: Coordinates): Promise<number> {
    this.currentPosition = await this.geoLocation.getCurrentPosition();

    let lat2 = coordinates.latitude;
    let lon2 = coordinates.longitude;
    let lat1 = this.currentPosition.coords.latitude;
    let lon1 = this.currentPosition.coords.longitude;

    let R = 6371; // km 
    let x1 = lat2 - lat1;
    let dLat = this.toRad(x1);
    let x2 = lon2 - lon1;
    let dLon = this.toRad(x2);
    let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c;

    return d;
  }


  async nearbyApi(): Promise<any> {
    this.currentPosition = await this.geoLocation.getCurrentPosition();

    return this.http.get('https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?location='
      + this.currentPosition.coords.latitude + ',' + this.currentPosition.coords.longitude +
      '&radius=5000&type=store&keyword=vegan&key=AIzaSyAnsLLV7D_TSP-UpC7gRayKScoz_YahpkA');
  }

  getPhoto(photoRef): any {
    return this.http.get('https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference='
     + photoRef + 
     '&key=AIzaSyAnsLLV7D_TSP-UpC7gRayKScoz_YahpkA');
  }
}
