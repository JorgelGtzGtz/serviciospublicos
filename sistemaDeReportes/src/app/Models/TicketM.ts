import { Ticket } from '../Interfaces/ITicket';

export class TicketM implements Ticket{
    static ticketDesdeJson(obj: Object){
        return new TicketM(
            obj['ID_ticket'],
            obj['ID_tipoReporte'],
            obj['ID_usuarioReportante'],
            obj['Estatus_ticket'],
            obj['FechaRegistro_ticket'],
            obj['FechaCierre_ticket'],
            obj['Latitud_ticket'],
            obj['Longitud_ticket'],
            obj['ID_sector'],
            obj['ID_cuadrilla'],
            obj['TiempoEstimado_ticket'],
            obj['Direccion_ticket'],
            obj['EntreCalles_ticket'],
            obj['Referencia_ticket'],
            obj['Colonia_ticket'],
            obj['Poblacion_ticket'],
            obj['EnviarCorreo_ticket'],
            obj['EnviarSMS_ticket'],
            obj['Observaciones_ticket'],
            obj['Origen'],
        );
    }

    constructor(
        public ID_ticket: number,
        public ID_tipoReporte: number,
        public ID_usuarioReportante: number,
        public Estatus_ticket: number,
        public FechaRegistro_ticket: string,
        public FechaCierre_ticket: string,
        public Latitud_ticket: number,
        public Longitud_ticket: number,
        public ID_sector: number,
        public ID_cuadrilla: number,
        public TiempoEstimado_ticket: number,
        public Direccion_ticket: string,
        public EntreCalles_ticket: string,
        public Referencia_ticket: string,
        public Colonia_ticket: string,
        public Poblacion_ticket: string,
        public EnviarCorreo_ticket: boolean,
        public EnviarSMS_ticket: boolean,
        public Observaciones_ticket: string,
        public Origen: number
    ){

    }





}
