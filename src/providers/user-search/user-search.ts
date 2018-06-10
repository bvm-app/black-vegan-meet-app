import { Injectable } from '@angular/core';
import { IUser } from '../../models/IUser';
import { Subscription, ReplaySubject } from 'rxjs';
import { AngularFireDatabase } from 'angularfire2/database';
import _ from 'lodash';
import { IRefineSearchFilters } from '../../models/IRefineSearchFilters';
import firebase from 'firebase';
import moment from 'moment';
import { EnumProvider } from '../enum/enum';

/*
  Generated class for the UserSearchProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UserSearchProvider {
  currentLoggedInUserId = firebase.auth().currentUser.uid;
  dbPath: string = 'userData';

  private _users: IUser[] = [];
  private users: ReplaySubject<IUser[]>;
  private usersSubscription: Subscription;

  constructor(
    private db: AngularFireDatabase,
    public enumProvider: EnumProvider
  ) {
    console.log('Hello UserSearchProvider Provider');
    this.users = new ReplaySubject<IUser[]>(1);

    this.initUsers();
  }

  getUsers() {
    return this.users;
  }

  filterUsers(filters: IRefineSearchFilters) {
    console.log('filters:', filters);
    let users = [...this._users];

    // TODO: Geocode location

    // TODO: Browsing distance based on geocoded location

    // Gender filter
    if (filters.gender) {
      users = users.filter(user => user.gender == filters.gender);
    }

    // Age range filter
    users = users.filter(user => {
      if (!user.birthdate) return false; // No value, skip

      const userAge = moment().diff(user.birthdate, 'years');
      const condition1 = userAge >= filters.ageRange.lower;
      const condition2 = userAge <= filters.ageRange.upper;
      const isBetweenAgeRange = condition1 && condition2;
      return isBetweenAgeRange;
    });

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

    // Religion filter
    if (filters.preferenceReligion) {
      users = users.filter(
        user => user.preferences.religion == filters.preferenceReligion
      );
    }

    // Children filter
    if (filters.preferenceChildren) {
      users = users.filter(
        user => user.preferences.children == filters.preferenceChildren
      );
    }

    // Premium user filter
    if (filters.premiumSubscription) {
      users = users.filter(user => user.premiumSubscriptionExpiry);
    }

    // Online recently filter
    if (filters.onlineRecently) {
      const now = moment().unix() * 1000;
      const recentReference =
        moment(now)
          .subtract(5, 'd')
          .unix() * 1000; // 5 Days

      users = users.filter(user => user.lastActive > recentReference);
    }

    // New users filter
    if (filters.newUsers) {
      const now = moment().unix() * 1000;
      const recentReference =
        moment(now)
          .subtract(28, 'd')
          .unix() * 1000; // 28 Days

      users = users.filter(user => user.createdAt > recentReference);
    }

    // More than one photo filter
    if (filters.moreThanOnePhoto) {
      users = users.filter(user => user.images.length > 0);
    }

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

    // Intentions filter
    if (filters.preferenceIntention) {
      users = users.filter(user => {
        if (!user.preferences.intentions) return false;

        let hasIntentionPreference = false;

        for (let intention of filters.preferenceIntention) {
          let hasIntentionPreference =
            user.preferences.intentions.indexOf(intention) > -1;

          if (hasIntentionPreference) break;
        }

        return hasIntentionPreference;
      });
    }

    // Diet filter
    if (filters.preferenceDiet) {
      users = users.filter(
        user => user.preferences.diet == filters.preferenceDiet
      );
    }

    // Education filter
    if (filters.preferenceEducation) {
      users = users.filter(
        user => user.preferences.education == filters.preferenceEducation
      );
    }

    // Drug usage filter
    if (filters.preferenceDrug) {
      users = users.filter(
        user => user.preferences.drug == filters.preferenceDrug
      );
    }

    // Alcohol usage filter
    if (filters.preferenceAlcohol) {
      users = users.filter(
        user => user.preferences.alcohol == filters.preferenceAlcohol
      );
    }

    // Smoking filter
    if (filters.preferenceCigarette) {
      users = users.filter(
        user => user.preferences.cigarette == filters.preferenceCigarette
      );
    }

    return users;
  }

  private initUsers() {
    this.usersSubscription = this.db
      .list(this.dbPath)
      .valueChanges()
      .subscribe((users: IUser[]) => {
        let temp = _.filter(
          users,
          user => user.id !== this.currentLoggedInUserId
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
