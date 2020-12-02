import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'estadoReporte'
})

export class EstadoReporte implements PipeTransform{

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
