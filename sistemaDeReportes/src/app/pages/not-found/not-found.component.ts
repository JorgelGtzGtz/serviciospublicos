import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {Location} from '@angular/common';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent implements OnInit {
  urlActual: string;

  constructor(private location: Location, private router: Router) {
    this.obtenerLocacionActual();
  }

  ngOnInit(): void {}

  // Entrada:Ninguna.
  // Salida: Vacío.
  // Decsripción: Función que obtiene la URL Actual para ser mostrada en el componente
  obtenerLocacionActual(): void{
    this.router.events
    .subscribe((event) => {
      this.urlActual = this.location.path();
    });
  }

  // Entrada:Ninguna.
  // Salida: Vacío.
  // Decsripción: Función para redireccionar a inicio.
  redireccionarInicio(): void{
    this.router.navigate(['../inicio']);
  }

  // Entrada:Ninguna.
  // Salida: Vacío.
  // Decsripción: Función para redireccionar a Login.
  redireccionarLogin(): void{
    this.router.navigate(['../login']);
  }
}
