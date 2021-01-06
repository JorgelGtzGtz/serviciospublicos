import { Permiso } from '../Interfaces/IPermiso';

export class PermisoM implements Permiso{

    static permisoDesdeJson(obj: Object){
        return new PermisoM(
            obj['ID_permiso'],
            obj['ID_tipoUsuario'],
            obj['ID_procesoPermisos']
        );
    }

    constructor(
        public ID_permiso: number,
        public ID_tipoUsuario: number,
        public ID_procesoPermisos: number
    ){}
}
