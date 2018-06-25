import { DietOptions } from '../enums/DietOptions';
import { ReligionOptions } from '../enums/ReligionOptions';
import { AlcoholOptions } from '../enums/AlcoholOptions';
import { CigaretteOptions } from '../enums/CigaretteOptions';
import { DrugOptions } from '../enums/DrugOptions';
import { ChildrenOptions } from '../enums/ChildrenOptions';
import { EducationOptions } from '../enums/EducationOptions';
import { IntentionOptions } from '../enums/IntentionOptions';

export interface IUserPreferences {
  diet?: DietOptions;
  religion?: ReligionOptions;
  alcohol?: AlcoholOptions;
  cigarette?: CigaretteOptions;
  drug?: DrugOptions;
  children?: ChildrenOptions;
  education?: EducationOptions;
  intentions?: IntentionOptions[];
}
