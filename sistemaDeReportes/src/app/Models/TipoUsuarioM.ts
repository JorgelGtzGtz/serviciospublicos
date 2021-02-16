import { TipoUsuario } from '../Interfaces/ITipoUsuario';

export class TipoUsuarioM implements TipoUsuario{

    static tipoDesdeJson(tipoU: Object): TipoUsuarioM{
        let tipoUsuario: TipoUsuarioM = null;
        if (tipoU !== null){
            tipoUsuario = new TipoUsuarioM(
                tipoU['ID_tipoUsuario'],
                tipoU['Descripcion_tipoUsuario'],
                tipoU['Estatus_tipoUsuario'],
                tipoU['Disponible']
            );
        }
        return tipoUsuario;
    }

    constructor(
        public ID_tipoUsuario: number,
        public Descripcion_tipoUsuario: string,
        public Estatus_tipoUsuario: boolean,
        public Disponible: boolean ){

    }





}