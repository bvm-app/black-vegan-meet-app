import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RefineSearchPage } from './refine-search';

@NgModule({
  declarations: [
    RefineSearchPage,
  ],
  imports: [
    IonicPageModule.forChild(RefineSearchPage),
  ],
  entryComponents: [RefineSearchPage]
})
export class RefineSearchPageModule {}
