import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdminPage } from './admin';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    AdminPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(AdminPage),
  ],
})
export class AdminPageModule {}
