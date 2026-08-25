export type RawSheetRow = Record<string, unknown>;

export interface ParsedImportWorkbook {
  unidades: RawSheetRow[];
  personas: RawSheetRow[];
  propietarios: RawSheetRow[];
}

export interface SpreadsheetReaderPort {
  parseImportWorkbook(fileBuffer: Buffer): Promise<ParsedImportWorkbook>;
}

export const SPREADSHEET_READER_PORT = Symbol('SpreadsheetReaderPort');
