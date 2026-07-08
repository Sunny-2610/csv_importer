import { parse } from 'csv-parse';
import { createReadStream } from 'fs';
import { ParsedCSVRow } from '../types/index.js';

export class CSVParser {
  /**
   * Parse entire CSV file
   */
  async parseFile(filePath: string): Promise<ParsedCSVRow[]> {
    return new Promise((resolve, reject) => {
      const records: ParsedCSVRow[] = [];
      
      const parser = createReadStream(filePath)
        .pipe(parse({
          columns: true,
          skip_empty_lines: true,
          trim: true,
          delimiter: ',',
          relax_quotes: true,
          relax_column_count: true
        }));

      parser.on('data', (data: ParsedCSVRow) => {
        // Clean up empty values
        const cleaned: ParsedCSVRow = {};
        for (const [key, value] of Object.entries(data)) {
          if (value !== undefined && value !== null && value !== '') {
            cleaned[key.trim()] = value.trim();
          }
        }
        if (Object.keys(cleaned).length > 0) {
          records.push(cleaned);
        }
      });

      parser.on('end', () => {
        resolve(records);
      });

      parser.on('error', (error) => {
        reject(error);
      });
    });
  }

  /**
   * Parse only first N rows for preview
   */
  async previewFile(filePath: string, limit: number = 100): Promise<ParsedCSVRow[]> {
    return new Promise((resolve, reject) => {
      const records: ParsedCSVRow[] = [];
      let rowCount = 0;
      
      const parser = createReadStream(filePath)
        .pipe(parse({
          columns: true,
          skip_empty_lines: true,
          trim: true,
          delimiter: ',',
          relax_quotes: true,
          relax_column_count: true
        }));

      parser.on('data', (data: ParsedCSVRow) => {
        if (rowCount < limit) {
          const cleaned: ParsedCSVRow = {};
          for (const [key, value] of Object.entries(data)) {
            if (value !== undefined && value !== null && value !== '') {
              cleaned[key.trim()] = value.trim();
            }
          }
          if (Object.keys(cleaned).length > 0) {
            records.push(cleaned);
            rowCount++;
          }
        }
      });

      parser.on('end', () => {
        resolve(records);
      });

      parser.on('error', (error) => {
        reject(error);
      });
    });
  }

  /**
   * Get CSV headers/columns
   */
  async getHeaders(filePath: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      let headers: string[] = [];
      
      const parser = createReadStream(filePath)
        .pipe(parse({
          columns: true,
          skip_empty_lines: true,
          trim: true,
          delimiter: ',',
          to_line: 1
        }));

      parser.on('data', (data: ParsedCSVRow) => {
        headers = Object.keys(data);
      });

      parser.on('end', () => {
        resolve(headers);
      });

      parser.on('error', (error) => {
        reject(error);
      });
    });
  }
}