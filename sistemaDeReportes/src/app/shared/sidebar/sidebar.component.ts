import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from '../../services/dialog-service.service';
import { UsuarioService } from '../../services/usuario.service';
import * as $ from 'jquery';
import * as AdminLte from 'admin-lte';
import { UsuarioM } from '../../Models/UsuarioM';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  usuario: UsuarioM;

  constructor(private servicioDialog: DialogService,
              private router: Router,
              private route: ActivatedRoute,
              private usuarioService: UsuarioService) {
   }

  ngOnInit(): void {
    this.usuario = this.usuarioService.obtenerUsuarioLogueado();
  }

//  Se inicializan las vistas del template debido a que este viene con un problema al momento
//  de redireccionar de una pagina a otra, en este caso del login a inicio
  ngAfterViewInit(): void {
    $('[data-widget="treeview"]').each(function() {
      AdminLte.Treeview._jQueryInterface.call($(this), 'init');
      AdminLte.Layout._jQueryInterface.call($('body'));
      AdminLte.PushMenu._jQueryInterface.call($('[data-widget="pushmenu"]'));
    });
  }

  // Este método llama al método del servicio "DialogServiceService" en donde se analiza
  // si existen dialogs abiertos, y si se modificó información de algún formulario de estos
  // dialogs. Si se permite la navegación del ruter a la otra página o no, dependerá de las condiciones
  //  que se cumplan en el método "verificarDialogs" del servicio.
  irPagina(pagina: string){
    let navegar: boolean;
    navegar = this.servicioDialog.verificarDialogs();
    console.log('permiso para navegar en menu:', navegar);
    if (navegar){
      this.router.navigate([pagina], { relativeTo: this.route });
    }
  }
}
