import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'capitalizado'
})

export class CapitalizadoPipe implements PipeTransform{

// Entrada: valor tipo string y valor tipo boolean.
// Salida: valor tipo string.
// Descripción: función para capitalizar la letra inicial de una palabra de una oración.
// o capitalizar la letra inicial de cada palabra de la oración.
    transform(value: string, todas: boolean = true): string{
        value = value.toLowerCase();
        let nombres = value.split(' ');

        if (todas){
            for (let i in nombres){
                nombres[i] = nombres[i][0].toUpperCase() + nombres[i].substr(1);
            }
        }else{
            nombres[0] = nombres[0][0].toUpperCase() + nombres[0].substr(1);
        }
        return nombres.join(' ');
    }
}
