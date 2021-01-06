import { TipoReporte } from '../Interfaces/ITipoReporte';

export class TipoReporteM implements TipoReporte{

    static tipoRDesdeJson(obj: Object){
        return new TipoReporteM(
            obj['ID_tipoReporte'],
            obj['Descripcion_tipoReporte']
        );
    }

    constructor(
        public ID_tipoReporte: number,
        public Descripcion_tipoReporte: string
    ){}
}
