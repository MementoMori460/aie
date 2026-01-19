import { spawn } from "child_process";
import { writeFile, unlink } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";
import { randomBytes } from "crypto";

interface EvaluationData {
  paperTitle: string;
  paperAuthors?: string;
  paperDoi?: string;
  paperYear?: number;
  paperJournal?: string;
  paperAbstract?: string;
  scoreD1?: string;
  scoreD2?: string;
  scoreD3?: string;
  scoreD4?: string;
  scoreHIS?: string;
  indicators: Array<{
    code: string;
    value: number;
  }>;
}

/**
 * Generate Excel file for evaluation results
 */
export async function generateExcelReport(data: EvaluationData): Promise<Buffer> {
  // Create Python script to generate Excel
  const pythonScript = `
import openpyxl
from openpyxl.styles import Font, Alignment, PatternFill, Border, Side
from openpyxl.utils import get_column_letter
import json
import sys

# Read data from stdin
data = json.loads(sys.stdin.read())

# Create workbook
wb = openpyxl.Workbook()

# Remove default sheet
wb.remove(wb.active)

# === Sheet 1: Makale Bilgileri ===
ws_info = wb.create_sheet("Makale Bilgileri")

# Header style
header_fill = PatternFill(start_color="4472C4", end_color="4472C4", fill_type="solid")
header_font = Font(bold=True, color="FFFFFF", size=12)
header_alignment = Alignment(horizontal="center", vertical="center")

# Border
thin_border = Border(
    left=Side(style='thin'),
    right=Side(style='thin'),
    top=Side(style='thin'),
    bottom=Side(style='thin')
)

# Title
ws_info['A1'] = 'Akademik Makale Etki Değerlendirmesi Raporu'
ws_info['A1'].font = Font(bold=True, size=16)
ws_info.merge_cells('A1:B1')

# Paper info
info_data = [
    ['Makale Başlığı', data.get('paperTitle', '')],
    ['Yazarlar', data.get('paperAuthors', '')],
    ['DOI', data.get('paperDoi', '')],
    ['Yayın Yılı', str(data.get('paperYear', ''))],
    ['Dergi/Konferans', data.get('paperJournal', '')],
]

row = 3
for label, value in info_data:
    ws_info[f'A{row}'] = label
    ws_info[f'A{row}'].font = Font(bold=True)
    ws_info[f'A{row}'].fill = PatternFill(start_color="E7E6E6", end_color="E7E6E6", fill_type="solid")
    ws_info[f'B{row}'] = value
    row += 1

# Özet
row += 1
ws_info[f'A{row}'] = 'Özet (Abstract)'
ws_info[f'A{row}'].font = Font(bold=True)
ws_info.merge_cells(f'A{row}:B{row}')
row += 1
ws_info[f'A{row}'] = data.get('paperAbstract', '')
ws_info.merge_cells(f'A{row}:B{row}')
ws_info[f'A{row}'].alignment = Alignment(wrap_text=True, vertical='top')

# Column widths
ws_info.column_dimensions['A'].width = 20
ws_info.column_dimensions['B'].width = 80

# === Sheet 2: Skorlar ===
ws_scores = wb.create_sheet("Skorlar")

ws_scores['A1'] = 'Boyut'
ws_scores['B1'] = 'Skor'
ws_scores['A1'].font = header_font
ws_scores['B1'].font = header_font
ws_scores['A1'].fill = header_fill
ws_scores['B1'].fill = header_fill
ws_scores['A1'].alignment = header_alignment
ws_scores['B1'].alignment = header_alignment

scores_data = [
    ['D1: Akademik Etki', data.get('scoreD1', '0')],
    ['D2: Toplumsal ve Pratik Etki', data.get('scoreD2', '0')],
    ['D3: Negatif Etki ve Risk', data.get('scoreD3', '0')],
    ['D4: Etik ve Sorumluluk', data.get('scoreD4', '0')],
    ['', ''],
    ['Bütünsel Etki Skoru (HIS)', data.get('scoreHIS', '0')],
]

row = 2
for label, value in scores_data:
    if label == '':
        row += 1
        continue
    ws_scores[f'A{row}'] = label
    ws_scores[f'B{row}'] = float(value) if value else 0
    
    if 'HIS' in label:
        ws_scores[f'A{row}'].font = Font(bold=True, size=12)
        ws_scores[f'B{row}'].font = Font(bold=True, size=12)
        ws_scores[f'A{row}'].fill = PatternFill(start_color="FFC000", end_color="FFC000", fill_type="solid")
        ws_scores[f'B{row}'].fill = PatternFill(start_color="FFC000", end_color="FFC000", fill_type="solid")
    
    ws_scores[f'B{row}'].number_format = '0.00'
    row += 1

ws_scores.column_dimensions['A'].width = 35
ws_scores.column_dimensions['B'].width = 15

# === Sheet 3: Göstergeler ===
ws_indicators = wb.create_sheet("Göstergeler")

ws_indicators['A1'] = 'Gösterge Kodu'
ws_indicators['B1'] = 'Değer'
ws_indicators['A1'].font = header_font
ws_indicators['B1'].font = header_font
ws_indicators['A1'].fill = header_fill
ws_indicators['B1'].fill = header_fill
ws_indicators['A1'].alignment = header_alignment
ws_indicators['B1'].alignment = header_alignment

indicators = data.get('indicators', [])
row = 2
for indicator in indicators:
    ws_indicators[f'A{row}'] = indicator['code']
    ws_indicators[f'B{row}'] = float(indicator['value'])
    ws_indicators[f'B{row}'].number_format = '0.00'
    row += 1

ws_indicators.column_dimensions['A'].width = 20
ws_indicators.column_dimensions['B'].width = 15

# Save to stdout as binary
wb.save(sys.stdout.buffer)
`;

  // Write Python script to temp file
  const scriptPath = join(tmpdir(), `excel_gen_${randomBytes(8).toString('hex')}.py`);
  await writeFile(scriptPath, pythonScript);

  try {
    // Run Python script
    const result = await new Promise<Buffer>((resolve, reject) => {
      const process = spawn('python3.11', [scriptPath]);
      const chunks: Buffer[] = [];
      const errorChunks: Buffer[] = [];

      // Send data to stdin
      process.stdin.write(JSON.stringify(data));
      process.stdin.end();

      process.stdout.on('data', (chunk) => {
        chunks.push(chunk);
      });

      process.stderr.on('data', (chunk) => {
        errorChunks.push(chunk);
      });

      process.on('close', (code) => {
        if (code !== 0) {
          const error = Buffer.concat(errorChunks).toString();
          reject(new Error(`Python script failed: ${error}`));
        } else {
          resolve(Buffer.concat(chunks));
        }
      });

      process.on('error', (err) => {
        reject(err);
      });
    });

    return result;
  } finally {
    // Clean up temp file
    try {
      await unlink(scriptPath);
    } catch (err) {
      console.error('Failed to delete temp script:', err);
    }
  }
}
