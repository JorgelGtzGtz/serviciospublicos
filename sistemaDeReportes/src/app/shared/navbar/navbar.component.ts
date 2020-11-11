import { Component, OnInit } from '@angular/core';
// declare function init_plugins();
import * as $ from 'jquery';
// import * as AdminLte from 'admin-lte';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
  }

  // Se agregan y quitan las clases del body que son afectadas por la interaccion con el boton 
  //  para esconder o mostrar el menu. Esto se hace ya que el template viene con un problema
  //  al momento de redireccionar desde un login, por ejemplo, al dashboard
  toggle(): void {
    const portalBody = $('#portalBody');
    if ( portalBody.hasClass( 'sidebar-collapse')) {
      console.log('Se abre');
      console.log('lista clases en abierto:', portalBody[0].classList);
      portalBody.removeClass('sidebar-collapse');
      portalBody.addClass('sidebar-open');
    } else {
      console.log('Se colapsa');
      console.log('lista clases en colapsado:', portalBody[0].classList);
      portalBody.addClass('sidebar-collapse'); 
    } 
  }
}
