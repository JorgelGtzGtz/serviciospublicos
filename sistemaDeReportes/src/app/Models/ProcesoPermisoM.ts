import { ProcesoPermiso } from '../Interfaces/IProcesoPermiso';

export class ProcesoPermisoM implements ProcesoPermiso{

    static procesoPDesdeJson(obj: Object){
        return new ProcesoPermisoM(
            obj['ID_ProcesosPermiso'],
            obj['Descripcion_ProcesoPermiso']
        );
    }

    constructor(
        public ID_ProcesosPermiso: number,
        public Descripcion_procesoPermiso: string
    ){}


}
