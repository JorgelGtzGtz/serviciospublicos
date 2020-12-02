import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';
import { NavigationStart, Router, RouterEvent } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { tap, filter } from 'rxjs/operators';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from 'src/app/Interfaces/IUsuario';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.css',]
})
export class PagesComponent implements OnInit {
  seccion: string;

  constructor(private location: Location, private router: Router, private matDialog: MatDialog,
              private usuarioService: UsuarioService ) {
    this.obtenerNombreSeccion();
    // this.cerrarDialogsAbiertos();
  }

  ngOnInit(): void {
  }

  // Esto se usa para obtener el URL actual, ya sea que se navegue por el menu
  //  o se haga un refresh de la página. Se manda al metodo para obtener el nombre de sección
  //  para después, el header mostrarlo tanto como titulo como en el breadcrumb menu
  obtenerNombreSeccion(): void{
    this.router.events
    .subscribe((event) => {
      this.generarNombreSeccion(this.location.path());
    });
  }

// Este método cierra los Dialogs abiertos, si se selecciona otra opción del side menu.
  cerrarDialogsAbiertos(): void{
    // Cierra cualquier dialog abierto cuando la ruta cambia
    this.router.events.pipe(filter((event: RouterEvent) => event instanceof NavigationStart), tap(() => this.matDialog.closeAll())
    ).subscribe();
  }

  generarNombreSeccion(urlActual: string): void {
    let urlArray = urlActual.split('/');
    let longitud = urlArray.length;
    let lugar = urlArray[longitud - 1];
    switch (lugar) {
      case 'tiposDeUsuarios':
        this.seccion = 'Tipos de usuarios';
        break;
      case 'usuarios':
        this.seccion = 'Usuarios';
        break;
      case 'cuadrillas':
        this.seccion = 'Cuadrillas';
        break;
      case 'sector':
        this.seccion = 'Sectores';
        break;
      case 'altaDeReportes':
        this.seccion = 'Alta de reportes';
        break;
      case 'asignacionDeTickets':
        this.seccion = 'Asignación de tickets a cuadrillas';
        break;
      case 'cierreDeReportes':
        this.seccion = 'Cierre de reportes';
        break;
      default:
        this.seccion = '';
        break;
    }
  }



}
