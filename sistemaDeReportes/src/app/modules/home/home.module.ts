import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// ROUTING
import { HomeRoutingModule } from './home-routing.module';

// MODULES

// COMPONENTS
import { HomeComponent } from '../../pages/home/home.component';



@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule
  ],
  exports: [
    HomeComponent
  ]
})
export class HomeModule { }
