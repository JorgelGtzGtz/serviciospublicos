import { Pipe, PipeTransform } from '@angular/core';
import { Sector } from '../Interfaces/ISector';

@Pipe({
  name: 'sectorReporte'
})
export class SectorReportePipe implements PipeTransform {

  transform(id: number, sectores: Sector[]): string {
    let nombreSector: string;
    let encontrado: boolean;
   // Comparar el id con los sectores existentes.
    sectores.forEach(sector => {
      if (sector.ID_sector === id){
        nombreSector = sector.Descripcion_sector;
        encontrado = true;
      }
    });
 // Verificar si se encontró un sector que coincidiera.
    if (!encontrado){
      nombreSector = '-';
    }
    return nombreSector;
  }

}
