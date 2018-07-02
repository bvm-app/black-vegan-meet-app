import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegisterPage } from './register';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    RegisterPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(RegisterPage),
  ],
})
export class RegisterPageModule {}
