import { Injectable } from '@angular/core';
import { EnumProvider } from '../enum/enum';
import { IRefineSearchFilters } from '../../models/IRefineSearchFilters';
import { IUser } from '../../models/IUser';
import { UserProvider } from '../user/user';
import { GenderOptions } from '../../enums/GenderOptions';

/*
  Generated class for the RefineSearchProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

class RefineSearchFilters implements IRefineSearchFilters {
  // Basic Search
  city;
  state;
  country;
  location;
  distance;
  gender;
  ageRange;

  // Premium Search
  heightRangeIndex;
  preferenceReligion;
  preferenceChildren;
  premiumSubscription;
  onlineRecently;
  newUsers;
  moreThanOnePhoto;
  completeProfile;
  preferenceIntention;
  preferenceDiet;
  preferenceEducation;
  preferenceDrug;
  preferenceAlcohol;
  preferenceCigarette;

  constructor(heightOptions: string[]) {
    // Init Basic Search values
    this.distance = 130;
    this.gender = GenderOptions.Male;
    this.ageRange = {
      lower: 30,
      upper: 50
    };

    // Init Premium Search values
    this.heightRangeIndex = {
      lower: 0,
      upper: heightOptions.length - 1
    };
    this.premiumSubscription = false;
    this.onlineRecently = false;
    this.newUsers = false;
    this.moreThanOnePhoto = false;
    this.completeProfile = false;

    this.preferenceReligion = '';
    this.preferenceChildren = '';
    this.preferenceIntention = [];
    this.preferenceDiet = '';
    this.preferenceEducation = '';
    this.preferenceDrug = '';
    this.preferenceAlcohol = '';
    this.preferenceCigarette = '';
  }
}

@Injectable()
export class RefineSearchProvider {
  filters: RefineSearchFilters;
  constructor(
    private enumProvider: EnumProvider,
    private userProvider: UserProvider
  ) {
    console.log('Hello RefineSearchProvider Provider');
    this.filters = new RefineSearchFilters(this.enumProvider.getHeightOptions());
    this.userProvider.getCurrentUser().subscribe(user => {
      this.filters.city = user.city || '';
      this.filters.state = user.state || '';
      this.filters.country = user.country || '';
      this.filters.location = this.userProvider.formatAddress(user) || '';
    });
  }

  getFilters() {
    return this.filters;
  }
}
