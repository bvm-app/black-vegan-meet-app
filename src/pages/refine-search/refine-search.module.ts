import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RefineSearchPage } from './refine-search';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    RefineSearchPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(RefineSearchPage),
  ],
  entryComponents: [RefineSearchPage]
})
export class RefineSearchPageModule {}
