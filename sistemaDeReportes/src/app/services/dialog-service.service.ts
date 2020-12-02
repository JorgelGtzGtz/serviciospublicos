import { Injectable } from '@angular/core';
import { MatDialog, MatDialogState } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  modificado: boolean; // para saber si el usuario ya modificó el formulario

  constructor(private dialog: MatDialog) {
  }

  // Metodo que se llama al querer cambiar de ruta en el sidebar
  // es un metodo que llamará a otros con el fin de verificar si existen
  // dialogs abierto en los que se han hecho cambios y asi permitir al usuario
  // decidir si sigue trabajando o si se sale de la página
  // Regresa la variable permisoParaNavegar, que puede ser true o false, según
  // se cumplan las condiciones del método "verificarDialogsAbiertos()"
verificarDialogs(): boolean{
  let permisoParaNavegar: boolean;
  permisoParaNavegar = this.verificarDialogsAbiertos();
  return permisoParaNavegar;

}

// Este método verifica si existen dialogs abiertos, si los hay,
// llama al método "obtenerDialogAbierto()" para encontrar el dialog en uso.
// Después, llama al método "verificarCambios" para saber si el usuario
//  ha interactuado con el formulario y evitar que pierda datos
// Regresa la variable navegar, que puede ser true o false, según se cumpla la condición.
  verificarDialogsAbiertos(): boolean{
    let navegar: boolean;
    let dialogAbierto;
    if (this.dialog.openDialogs.length > 0){
      dialogAbierto = this.obtenerDialogAbierto();
      navegar = this.verificarCambios(dialogAbierto);
    }else{
      navegar = true;
    }
    console.log('permiso para cambiar ruta:', navegar);
    return navegar;
  }

  // Método que permite obtener el dialog que se encuentra abierto actualmente.
  // No recibe parámetros, devuelve el MatDialogRef del dialog cuyo estado sea "OPEN"
  obtenerDialogAbierto(): any{
    for (let d of this.dialog.openDialogs) {
      if (d.getState() === MatDialogState.OPEN ){
        console.log('dialog abierto:', d);
        return d;
      }
    }
  }

  // Este método verifica si la variable "modificado" que existe en el componente del dialog
  //  es true o false; si es true, manda a llamar el método "mostrarMensajeConfirmacion"
  //  para permitir que el usuario decida si quiere salir de la página actual con el dialog abierto
  //  o cambiar de página, aunque esto implique que el dialog se cierra sin guardar cambios.
  // Recibe un MatDialogRef y regresa el boolean "navegar" el cual puede ser true o false.
  verificarCambios(dialogAbierto: any): boolean{
    let navegar: boolean;
    let d;
    d = dialogAbierto.componentInstance; // Con esto se accede al componente del dialog
    console.log('component Instance:', d);
    if (d.obtenerEstadoFormulario()){
        navegar = this.mostrarMensajeConfirmacion(dialogAbierto);
      }else{
        dialogAbierto.close();
        navegar =  true;
      }
    return navegar;
  }

  // Este método lanza un mensaje al usuario, si éste modificó el formulario que contiene el dialog
  //  en este mensaje se le pide confirme su decisión de salir. Al ser una respuesta true, los 
  // dialogs abiertos se cierra y regresa un true. Al ser false, los dialogs se quedan abiertos
  //  y regresa un false;
  // Recibe un MatDialogRef y devuelve un true o false según la respuesta del usuario
  mostrarMensajeConfirmacion(d: any): boolean{
    let respuesta = confirm('¿Está seguro que desea salir?');
    if (respuesta){
      console.log('se mandó a cerrar el dialog', d);
      d.close();
      return true;
    }else{
      console.log('se queda el dialog abierto');
      return false;
    }

  }
}
