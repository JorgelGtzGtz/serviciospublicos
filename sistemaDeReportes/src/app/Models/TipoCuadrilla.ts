import { TipoCuadrilla } from '../Interfaces/ITipoCuadrilla';

export class TipoCuadrillaM implements TipoCuadrilla{
    static tipoCuadrillaDesdeJson(obj: Object){
        return new TipoCuadrillaM(
            obj['ID_tipoCuadrilla'],
            obj['Descripcion']
        );
    }

    constructor(
        public id: number,
        public descricpion: string
    ){}

}
