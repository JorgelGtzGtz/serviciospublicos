import { Cuadrilla } from '../Interfaces/ICuadrilla';

export class CuadrillaM implements Cuadrilla{

    static cuadrillaDesdeJson(obj: Object){
        return new CuadrillaM(
            obj['ID_cuadrilla'],
            obj['Nombre_cuadrilla'],
            obj['Estatus_cuadrilla'],
            obj['Tipo_cuadrilla'],
            obj['ID_JefeCuadrilla'],
            obj ['Disponible']

        );
    }

    constructor(
        public ID_cuadrilla: number,
        public Nombre_cuadrilla: string,
        public Estatus_cuadrilla: boolean,
        public Tipo_cuadrilla: number,
        public ID_JefeCuadrilla: number,
        public Disponible: boolean
    ){}
}