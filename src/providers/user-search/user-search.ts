import { Injectable } from '@angular/core';
import { IUser } from '../../models/IUser';
import { Subscription, ReplaySubject } from 'rxjs';
import { AngularFireDatabase } from 'angularfire2/database';
import _ from 'lodash';
import { IRefineSearchFilters } from '../../models/IRefineSearchFilters';
import firebase from 'firebase';
import moment from 'moment';
import { EnumProvider } from '../enum/enum';
import { GeoLocationProvider } from '../geo-location/geo-location';
import { Coordinates } from '../../models/coordinates';
import { take, filter } from 'rxjs/operators';

/*
  Generated class for the UserSearchProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UserSearchProvider {
  dbPath: string = 'userData';

  private _users: IUser[] = [];
  private users: ReplaySubject<IUser[]>;
  private usersSubscription: Subscription;

  constructor(
    private db: AngularFireDatabase,
    private enumProvider: EnumProvider,
    private geolocationProvider: GeoLocationProvider
  ) {
    console.log('Hello UserSearchProvider Provider');
    this.users = new ReplaySubject<IUser[]>(1);

    this.initUsers();
  }

  getUsers() {
    return this.users;
  }

  async filterUsers(filters: IRefineSearchFilters) {
    console.log('filters:', filters);
    let users = [...this._users];

    let coordinatesOfLocationInput = null;
    // Geocode location
    if (filters.location.trim()) {
      console.log('getting coordinates');
      coordinatesOfLocationInput = await this.geolocationProvider
        .geocodeAddress(filters.location)
        .catch(err => {
          console.log(`Error on geocoding ${filters.location}`, err);
          return null;
        });
      console.log('retrieved coordinates:', coordinatesOfLocationInput);
    }

    // Browsing distance based on geocoded location
    if (filters.location.trim() && coordinatesOfLocationInput) {
      let maxDistance = +filters.distance;

      if (maxDistance === NaN || !maxDistance) {
        maxDistance = 1000;
      }

      users = users.filter(user => {
        if (!user.geolocation) return false;

        let distanceBetweenCoordinates = this.geolocationProvider.getDistanceBetweenCoordinates(
          coordinatesOfLocationInput,
          user.geolocation
        );

        // Convert to miles
        distanceBetweenCoordinates = this.geolocationProvider.convertKMtoMile(distanceBetweenCoordinates);
        return distanceBetweenCoordinates <= maxDistance;
      });
    }
    console.log('[location and distance] users:', users);

    // Gender filter
    if (filters.gender) {
      users = users.filter(user => user.gender == filters.gender);
    }
    console.log('[gender] users:', users);

    // Age range filter
    users = users.filter(user => {
      if (!user.birthdate) return false; // No value, skip

      const userAge = moment().diff(moment(user.birthdate), 'years');
      const condition1 = userAge >= filters.ageRange.lower;
      const condition2 = userAge <= filters.ageRange.upper;
      const isBetweenAgeRange = condition1 && condition2;
      return isBetweenAgeRange;
    });
    console.log('[age] users:', users);

    // Height range filter
    const heightRangeOptions = this.enumProvider.getHeightOptions();
    users = users.filter(user => {
      if (!user.height) return false; // No value, skip

      const userHeightIndex = _.findIndex(
        heightRangeOptions,
        height => height == user.height
      );
      const condition1 = userHeightIndex >= filters.heightRangeIndex.lower;
      const condition2 = userHeightIndex <= filters.heightRangeIndex.upper;
      const isBetweenHeightRange = condition1 && condition2;
      return isBetweenHeightRange;
    });
    console.log('[height] users:', users);

    // Religion filter
    if (filters.preferenceReligion) {
      users = users.filter(
        user => user.preferences.religion == filters.preferenceReligion
      );
    }
    console.log('[religion] users:', users);

    // Children filter
    if (filters.preferenceChildren) {
      users = users.filter(
        user => user.preferences.children == filters.preferenceChildren
      );
    }
    console.log('[children] users:', users);

    // Premium user filter
    if (filters.premiumSubscription) {
      users = users.filter(user => user.premiumSubscriptionExpiry);
    }
    console.log('[premium] users:', users);

    // Online recently filter
    if (filters.onlineRecently) {
      const now = moment().unix() * 1000;
      const recentReference =
        moment(now)
          .subtract(5, 'd')
          .unix() * 1000; // 5 Days

      users = users.filter(user => user.lastActive > recentReference);
    }
    console.log('[online recently] users:', users);

    // New users filter
    if (filters.newUsers) {
      const now = moment().unix() * 1000;
      const recentReference =
        moment(now)
          .subtract(28, 'd')
          .unix() * 1000; // 28 Days

      users = users.filter(user => user.createdAt > recentReference);
    }
    console.log('[new] users:', users);

    // More than one photo filter
    if (filters.moreThanOnePhoto) {
      users = users.filter(user => user.images.length > 0);
    }
    console.log('[more than one photo] users:', users);

    // Complete profile filter
    if (filters.completeProfile) {
      users = users.filter(user => {
        if (!user.preferences) {
          return false;
        } else {
          if (!user.preferences.alcohol) return false;
          if (!user.preferences.children) return false;
          if (!user.preferences.cigarette) return false;
          if (!user.preferences.diet) return false;
          if (!user.preferences.drug) return false;
          if (!user.preferences.education) return false;
          if (!user.preferences.intentions) return false;
          if (!user.preferences.physicalActivity) return false;
          if (!user.preferences.religion) return false;
        }

        if (!user.birthdate) return false;
        if (!user.city) return false;
        if (!user.country) return false;
        if (!user.state) return false;
        if (!user.height) return false;
        if (!user.images) return false;
        if (!user.occupation) return false;
        if (!user.relationshipStatus) return false;
      });
    }
    console.log('[complete profile] users:', users);

    // Intentions filter
    if (filters.preferenceIntention.length > 0) {
      users = users.filter(user => {
        if (user.preferences && !user.preferences.intentions) {
          return false;
        }

        let hasIntentionPreference = false;

        for (let intention of filters.preferenceIntention) {
          let hasIntentionPreference =
            user.preferences.intentions.indexOf(intention) > -1;

          if (hasIntentionPreference) break;
        }

        return hasIntentionPreference;
      });
    }
    console.log('[intentions] users:', users);

    // Diet filter
    if (filters.preferenceDiet) {
      users = users.filter(
        user => user.preferences.diet == filters.preferenceDiet
      );
    }
    console.log('[diet] users:', users);

    // Education filter
    if (filters.preferenceEducation) {
      users = users.filter(
        user => user.preferences.education == filters.preferenceEducation
      );
    }
    console.log('[education] users:', users);

    // Drug usage filter
    if (filters.preferenceDrug) {
      users = users.filter(
        user => user.preferences.drug == filters.preferenceDrug
      );
    }
    console.log('[drug] users:', users);

    // Alcohol usage filter
    if (filters.preferenceAlcohol) {
      users = users.filter(
        user => user.preferences.alcohol == filters.preferenceAlcohol
      );
    }
    console.log('[alcohol] users:', users);

    // Smoking filter
    if (filters.preferenceCigarette) {
      users = users.filter(
        user => user.preferences.cigarette == filters.preferenceCigarette
      );
    }
    console.log('[cigarette] users:', users);

    return users;
  }

  filterUsersByDistanceFromCoordinates(coordinates: Coordinates, maxDistance: number = 100) {
    return this.users.pipe(take(1)).toPromise().then(users => {
      let filteredUsers = [...users];
      filteredUsers = users.filter(user => {
        if (!user.geolocation) return false;

        let distanceBetweenCoordinates = this.geolocationProvider.getDistanceBetweenCoordinates(
          coordinates,
          user.geolocation
        );

        // Convert to miles
        distanceBetweenCoordinates = this.geolocationProvider.convertKMtoMile(distanceBetweenCoordinates);
        return distanceBetweenCoordinates <= maxDistance;
      });

      return filteredUsers;
    });
  }

  sortByDistanceFromCoordinates(coordinates: Coordinates) {
    return this.users.pipe(take(1)).toPromise().then(users => {
      let sortedUsers = [...users];
      sortedUsers = users.sort((previous, current) => {
        if (!previous.geolocation) return -1;
        if (!current.geolocation) return 1;

        let prevDistanceBetweenCoordinates = this.geolocationProvider.getDistanceBetweenCoordinates(
          coordinates,
          previous.geolocation
        );

        let currentDistanceBetweenCoordinates = this.geolocationProvider.getDistanceBetweenCoordinates(
          coordinates,
          current.geolocation
        );

        return prevDistanceBetweenCoordinates < currentDistanceBetweenCoordinates ? -1 : 1;
        // // Convert to miles
        // distanceBetweenCoordinates = this.geolocationProvider.convertKMtoMile(distanceBetweenCoordinates);
        // return distanceBetweenCoordinates <= maxDistance;
      });

      return sortedUsers;
    });
  }

  private initUsers() {
    this.usersSubscription = this.db
      .list(this.dbPath)
      .valueChanges()
      .subscribe((users: IUser[]) => {
        let temp = _.filter(
          users,
          user => user.id !== firebase.auth().currentUser.uid
        );
        temp = _.orderBy(temp, ['lastActive'], ['desc']);
        this._users = temp;
        this.notifyObservables();
      });
  }

  private notifyObservables() {
    this.users.next(this._users);
  }

  unsubscribeSubscriptions() {
    if (this.usersSubscription) this.usersSubscription.unsubscribe();
  }
}
