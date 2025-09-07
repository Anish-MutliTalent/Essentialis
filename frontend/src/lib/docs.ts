export const getFileTypeIcon = (fileType: string) => {
  if (!fileType) return "📁";
  const ft = fileType.toLowerCase();
  if (ft.includes("pdf")) return "📄";
  if (ft.includes("image")) return "🖼️";
  if (ft.includes("text")) return "📝";
  if (ft.includes("word") || ft.includes("document")) return "📄";
  if (ft.includes("spreadsheet") || ft.includes("excel")) return "📊";
  return "📁";
};

export const getFileSize = (sizeStr: string) => sizeStr || "Unknown";
