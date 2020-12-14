import { Imagen } from '../Interfaces/IImagen';

export class ImagenM implements Imagen{

    static imagenDesdeJson(obj: Object){
        return new ImagenM(
            obj['ID_imagen'],
            obj['Path_imagen'],
            obj['ID_reporte'],
            obj['ID_ticket'],
            obj['Tipo_imagen']
        );
    }

    constructor(
        public ID_imagen: number,
        public Path_imagen: string,
        public ID_reporte: number,
        public ID_ticket: number,
        public Tipo_imagen: number
    ){}

}