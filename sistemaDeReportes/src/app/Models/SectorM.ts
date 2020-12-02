import { Sector } from '../Interfaces/ISector';

export class SectorM implements Sector{

    static sectorDesdeJson(obj: Object){
        return new SectorM(
            obj['ID_sector'],
            obj['Descripcion_sector'],
            obj['Estatus_sector']
        );
    }

    constructor(
        public ID_sector: number,
        public Descripcion_sector: string,
        public Estatus_sector: boolean
    ){}

}
