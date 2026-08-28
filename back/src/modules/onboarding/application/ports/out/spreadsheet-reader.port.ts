export type RawSheetRow = Record<string, unknown>;

export interface ParsedImportWorkbook {
  units: RawSheetRow[];
  people: RawSheetRow[];
  ownerships: RawSheetRow[];
}

export interface SpreadsheetReaderPort {
  parseImportWorkbook(fileBuffer: Buffer): Promise<ParsedImportWorkbook>;
  parseCoefficientsWorkbook(fileBuffer: Buffer): Promise<RawSheetRow[]>;
  parseBalancesWorkbook(fileBuffer: Buffer): Promise<RawSheetRow[]>;
}

export const SPREADSHEET_READER_PORT = Symbol('SpreadsheetReaderPort');
