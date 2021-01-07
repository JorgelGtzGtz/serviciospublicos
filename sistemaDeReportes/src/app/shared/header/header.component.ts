import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Input () seccion: string;
  urlActual: any;
  saludoUsuario: string;

  constructor(private router: Router, private usuarioService: UsuarioService) { }

  ngOnInit(): void {
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

}
