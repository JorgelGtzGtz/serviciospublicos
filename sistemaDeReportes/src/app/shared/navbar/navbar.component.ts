import { Component, OnInit } from '@angular/core';
// declare function init_plugins();
import * as $ from 'jquery';
// import * as AdminLte from 'admin-lte';
import { UsuarioService } from '../../services/usuario.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private usuarioService: UsuarioService,
              private router: Router) {
  }

  ngOnInit(): void {
  }

  // Entrada: Ninguna.
  // Salida: Vacío.
  // Descripción: Función en donde se agregan y quitan las clases del body que son afectadas
  //  por la interaccion con el boton para esconder o mostrar el menu.
  // Esto se hace ya que el template viene con un problema
  //  al momento de redireccionar desde un login, por ejemplo, al dashboard
  toggle(): void {
    const portalBody = $('#portalBody');
    if ( portalBody.hasClass( 'sidebar-collapse')) {
      portalBody.removeClass('sidebar-collapse');
      portalBody.addClass('sidebar-open');
    } else {
      portalBody.addClass('sidebar-collapse');
    }
  }

  // Entrada: Ninguna
  // Salida: vacío.
  // Descripción: Método para cerrar sesión a través del método "logOut" del servicio de usuario
  cerrarSesion(): void{
    this.usuarioService.logOut();
    this.router.navigate(['../login']);
  }
}
