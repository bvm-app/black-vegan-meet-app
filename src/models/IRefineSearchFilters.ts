import { GenderOptions } from "../enums/GenderOptions";
import { ReligionOptions } from "../enums/ReligionOptions";
import { ChildrenOptions } from "../enums/ChildrenOptions";
import { DietOptions } from "../enums/DietOptions";
import { EducationOptions } from "../enums/EducationOptions";
import { DrugOptions } from "../enums/DrugOptions";
import { AlcoholOptions } from "../enums/AlcoholOptions";
import { CigaretteOptions } from "../enums/CigaretteOptions";
import { IntentionOptions } from "../enums/IntentionOptions";
import { RelationshipStatusOptions } from "../enums/RelationshipStatusOptions";

interface ionicRangeSlider {
  lower: number;
  upper: number;
}

export interface IRefineSearchFilters {
  // Basic Search
  city: string;
  state: string;
  country: string;
  location: string;

  distance: number;
  gender: GenderOptions | string;
  ageRange: ionicRangeSlider;

  // Premium Search
  heightRangeIndex: ionicRangeSlider;
  preferenceReligion?: ReligionOptions;
  preferenceChildren?: ChildrenOptions;
  premiumSubscription: boolean;
  onlineRecently: boolean;
  newUsers: boolean;
  moreThanOnePhoto: boolean;
  completeProfile: boolean;
  preferenceRelationshipStatus?: RelationshipStatusOptions;
  preferenceIntention?: IntentionOptions[];
  preferenceDiet?: DietOptions;
  preferenceEducation?: EducationOptions;
  preferenceDrug?: DrugOptions;
  preferenceAlcohol?: AlcoholOptions;
  preferenceCigarette?: CigaretteOptions;
}
