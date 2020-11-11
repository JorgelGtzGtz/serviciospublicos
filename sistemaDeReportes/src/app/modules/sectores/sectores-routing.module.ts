import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SectoresComponent } from '../../pages/sectores/inicio-sectores/sectores.component';

const routes: Routes = [
  {
    path: '',
    component: SectoresComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SectoresRoutingModule { }
