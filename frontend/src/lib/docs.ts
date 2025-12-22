import { 
  FileText, Image, File, FileSpreadsheet, Folder, Video, Music, NotepadText,
  FileArchive, Code, FileJson, Database, Presentation, Palette, TextSelect, 
  Binary, Book, Mail, Lock, FileBox, Package, Briefcase, FileCode2, CaseSensitive, FileQuestion
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export const getFileTypeIcon = (fileType: string): LucideIcon => {
  if (!fileType) return File;
  
  const type = fileType.toLowerCase().trim();

  // Images
  if (type.startsWith('image/')) return Image;

  // Videos
  if (type.startsWith('video/')) return Video;

  // Audio
  if (type.startsWith('audio/')) return Music;

  // Documents - PDFs
  if (type === 'application/pdf') return FileText;

  // Documents - Word/Text
  if (
    type === 'application/msword' ||
    type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    type === 'application/vnd.oasis.opendocument.text' ||
    type === 'application/rtf' ||
    type === 'text/rtf'
  ) {
    return TextSelect;
  }

  // Plain text and markdown
  if (
    type.startsWith('text/plain') ||
    type === 'text/markdown' ||
    type === 'text/x-markdown'
  ) {
    return NotepadText;
  }

  // Spreadsheets
  if (
    type === 'application/vnd.ms-excel' ||
    type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    type === 'application/vnd.oasis.opendocument.spreadsheet' ||
    type === 'text/csv' ||
    type === 'application/csv'
  ) {
    return FileSpreadsheet;
  }

  // Presentations
  if (
    type === 'application/vnd.ms-powerpoint' ||
    type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' ||
    type === 'application/vnd.oasis.opendocument.presentation' ||
    type === 'application/vnd.apple.keynote'
  ) {
    return Presentation;
  }

  // Archives
  if (
    type === 'application/zip' ||
    type === 'application/x-zip-compressed' ||
    type === 'application/x-7z-compressed' ||
    type === 'application/x-tar' ||
    type === 'application/gzip' ||
    type === 'application/x-gzip' ||
    type === 'application/x-bzip2' ||
    type === 'application/x-xz' ||
    type === 'application/x-iso9660-image'
  ) {
    return FileArchive;
  }
  if (
    type === 'application/vnd.rar' ||
    type === 'application/x-rar-compressed'
  ) {
    return Briefcase;
  }

  // Code/Programming files
  if (
    type === 'application/javascript' ||
    type === 'application/x-javascript' ||
    type === 'text/javascript' ||
    type === 'application/typescript' ||
    type === 'text/x-python' ||
    type === 'application/x-python-code' ||
    type === 'text/x-java-source' ||
    type === 'text/x-c' ||
    type === 'text/x-c++' ||
    type === 'text/x-csharp' ||
    type === 'application/x-php' ||
    type === 'text/x-php' ||
    type === 'application/x-ruby' ||
    type === 'text/x-ruby' ||
    type === 'application/x-go' ||
    type === 'text/x-go' ||
    type === 'application/x-rust' ||
    type === 'text/x-rust' ||
    type === 'application/x-swift' ||
    type === 'text/x-swift' ||
    type === 'application/x-kotlin' ||
    type === 'text/x-kotlin'
  ) {
    return FileCode2;
  }

  // Markup/Config files
  if (
    type === 'text/html' ||
    type === 'application/xhtml+xml' ||
    type === 'text/css' ||
    type === 'text/x-scss' ||
    type === 'text/x-sass' ||
    type === 'text/x-less'
  ) {
    return Code;
  }

  // JSON/XML/YAML
  if (
    type === 'application/json' ||
    type === 'text/json' ||
    type === 'application/xml' ||
    type === 'text/xml' ||
    type === 'application/x-yaml' ||
    type === 'text/yaml' ||
    type === 'text/x-yaml'
  ) {
    return FileJson;
  }

  // Database files
  if (
    type === 'application/sql' ||
    type === 'application/x-sql' ||
    type === 'application/x-sqlite3' ||
    type === 'application/vnd.ms-access'
  ) {
    return Database;
  }

  // Design files
  if (
    type === 'image/vnd.adobe.photoshop' ||
    type === 'application/postscript' ||
    type === 'application/illustrator' ||
    type === 'application/x-sketch' ||
    type === 'application/figma'
  ) {
    return Palette;
  }

  // Executables
  if (
    type === 'application/x-msdownload' ||
    type === 'application/x-msdos-program' ||
    type === 'application/x-deb' ||
    type === 'application/x-debian-package' ||
    type === 'application/vnd.android.package-archive' ||
    type === 'application/x-apple-diskimage' ||
    type === 'application/vnd.microsoft.portable-executable'  ||
    type === 'application/x-mach-binary'||
    type === 'application/x-elf' ||
    type === 'application/x-executable' ||
    type === 'application/x-dosexec' ||
    type === 'application/x-winexe' ||
    type === 'application/x-pef' ||
    type === 'application/x-windows-installer' ||
    type === 'application/x-msi' ||
    type === 'application/x-mach-o'
  ) {
    return Package;
  }

  // Binary files
  if (
    type === 'application/octet-stream' ||
    type === 'application/x-binary'
  ) {
    return Binary;
  }

  // E-books
  if (
    type === 'application/epub+zip' ||
    type === 'application/x-mobipocket-ebook' ||
    type === 'application/vnd.amazon.ebook'
  ) {
    return Book;
  }

  // Email
  if (
    type === 'message/rfc822' ||
    type === 'application/vnd.ms-outlook' ||
    type === 'application/mbox'
  ) {
    return Mail;
  }

  // Encrypted/PGP
  if (
    type === 'application/pgp-encrypted' ||
    type === 'application/pgp-signature' ||
    type === 'application/x-pgp-encrypted'
  ) {
    return Lock;
  }

  // Fonts
  if (
    type === 'font/ttf' ||
    type === 'font/otf' ||
    type === 'font/woff' ||
    type === 'font/woff2' ||
    type === 'application/font-woff' ||
    type === 'application/x-font-ttf' ||
    type === 'application/x-font-otf'
  ) {
    return CaseSensitive;
  }

  // Broad category fallbacks
  if (type.startsWith('text/')) return File;
  if (type.startsWith('application/')) return FileBox;
  if (type.startsWith('font/')) return CaseSensitive;

  // Ultimate fallback
  return FileQuestion;
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
  const type = fileType.toLowerCase().trim();

  // ===== Images =====
  if (type.startsWith('image/')) {
    if (type.includes('jpeg') || type.includes('jpg')) return 'JPEG image';
    if (type.includes('png')) return 'PNG image';
    if (type.includes('gif')) return 'GIF image';
    if (type.includes('svg')) return 'SVG image';
    if (type.includes('webp')) return 'WebP image';
    if (type.includes('bmp')) return 'BMP image';
    if (type.includes('tiff') || type.includes('tif')) return 'TIFF image';
    if (type.includes('ico')) return 'Icon';
    if (type.includes('heic') || type.includes('heif')) return 'HEIF image';
    if (type.includes('avif')) return 'AVIF image';
    if (type.includes('photoshop')) return 'Photoshop image';
    return 'Image';
  }

  // ===== Videos =====
  if (type.startsWith('video/')) {
    if (type.includes('mp4')) return 'MP4 video';
    if (type.includes('mpeg')) return 'MPEG video';
    if (type.includes('quicktime') || type.includes('mov')) return 'QuickTime video';
    if (type.includes('x-msvideo') || type.includes('avi')) return 'AVI video';
    if (type.includes('x-matroska') || type.includes('mkv')) return 'MKV video';
    if (type.includes('webm')) return 'WebM video';
    if (type.includes('x-flv')) return 'FLV video';
    if (type.includes('3gpp')) return '3GP video';
    return 'Video';
  }

  // ===== Audio =====
  if (type.startsWith('audio/')) {
    if (type.includes('mpeg') || type.includes('mp3')) return 'MP3 audio';
    if (type.includes('wav')) return 'WAV audio';
    if (type.includes('ogg')) return 'OGG audio';
    if (type.includes('flac')) return 'FLAC audio';
    if (type.includes('aac') || type.includes('mp4')) return 'AAC audio';
    if (type.includes('webm')) return 'WebM audio';
    if (type.includes('opus')) return 'Opus audio';
    if (type.includes('x-m4a')) return 'M4A audio';
    if (type.includes('aiff')) return 'AIFF audio';
    return 'Audio file';
  }

  // ===== Documents - PDF =====
  if (type === 'application/pdf') return 'PDF document';

  // ===== Documents - Word =====
  if (
    type === 'application/msword' ||
    type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    type === 'application/vnd.oasis.opendocument.text' ||
    type === 'application/rtf' ||
    type === 'text/rtf'
  ) {
    if (type.includes('wordprocessingml') || type.includes('msword')) return 'Word document';
    if (type.includes('opendocument')) return 'OpenDocument text';
    if (type.includes('rtf')) return 'Rich text document';
    return 'Document';
  }

  // ===== Spreadsheets =====
  if (
    type === 'application/vnd.ms-excel' ||
    type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    type === 'application/vnd.oasis.opendocument.spreadsheet' ||
    type === 'text/csv' ||
    type === 'application/csv'
  ) {
    if (type.includes('spreadsheetml') || type.includes('ms-excel')) return 'Excel spreadsheet';
    if (type.includes('opendocument')) return 'OpenDocument spreadsheet';
    if (type.includes('csv')) return 'CSV file';
    return 'Spreadsheet';
  }

  // ===== Presentations =====
  if (
    type === 'application/vnd.ms-powerpoint' ||
    type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' ||
    type === 'application/vnd.oasis.opendocument.presentation' ||
    type === 'application/vnd.apple.keynote'
  ) {
    if (type.includes('presentationml') || type.includes('ms-powerpoint')) return 'PowerPoint presentation';
    if (type.includes('opendocument')) return 'OpenDocument presentation';
    if (type.includes('keynote')) return 'Keynote presentation';
    return 'Presentation';
  }

  // ===== Archives =====
  if (type === 'application/zip' || type === 'application/x-zip-compressed') {
    return 'ZIP archive';
  }
  if (type === 'application/x-rar-compressed') return 'RAR archive';
  if (type === 'application/x-7z-compressed') return '7-Zip archive';
  if (type === 'application/x-tar') return 'TAR archive';
  if (type === 'application/gzip' || type === 'application/x-gzip') return 'GZIP archive';
  if (type === 'application/x-bzip2') return 'BZIP2 archive';
  if (type === 'application/x-xz') return 'XZ archive';
  if (type === 'application/x-iso9660-image') return 'ISO disk image';

  // ===== Code/Programming =====
  if (
    type === 'application/javascript' ||
    type === 'application/x-javascript' ||
    type === 'text/javascript'
  ) {
    return 'JavaScript file';
  }
  if (type === 'application/typescript') return 'TypeScript file';
  if (type === 'text/x-python' || type === 'application/x-python-code') return 'Python file';
  if (type === 'text/x-java-source') return 'Java file';
  if (type === 'text/x-c' || type === 'text/x-c++') return 'C/C++ file';
  if (type === 'text/x-csharp') return 'C# file';
  if (type === 'application/x-php' || type === 'text/x-php') return 'PHP file';
  if (type === 'application/x-ruby' || type === 'text/x-ruby') return 'Ruby file';
  if (type === 'application/x-go' || type === 'text/x-go') return 'Go file';
  if (type === 'application/x-rust' || type === 'text/x-rust') return 'Rust file';
  if (type === 'application/x-swift' || type === 'text/x-swift') return 'Swift file';
  if (type === 'application/x-kotlin' || type === 'text/x-kotlin') return 'Kotlin file';

  // ===== Markup/Config =====
  if (type === 'text/html' || type === 'application/xhtml+xml') return 'HTML file';
  if (type === 'text/css') return 'CSS file';
  if (type === 'text/x-scss' || type === 'text/x-sass') return 'Sass/SCSS file';
  if (type === 'text/x-less') return 'Less file';

  // ===== Data formats =====
  if (type === 'application/json' || type === 'text/json') return 'JSON file';
  if (type === 'application/xml' || type === 'text/xml') return 'XML file';
  if (
    type === 'application/x-yaml' ||
    type === 'text/yaml' ||
    type === 'text/x-yaml'
  ) {
    return 'YAML file';
  }

  // ===== Database =====
  if (type === 'application/sql' || type === 'application/x-sql') return 'SQL file';
  if (type === 'application/x-sqlite3') return 'SQLite database';
  if (type === 'application/vnd.ms-access') return 'Access database';

  // ===== Executables =====
  if (
    type === 'application/x-msdownload' ||
    type === 'application/x-msdos-program'
  ) {
    return 'Executable';
  }
  if (type === 'application/x-deb' || type === 'application/x-debian-package') {
    return 'Debian package';
  }
  if (type === 'application/vnd.android.package-archive') return 'Android app';
  if (type === 'application/x-apple-diskimage') return 'Mac disk image';
  if (type === 'application/vnd.microsoft.portable-executable') return 'Windows executable';
  if  (type === 'application/x-mach-binary' || type === 'application/x-mach-o') {
    return 'Mac executable';
  }
  if (type === 'application/x-elf') return 'ELF executable';
  if (type === 'application/x-executable') return 'Executable file';
  if (type === 'application/x-dosexec' || type === 'application/x-winexe') {
    return 'Windows executable';
  }
  if (type === 'application/x-pef') return 'PowerPC executable';
  if (type === 'application/x-windows-installer' || type === 'application/x-msi') {
    return 'Windows installer';
  }

  // ===== E-books =====
  if (type === 'application/epub+zip') return 'EPUB book';
  if (type === 'application/x-mobipocket-ebook') return 'MOBI book';
  if (type === 'application/vnd.amazon.ebook') return 'Kindle book';

  // ===== Email =====
  if (type === 'message/rfc822') return 'Email message';
  if (type === 'application/vnd.ms-outlook') return 'Outlook message';
  if (type === 'application/mbox') return 'Mailbox file';

  // ===== Fonts =====
  if (
    type === 'font/ttf' ||
    type === 'application/x-font-ttf'
  ) {
    return 'TrueType font';
  }
  if (type === 'font/otf' || type === 'application/x-font-otf') return 'OpenType font';
  if (type === 'font/woff' || type === 'font/woff2' || type === 'application/font-woff') {
    return 'Web font';
  }

  // ===== Design files =====
  if (type === 'image/vnd.adobe.photoshop') return 'Photoshop file';
  if (type === 'application/postscript' || type === 'application/illustrator') {
    return 'Illustrator file';
  }

  // ===== Security =====
  if (
    type === 'application/pgp-encrypted' ||
    type === 'application/pgp-signature' ||
    type === 'application/x-pgp-encrypted'
  ) {
    return 'Encrypted file';
  }

  // ===== Plain text =====
  if (type.startsWith('text/plain') || type === 'text/markdown' || type === 'text/x-markdown') {
    return 'Text file';
  }

  // ===== Generic text =====
  if (type.startsWith('text/')) return 'Text file';

  // ===== Binary fallback =====
  if (type === 'application/octet-stream' || type === 'application/x-binary') {
    return 'Binary file';
  }

  // ===== Generic application fallback =====
  return type;
};

