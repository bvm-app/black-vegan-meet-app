import { Injectable } from '@angular/core';
import { GenderOptions } from '../../enums/GenderOptions';
import { DietOptions } from '../../enums/DietOptions';
import { ReligionOptions } from '../../enums/ReligionOptions';
import { AlcoholOptions } from '../../enums/AlcoholOptions';
import { CigaretteOptions } from '../../enums/CigaretteOptions';
import { DrugOptions } from '../../enums/DrugOptions';
import { ChildrenOptions } from '../../enums/ChildrenOptions';
import { EducationOptions } from '../../enums/EducationOptions';
import { PhysicalActivityOptions } from '../../enums/PhysicalActivityOptions';
import { RelationshipStatusOptions } from '../../enums/RelationshipStatusOptions';
import { IntentionOptions } from '../../enums/IntentionOptions';

/*
  Generated class for the EnumProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class EnumProvider {

  constructor() {
    console.log('Hello EnumProvider Provider');
  }

  private getHeightFeetAndInches(height) {
    let feet = +height.split(`'`)[0];
    let inches = +height.split(`'`)[1].slice(0, -1);

    return {
      feet: +feet,
      inches: +inches
    }
  }

  private toHeightFormat(height) {
    return `${height.feet}'${height.inches}"`
  }

  getHeightOptions() {
    let minimumHeight = `4'0"`;
    let maximumHeight = `7'0"`;
    let heightOptions = [];

    let currentHeight = this.getHeightFeetAndInches(minimumHeight);
    do {
      heightOptions.push(this.toHeightFormat(currentHeight));

      currentHeight.inches += 1;
      if (currentHeight.inches === 12) {
        currentHeight.feet += 1;
        currentHeight.inches = 0;
      }
    } while (this.toHeightFormat(currentHeight) !== maximumHeight);
    heightOptions.push(maximumHeight);

    return heightOptions;
  }

  getGenderOptions() {
    return this.getValues(GenderOptions);
  }

  getRelationshipStatusOptions() {
    return this.getValues(RelationshipStatusOptions);
  }

  getDietOptions() {
    return this.getValues(DietOptions);
  }

  getReligionOptions() {
    return this.getValues(ReligionOptions);
  }

  getAlcoholOptions() {
    return this.getValues(AlcoholOptions);
  }

  getCigaretteOptions() {
    return this.getValues(CigaretteOptions);
  }

  getDrugOptions() {
    return this.getValues(DrugOptions);
  }

  getChildrenOptions() {
    return this.getValues(ChildrenOptions);
  }

  getEducationOptions() {
    return this.getValues(EducationOptions);
  }

  getPhysicalActivityOptions() {
    return this.getValues(PhysicalActivityOptions);
  }

  getIntentionOptions() {
    return this.getValues(IntentionOptions);
  }

  private getValues(enumInstance: Object) {
    let keys = Object.keys(enumInstance);
    return keys.map(key => enumInstance[key]);
  }

}
