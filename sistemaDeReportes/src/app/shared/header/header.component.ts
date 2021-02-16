import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterEvent } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { filter } from 'rxjs/operators';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  seccion: string;
  saludoUsuario: string;

  constructor(private router: Router, private usuarioService: UsuarioService,
              private route: ActivatedRoute) {
                this.obtenerNombreSeccion();
               }

  ngOnInit(): void {
  }


  // Entrada: ninguna
  // Salida" Ninguna
  // Esto se usa para obtener el URL actual, ya sea que se navegue por el menu
  //  o se haga un refresh de la página. Se manda al metodo para obtener el nombre de sección
  //  para después, el header mostrarlo tanto como titulo como en el breadcrumb menu
  obtenerNombreSeccion(): void{
    this.router.events.pipe(filter((event: RouterEvent) => event instanceof NavigationEnd))
    .subscribe(() => {
      this.generarNombreSeccion(this.router.url);
    }
    );
  }

  // Entrada: string con el URL de actual
  // Salida: Ninguna
  // Descripción: asigna el nombre de la sección a mostrar según 
  // lo que indica el URL.
  generarNombreSeccion(urlActual: string): void {
    const urlArray = urlActual.split('/');
    const longitud = urlArray.length;
    const lugar = urlArray[longitud - 1];
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
      case 'tiposDeReportes':
        this.seccion = 'Tipos de reportes';
        break;
      case 'reportadorDeInformes':
        this.seccion = 'Reportador de informes';
        break;
      case 'home':
        this.seccion = 'Inicio';
        break;
      default:
        this.seccion = '';
        break;
    }
    this.verificarSeccion();
  }


  // Entrada: Ninguna
  // Salida: vacío.
  // Descripción: verifica si la sección es la de inicio para
  // mandar llamar al método que genera el saludo.
  verificarSeccion(): void{
    if (this.seccion === 'Inicio'){
      this.generarSaludoUsuario();
    }
  }

  // Entrada: Ninguna
  // Salida: vacío.
  // Descripción: Genera un saludo al usuario con un texto de saludo de acuerdo a la hora del
  // día y el nombre del usuario.
  generarSaludoUsuario(): void{
    const usuario = this.usuarioService.obtenerUsuarioLogueado();
    const saludo = this.obtenerSaludoSegunHora();
    this.saludoUsuario = '¡' + saludo + ' , ' + usuario.Nombre_usuario + '!';
  }

  // Entrada: Ninguna
  // Salida: valor tipo string.
  // Descripción: genera un saludo de acuerdo a la hora del día.
  obtenerSaludoSegunHora(): string{
    let saludo: string;
    const date: Date = new Date();
    const hora = date.getHours();
    const min = date.getMinutes();
    if (hora < 12 && min <= 59){ // Buenos días
      saludo = 'Buenos días';
    }else if ((hora >= 12 && hora < 19) && min <= 59){
      saludo = 'Buenas tardes';
    } else if ((hora >= 19 && hora <= 24) && min <= 59){
      saludo = 'Buenas noches';
    }
    return saludo;
  }

  irInicio(): void{
    this.router.navigate(['../inicio/home'], { relativeTo: this.route });
  }

}
