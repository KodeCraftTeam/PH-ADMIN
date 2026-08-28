export interface CoefficientImportRowError {
  sheet: 'Coeficientes';
  row: number; // 0 = error transversal/de hoja, no de una fila puntual
  message: string;
}
