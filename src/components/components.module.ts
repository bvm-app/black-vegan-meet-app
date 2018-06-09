import { NgModule } from '@angular/core';
import { LoadingComponent } from './loading/loading';
import { UserCompactViewComponent } from './user-compact-view/user-compact-view';
import { CommonModule } from '@angular/common';
@NgModule({
  declarations: [
    LoadingComponent,
    UserCompactViewComponent,
  ],
  imports: [CommonModule],
  exports: [LoadingComponent, UserCompactViewComponent],
})
export class ComponentsModule {}
