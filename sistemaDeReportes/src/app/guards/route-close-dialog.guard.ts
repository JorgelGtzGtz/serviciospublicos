import { Injectable } from '@angular/core';
import { CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class RouteCloseDialogGuard implements CanActivateChild {
  

  constructor(private dialog: MatDialog){}

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      let permisoParaNavegar = true;
      if (this.dialog.openDialogs.length > 0){
        console.log('si hay dialog abierto');
        let respuesta= confirm('Está seguro que desea salir?');
        permisoParaNavegar = this.accionDialog(respuesta);
    } else{
        permisoParaNavegar = true;
    }
      console.log('respuesta final:', permisoParaNavegar );
      return permisoParaNavegar;
  }

  accionDialog(respuesta: boolean): boolean{
    if (respuesta){
      console.log('se mandó a cerrar el dialog');
      this.dialog.closeAll();
      return true;
    }else{
      console.log('se queda el dialog abierto');
      return false;
    }
}

}
