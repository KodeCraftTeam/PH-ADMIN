export interface ImportRowError {
  sheet: 'Unidades' | 'Personas' | 'Propietarios';
  row: number; // 0 = error transversal/de hoja, no de una fila puntual
  message: string;
}
