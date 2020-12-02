import { Usuario } from '../Interfaces/IUsuario';

export class UsuarioModelo implements Usuario{
    ID_usuario: number;
    Nombre_usuario: string;
    Correo_usuario: string;
    Telefono_usuario: string;
    Genero_usuario: string;
    ID_tipoUsuario: number;
    Login_usuario: string;
    Password_usuario: string;
    Estatus_usuario: boolean;
    Jefe_asignado: boolean;

    constructor(id: number, nombre: string, correo: string, telefono: string,
                genero: string, tusuario: number, username: string, password: string,
                estatus: boolean, jefeA: boolean) {
        this.ID_usuario = id;
        this.Nombre_usuario = nombre;
        this.Correo_usuario = correo;
        this.Telefono_usuario = telefono;
        this.Genero_usuario = genero;
        this.ID_tipoUsuario = tusuario;
        this.Login_usuario = username;
        this.Password_usuario = password;
        this.Estatus_usuario = estatus;
        this.Jefe_asignado = jefeA;
    }

}
