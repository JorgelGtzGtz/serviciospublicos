export interface Reporte{
    ID_reporte: number;
    ID_tipoReporte: number;
    Latitud_reporte: number;
    Longitud_reporte: number;
    FechaRegistro_reporte: string;
    FechaCierre_reporte: string;
    NoTickets_reporte: number;
    Estatus_reporte: number;
    ID_sector: number;
    ID_cuadrilla: number;
    TiempoEstimado_reporte: number;
    TiempoRestante_reporte: number;
    Direccion_reporte: string;
    EntreCalles_reporte: string;
    Referencia_reporte: string;
    Colonia_reporte: string;
    Poblado_reporte: string;
    Observaciones_reporte: string;
}
