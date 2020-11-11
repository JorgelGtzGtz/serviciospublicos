import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CuadrillasComponent } from '../../pages/cuadrillas/inicio-cuadrillas/cuadrillas.component';

const routes: Routes = [
  {
    path: '',
    component: CuadrillasComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CuadrillasRoutingModule { }
