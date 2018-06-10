import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import { Coordinates } from '../../models/coordinates';
import { Observable } from '@firebase/util';
import { env } from '../../app/env';

/*
  Generated class for the GeoLocationProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GeoLocationProvider {

  currentPosition;

  constructor(private http: HttpClient, private geoLocation: Geolocation) {
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

  getDistanceBetweenCoordinates(from: Coordinates, to: Coordinates) {
    let lat2 = to.latitude;
    let lon2 = to.longitude;
    let lat1 = from.latitude;
    let lon1 = from.longitude;

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

  convertKMtoMile(kilometers: number) {
    return kilometers / 1.60934;
  }

  async nearbyApi(): Promise<any> {
    this.currentPosition = await this.geoLocation.getCurrentPosition();

    return this.http.get('https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?location='
      + this.currentPosition.coords.latitude + ',' + this.currentPosition.coords.longitude +
      '&radius=5000&type=store&keyword=vegan&key=' + env.API_KEYS.GOOGLE_MAPS);
  }

  getPhoto(photoRef): any {
    return this.http.get('https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference='
     + photoRef +
     '&key=' + env.API_KEYS.GOOGLE_MAPS);
  }

  geocodeAddress(location: string) {
    return this.http.get(`https://maps.googleapis.com/maps/api/geocode/json?&address=${encodeURIComponent(location.trim())}&key=${env.API_KEYS.GOOGLE_MAPS}`).toPromise().then((data: any) => {
      if (data.status === 'OK' && data.results.length > 0) {
        const coordinates: Coordinates = {
          latitude: data.results[0].geometry.location.lat,
          longitude: data.results[0].geometry.location.lng
        };
        return coordinates;
      } else {
        return null;
      }
    });
  }
}
