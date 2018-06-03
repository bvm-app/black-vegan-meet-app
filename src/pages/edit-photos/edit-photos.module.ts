import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditPhotosPage } from './edit-photos';

@NgModule({
  declarations: [
    EditPhotosPage,
  ],
  imports: [
    IonicPageModule.forChild(EditPhotosPage),
  ],
})
export class EditPhotosPageModule {}
