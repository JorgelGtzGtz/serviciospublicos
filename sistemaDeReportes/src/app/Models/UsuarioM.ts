import { Usuario } from '../Interfaces/IUsuario';

export class UsuarioM implements Usuario{
    
    static usuarioDesdeJson(obj: Object){
        return new UsuarioM(
            obj['ID_usuario'],
            obj['Nombre_usuario'],
            obj['Correo_usuario'],
            obj['Telefono_usuario'],
            obj['Genero_usuario'],
            obj['ID_tipoUsuario'],
            obj['Login_usuario'],
            obj['Password_usuario'],
            obj['Estatus_usuario'],
            obj['Jefe_asignado']
        );
    }

    constructor(
        public ID_usuario: number,
        public Nombre_usuario: string,
        public Correo_usuario: string,
        public Telefono_usuario: string,
        public Genero_usuario: string,
        public ID_tipoUsuario: number,
        public Login_usuario: string,
        public Password_usuario: string,
        public Estatus_usuario: boolean,
        public Jefe_asignado: boolean
                                        ) {
       }

       

}
