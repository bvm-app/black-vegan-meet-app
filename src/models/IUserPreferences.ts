import { DietOptions } from '../enums/DietOptions';
import { ReligionOptions } from '../enums/ReligionOptions';
import { AlcoholOptions } from '../enums/AlcoholOptions';
import { CigaretteOptions } from '../enums/CigaretteOptions';
import { DrugOptions } from '../enums/DrugOptions';
import { ChildrenOptions } from '../enums/ChildrenOptions';
import { PhysicalActivityOptions } from '../enums/PhysicalActivityOptions';

export interface IUserPreferences {
  diet?: DietOptions;
  religion?: ReligionOptions;
  alcohol?: AlcoholOptions;
  cigarette?: CigaretteOptions;
  drug?: DrugOptions;
  children?: ChildrenOptions;
  physicalActivity?: PhysicalActivityOptions;
}
