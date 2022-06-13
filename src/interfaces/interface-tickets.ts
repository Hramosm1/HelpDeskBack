export interface iTicket {
  id: string;
  titulo: string;
  descripcion: string;
  prioridad: string;
  colorPrioridad: string;
  estado: string;
  activo?: boolean;
}
export interface bodyTicke {
  titulo: string;
  descripcion: string;
  prioridad: number;
  estado: number;
  categorias: number[];
  solicitudDe: string;
  asignadoA: string;
}