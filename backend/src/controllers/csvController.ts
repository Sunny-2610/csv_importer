import { Request, Response } from 'express';
import { CSVParser } from '../services/csvParser.js';
import fs from 'fs/promises';

const parser = new CSVParser();

export class CSVController {
  /**
   * Preview CSV file - returns first 100 rows
   */
  async preview(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({ 
          success: false, 
          error: 'No file uploaded' 
        });
      }

      // Get file path
      const filePath = req.file.path;
      
      // Parse preview data
      const previewData = await parser.previewFile(filePath, 100);
      
      // Get headers
      const headers = previewData.length > 0 
        ? Object.keys(previewData[0]) 
        : [];
      
      // Clean up temp file
      await fs.unlink(filePath).catch(() => {
        // Ignore if file doesn't exist
      });

      res.json({
        success: true,
        rows: previewData,
        total: previewData.length,
        headers: headers
      });
    } catch (error) {
      console.error('Preview error:', error);
      
      // Clean up file if it exists
      if (req.file?.path) {
        await fs.unlink(req.file.path).catch(() => {});
      }
      
      res.status(500).json({ 
        success: false, 
        error: 'Failed to parse CSV: ' + (error as Error).message 
      });
    }
  }

  /**
   * Process entire CSV file (will be expanded in Stage 3)
   */
  async process(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({ 
          success: false, 
          error: 'No file uploaded' 
        });
      }

      // For now, just return the preview
      const filePath = req.file.path;
      const data = await parser.parseFile(filePath);
      
      // Clean up temp file
      await fs.unlink(filePath).catch(() => {});

      res.json({
        success: true,
        message: 'CSV processed successfully',
        totalRows: data.length,
        preview: data.slice(0, 5) // Return first 5 rows as preview
      });
    } catch (error) {
      console.error('Process error:', error);
      
      if (req.file?.path) {
        await fs.unlink(req.file.path).catch(() => {});
      }
      
      res.status(500).json({ 
        success: false, 
        error: 'Failed to process CSV: ' + (error as Error).message 
      });
    }
  }
}