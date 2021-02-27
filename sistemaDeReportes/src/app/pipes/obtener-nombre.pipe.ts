import { Pipe, PipeTransform } from '@angular/core';
import { Usuario } from '../Interfaces/IUsuario';

@Pipe({
  name: 'obtenerNombre'
})
export class ObtenerNombrePipe implements PipeTransform {

  transform(id: number, usuarios: Usuario[]): string {
   let nombre: string;
   let encontrado: boolean;
  // Comparar el id con los usuarios existentes.
   usuarios.forEach(usuario => {
     if (usuario.ID_usuario === id){
       nombre = usuario.Nombre_usuario;
       encontrado = true;
     }
   });
// Verificar si se encontró un usuario que coincidiera.
   if (!encontrado){
     nombre = 'No asignado';
   }
   return nombre;
  }

}
