import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'estadoReporte'
})

export class EstadoReporte implements PipeTransform{

    // Entrada: valor tipo number.
    // Salida: valor tipo string.
    // Descripción: Función para obtener el estado de un reporte a apartir del ID
    // de ese estado.
    transform(value: number, todas: boolean = true): string{
        const estados: string [] = ['Abierto', 'Cerrado', 'Inconcluso', 'Cancelado'];
        let estadoReporte: string;

        if ( value !== null){
            const index = value - 1;
            estadoReporte = estados[index];
            return estadoReporte;
        }else{
            return '';
        }
    }
}
