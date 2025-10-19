import { FileText, Image, File, BarChart3, Folder } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export const getFileTypeIcon = (fileType: string): LucideIcon => {
  if (!fileType) return Folder;
  const ft = fileType.toLowerCase();
  if (ft.includes("pdf")) return FileText;
  if (ft.includes("image")) return Image;
  if (ft.includes("text")) return File;
  if (ft.includes("word") || ft.includes("document")) return FileText;
  if (ft.includes("spreadsheet") || ft.includes("excel")) return BarChart3;
  return Folder;
};

export const getFileSize = (size: string | number | undefined | null) : string => {
  if (size === undefined || size === null) return 'Unknown';

  // If number provided, treat as bytes
  const units = ['B','KB','MB','GB','TB'];
  let bytes: number | null = null;

  if (typeof size === 'number') {
    bytes = size;
  } else if (typeof size === 'string') {
    const s = size.trim();
    if (!s) return 'Unknown';

    // If string already contains a unit like '12.34 KB'
    const match = s.match(/^([0-9,.]+)\s*([a-zA-Z]+)?$/);
    if (match) {
      const numStr = match[1].replace(/,/g, '');
      const unit = (match[2] || '').toUpperCase();
      const parsed = Number(numStr);
      if (!Number.isNaN(parsed)) {
        if (!unit) {
          // ambiguous: assume input was bytes when integer large, else bytes too
          bytes = parsed;
        } else if (unit === 'B' || unit === 'BYTES') {
          bytes = parsed;
        } else if (unit === 'KB') {
          bytes = parsed * 1024;
        } else if (unit === 'MB') {
          bytes = parsed * 1024 * 1024;
        } else if (unit === 'GB') {
          bytes = parsed * 1024 * 1024 * 1024;
        } else if (unit === 'TB') {
          bytes = parsed * 1024 * 1024 * 1024 * 1024;
        } else {
          // try to interpret unit index
          const idx = units.indexOf(unit);
          if (idx >= 0) bytes = parsed * Math.pow(1024, idx);
          else bytes = parsed; // fallback
        }
      }
    } else {
      // not a simple number+unit; try to extract digits
      const digits = s.match(/\d+/);
      if (digits) bytes = Number(digits[0]);
    }
  }

  if (bytes === null || bytes === undefined || Number.isNaN(bytes)) return 'Unknown';

  // Choose a display unit
  let unitIndex = 0;
  let value = bytes;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value = value / 1024;
    unitIndex += 1;
  }

  // Format with up to 2 decimals, remove trailing zeros
  const formatted = value >= 100 ? Math.round(value).toString() : value.toFixed(2).replace(/\.00$/, '');
  return `${formatted} ${units[unitIndex]}`;
};

/**
 * Convert a MIME type or simple file type string into a friendly label for UI display.
 */
export const friendlyFileTypeLabel = (fileType?: string | null): string => {
  if (!fileType) return 'Unknown';
  const ft = fileType.toString().toLowerCase();

  // If it's an extension without a slash, map directly
  if (!ft.includes('/')) {
    switch(ft) {
      case 'pdf': return 'PDF';
      case 'svg': return 'SVG image';
      case 'jpg':
      case 'jpeg': return 'JPEG image';
      case 'png': return 'PNG image';
      case 'ppt':
      case 'pptx': return 'PowerPoint presentation';
      case 'doc':
      case 'docx': return 'Word document';
      case 'xls':
      case 'xlsx': return 'Spreadsheet';
      case 'txt': return 'Plain text';
      default: return ft.toUpperCase();
    }
  }

  // Exact or common mappings
  if (ft.includes('application/vnd.openxmlformats-officedocument.presentationml.presentation')) return 'PowerPoint presentation';
  if (ft.includes('application/pdf') || ft === 'pdf') return 'PDF';
  if (ft.includes('image/svg+xml') || ft === 'svg') return 'SVG image';
  if (ft.startsWith('image/')) {
    // image/png, image/jpeg, etc
    const subtype = ft.split('/')[1] || 'image';
    if (subtype.includes('jpeg') || subtype.includes('jpg')) return 'JPEG image';
    if (subtype.includes('png')) return 'PNG image';
    return `${subtype.toUpperCase()} image`;
  }
  if (ft.includes('presentationml') || ft.includes('powerpoint') || ft.includes('ppt')) return 'PowerPoint presentation';
  if (ft.includes('wordprocessingml') || ft.includes('msword') || ft.includes('word') || ft.includes('doc')) return 'Word document';
  if (ft.includes('spreadsheet') || ft.includes('excel') || ft.includes('sheet') || ft.includes('xls')) return 'Spreadsheet';
  if (ft.includes('text/plain') || ft === 'txt' || ft.includes('text')) return 'Plain text';
  if (ft.includes('json')) return 'JSON';
  if (ft.includes('octet-stream')) return 'Binary file';

  // Fallback: if the string contains a recognizable extension in its content (like .pdf, etc.)
  const extMatch = ft.match(/\.(pdf|png|jpe?g|svg|docx?|xlsx?|pptx?)$/);
  if (extMatch) {
    const ext = extMatch[1];
    switch (ext) {
      case 'pdf': return 'PDF';
      case 'png': return 'PNG image';
      case 'jpg':
      case 'jpeg': return 'JPEG image';
      case 'svg': return 'SVG image';
      case 'doc':
      case 'docx': return 'Word document';
      case 'xls':
      case 'xlsx': return 'Spreadsheet';
      case 'pptx':
      case 'ppt': return 'PowerPoint presentation';
      default: break;
    }
  }

  // Last resort: capitalize and return a cleaned up version
  return fileType.toString();
};
