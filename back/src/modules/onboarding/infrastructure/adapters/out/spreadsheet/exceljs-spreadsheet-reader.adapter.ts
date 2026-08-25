import { Injectable } from '@nestjs/common';
import { CellValue, Workbook } from 'exceljs';
import {
  ParsedImportWorkbook,
  RawSheetRow,
  SpreadsheetReaderPort,
} from '../../../../application/ports/out/spreadsheet-reader.port';
import { InvalidWorkbookStructureError } from '../../../../domain/errors/invalid-workbook-structure.error';

const REQUIRED_SHEETS = ['Unidades', 'Personas', 'Propietarios'] as const;

type CellPrimitive = string | number | boolean | Date | null;

function normalizeCellValue(value: CellValue): CellPrimitive {
  if (value === null || value === undefined) return null;
  if (value instanceof Date) return value;
  if (typeof value === 'object') {
    if ('result' in value) return normalizeCellValue(value.result);
    if ('richText' in value) {
      return (value.richText as Array<{ text: string }>)
        .map((t) => t.text)
        .join('');
    }
    if ('text' in value) {
      const text = (value as { text: unknown }).text;
      return typeof text === 'string' ? text : null;
    }
    return null;
  }
  return value;
}

function stringifyCell(value: CellPrimitive): string | null {
  if (value === null) return null;
  const text = value instanceof Date ? value.toISOString() : String(value);
  return text.trim() || null;
}

@Injectable()
export class ExceljsSpreadsheetReaderAdapter implements SpreadsheetReaderPort {
  async parseImportWorkbook(fileBuffer: Buffer): Promise<ParsedImportWorkbook> {
    const workbook = new Workbook();
    await workbook.xlsx.load(fileBuffer as unknown as ArrayBuffer);

    const missingSheets = REQUIRED_SHEETS.filter(
      (name) => !workbook.getWorksheet(name),
    );
    if (missingSheets.length > 0) {
      throw new InvalidWorkbookStructureError([...missingSheets]);
    }

    const readSheet = (name: string): RawSheetRow[] => {
      const worksheet = workbook.getWorksheet(name)!;
      const headers: Array<string | null> = [];
      worksheet
        .getRow(1)
        .eachCell({ includeEmpty: true }, (cell, colNumber) => {
          headers[colNumber] = stringifyCell(normalizeCellValue(cell.value));
        });

      const rows: RawSheetRow[] = [];
      for (let rowNumber = 2; rowNumber <= worksheet.rowCount; rowNumber++) {
        const row = worksheet.getRow(rowNumber);
        const record: RawSheetRow = {};
        let hasValue = false;
        row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
          const header = headers[colNumber];
          if (!header) return;
          const value = normalizeCellValue(cell.value);
          record[header] = value;
          if (value !== null) hasValue = true;
        });
        if (hasValue) rows.push(record);
      }
      return rows;
    };

    return {
      unidades: readSheet('Unidades'),
      personas: readSheet('Personas'),
      propietarios: readSheet('Propietarios'),
    };
  }
}
