export interface ParsedCSVRow {
  [key: string]: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PreviewResponse {
  success: boolean;
  rows: ParsedCSVRow[];
  total: number;
  headers: string[];
}