import { execFile } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const execFileAsync = promisify(execFile);

// Candidate Tesseract binary paths on Windows & Linux
const TESSERACT_CANDIDATE_PATHS = [
  process.env.TESSERACT_PATH,
  'C:\\Program Files\\Tesseract-OCR\\tesseract.exe',
  'C:\\Program Files (x86)\\Tesseract-OCR\\tesseract.exe',
  'tesseract',
].filter(Boolean);

let cachedTesseractPath = null;

export async function getTesseractPath() {
  if (cachedTesseractPath) return cachedTesseractPath;

  for (const candidate of TESSERACT_CANDIDATE_PATHS) {
    try {
      if (candidate === 'tesseract') {
        await execFileAsync('tesseract', ['--version']);
        cachedTesseractPath = 'tesseract';
        return cachedTesseractPath;
      }
      if (fs.existsSync(candidate)) {
        await execFileAsync(candidate, ['--version']);
        cachedTesseractPath = candidate;
        return cachedTesseractPath;
      }
    } catch {
      // Continue to next candidate
    }
  }

  // Default fallback
  cachedTesseractPath = 'C:\\Program Files\\Tesseract-OCR\\tesseract.exe';
  return cachedTesseractPath;
}

/**
 * Extract text from an image file using local Tesseract OCR
 */
export async function extractTextFromImage(imagePath) {
  const startTime = Date.now();
  const tesseractPath = await getTesseractPath();

  try {
    const { stdout } = await execFileAsync(tesseractPath, [
      imagePath,
      'stdout',
      '-l', 'eng',
      '--oem', '1',
      '--psm', '3',
    ], {
      timeout: 30000,
      maxBuffer: 10 * 1024 * 1024,
    });

    const durationMs = Date.now() - startTime;
    return {
      text: stdout.trim(),
      engine: `Tesseract OCR (${path.basename(tesseractPath)})`,
      success: true,
      durationMs,
    };
  } catch (error) {
    console.error('Tesseract OCR error:', error);
    return {
      text: '',
      engine: 'Tesseract OCR',
      success: false,
      error: error.message,
      durationMs: Date.now() - startTime,
    };
  }
}

/**
 * Extract text from a PDF file using pdf-parse
 */
export async function extractTextFromPdf(pdfPath) {
  const startTime = Date.now();
  try {
    const dataBuffer = fs.readFileSync(pdfPath);
    const pdfParseModule = await import('pdf-parse');
    const pdfParse = pdfParseModule.default || pdfParseModule;
    
    const data = await pdfParse(dataBuffer);
    const text = (data.text || '').trim();
    const durationMs = Date.now() - startTime;

    // If PDF has readable digital text
    if (text.length > 20) {
      return {
        text,
        engine: `PDF Text Stream Parser (${data.numpages || 1} page${data.numpages > 1 ? 's' : ''})`,
        success: true,
        durationMs,
        pageCount: data.numpages,
      };
    }

    // If PDF is a scanned image with no embedded text, fallback to tesseract if supported
    return {
      text,
      engine: 'PDF Parser',
      success: text.length > 0,
      durationMs,
      pageCount: data.numpages,
      warning: text.length === 0 ? 'Scanned PDF contains no digital text stream.' : null,
    };
  } catch (error) {
    console.error('PDF Parse error:', error);
    return {
      text: '',
      engine: 'PDF Parser',
      success: false,
      error: error.message,
      durationMs: Date.now() - startTime,
    };
  }
}

/**
 * Unified text extraction dispatcher for images and PDFs
 */
export async function extractTextFromFile(filePath, mimeType) {
  const ext = path.extname(filePath).toLowerCase();
  const isPdf = mimeType === 'application/pdf' || ext === '.pdf';

  if (isPdf) {
    return extractTextFromPdf(filePath);
  }

  // Treat everything else as an image (png, jpg, jpeg, webp, tiff, bmp)
  return extractTextFromImage(filePath);
}
