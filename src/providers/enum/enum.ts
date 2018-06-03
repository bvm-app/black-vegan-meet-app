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

  getGenderOptions() {
    return this.getValues(GenderOptions);
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

  private getValues(enumInstance: Object) {
    let keys = Object.keys(enumInstance);
    return keys.map(key => enumInstance[key]);
  }

}
