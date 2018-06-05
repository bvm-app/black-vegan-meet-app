import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditPhotosPage } from './edit-photos';
import { DragulaModule } from 'ng2-dragula';
import { LazyLoadImageModule } from 'ng-lazyload-image';

@NgModule({
  declarations: [
    EditPhotosPage,
  ],
  imports: [
    LazyLoadImageModule,
    DragulaModule,
    IonicPageModule.forChild(EditPhotosPage),
  ],
})
export class EditPhotosPageModule {}
