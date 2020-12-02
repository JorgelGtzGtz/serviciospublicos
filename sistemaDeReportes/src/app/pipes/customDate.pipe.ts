import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'customDate'
})

export class CustomDate implements PipeTransform{

    transform(value: string, todas: boolean = true): string{
        if ( value !== null){
            // Se separa la fecha de la hora
            const dateTime = value.split('T');
            // se obtiene la parte que tiene la fecha y se separan sus valores
            const fechaAux: string = dateTime[0];
            const fecha = fechaAux.split('-');
            const year = fecha[0];
            const month = fecha[1];
            const day = fecha [2];
            const nuevaFecha = day + '-' + month + '-' + year;
            return nuevaFecha;

        }
    }
}
