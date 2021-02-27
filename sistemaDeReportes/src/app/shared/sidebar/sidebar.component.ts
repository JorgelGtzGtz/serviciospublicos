import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from '../../services/dialog-service.service';
import { UsuarioService } from '../../services/usuario.service';
import * as $ from 'jquery';
import * as AdminLte from 'admin-lte';
import { UsuarioM } from '../../Models/UsuarioM';
import { TipoUsuarioService } from '../../services/tipo-usuario.service';
import { TipoUsuario } from 'src/app/Interfaces/ITipoUsuario';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, AfterViewInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  usuario: UsuarioM;
  tipoU: TipoUsuario;
  nombreTU: string;

  constructor(private servicioDialog: DialogService,
              private router: Router,
              private route: ActivatedRoute,
              private usuarioService: UsuarioService,
              private tipoUsuarioService: TipoUsuarioService) {
   }

  ngOnInit(): void {
    this.usuario = this.usuarioService.obtenerUsuarioLogueado();
    this. obtenerTipoUsuario();

  }

  // Entrada: Ninguna.
  // Salida: Vacío.
  // Descripción: Se inicializan las vistas del template debido a que este viene con un problema al momento
  // de redireccionar de una pagina a otra, en este caso del login a inicio
  ngAfterViewInit(): void {
    $('[data-widget="treeview"]').each(function() {
      AdminLte.Treeview._jQueryInterface.call($(this), 'init');
      AdminLte.Layout._jQueryInterface.call($('body'));
      AdminLte.PushMenu._jQueryInterface.call($('[data-widget="pushmenu"]'));
    });
  }

  // Entrada: Ninguna
  // Salida: Ninguna
  // Descripción: Obtiene el tipo de Usuario del usuario.
  obtenerTipoUsuario(): void{
    this.tipoUsuarioService.obtenerTipoUsuario(this.usuario.ID_tipoUsuario)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe( tipo => {
      this.tipoU = tipo;
      this.nombreTU = tipo.Descripcion_tipoUsuario;
    }, (error: HttpErrorResponse) => {
      this.nombreTU = 'No disponible';
    });
  }

  // Entrada: valor tipo string con el nombre de la página.
  // Salida: Vacío.
  // Descripción:  Este método llama al método del servicio "DialogServiceService" en donde se analiza
  // si existen dialogs abiertos, y si se modificó información de algún formulario de estos
  // dialogs. Si se permite la navegación del ruter a la otra página o no, dependerá de las condiciones
  // que se cumplan en el método "verificarDialogs" del servicio.
  irPagina(pagina: string): void{
    let navegar: boolean;
    navegar = this.servicioDialog.verificarDialogs();
    if (navegar){
      this.router.navigate([pagina], { relativeTo: this.route });
    }
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
