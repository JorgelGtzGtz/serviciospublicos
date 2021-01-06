export interface Ticket{
    ID_ticket: number;
    ID_tipoReporte: number;
    ID_usuarioReportante: number;
    Estatus_ticket: number;
    FechaRegistro_ticket: string;
    FechaCierre_ticket: string;
    Latitud_ticket: number;
    Longitud_ticket: number;
    ID_sector: number;
    ID_cuadrilla: number;
    TiempoEstimado_ticket: number;
    Direccion_ticket: string;
    EntreCalles_ticket: string;
    Referencia_ticket: string;
    Colonia_ticket: string;
    Poblacion_ticket: string;
    EnviarCorreo_ticket: boolean;
    EnviarSMS_ticket: boolean;
    Observaciones_ticket: string;
    Origen: number;
}
