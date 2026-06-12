export interface IngresoEgresoData {
  descripcion?: string | null;
  monto?: number | null;
  tipo?: string | null;
  id?: string;
}

export class IngresoEgreso {
  descripcion: string;
  monto: number;
  tipo: string;
  id?: string;

  constructor(obj?: IngresoEgresoData | null) {
    this.descripcion = obj?.descripcion ?? '';
    this.monto = obj?.monto ?? 0;
    this.tipo = obj?.tipo ?? '';
    this.id = obj?.id;
  }
}
