import { TipoUsuario } from '../Interfaces/ITipoUsuario';

export class TipoUsuarioM implements TipoUsuario{
   
    static tipoDesdeJson(obj: Object){
        return new TipoUsuarioM(
            obj['ID_tipoUsuario'],
            obj['Descripcion_tipoUsuario'],
            obj['Estatus_tipoUsuario'],
            obj['Disponible']
        );
    }

    constructor(
        public ID_tipoUsuario: number,
        public Descripcion_tipoUsuario: string,
        public Estatus_tipoUsuario: boolean,
        public Disponible: boolean ){

    }





}