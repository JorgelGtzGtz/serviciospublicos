import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// ROUTING
import { NotFoundRoutingModule } from './not-found-routing.module';

//COMPONENT
import { NotFoundComponent } from '../../pages/not-found/not-found.component';


@NgModule({
  declarations: [
    NotFoundComponent
  ],
  imports: [
    CommonModule,
    NotFoundRoutingModule
  ],
  exports: [
    NotFoundComponent
  ]
})
export class NotFoundModule { }
