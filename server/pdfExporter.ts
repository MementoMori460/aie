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
 * Generate PDF report for evaluation results
 */
export async function generatePDFReport(data: EvaluationData): Promise<Buffer> {
  // Create Python script to generate PDF
  const pythonScript = `
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import json
import sys
from io import BytesIO

# Read data from stdin
data = json.loads(sys.stdin.read())

# Create PDF in memory
buffer = BytesIO()
doc = SimpleDocTemplate(buffer, pagesize=A4, rightMargin=2*cm, leftMargin=2*cm, topMargin=2*cm, bottomMargin=2*cm)

# Styles
styles = getSampleStyleSheet()
title_style = ParagraphStyle(
    'CustomTitle',
    parent=styles['Heading1'],
    fontSize=18,
    textColor=colors.HexColor('#1a1a1a'),
    spaceAfter=30,
    alignment=TA_CENTER,
    fontName='Helvetica-Bold'
)

heading_style = ParagraphStyle(
    'CustomHeading',
    parent=styles['Heading2'],
    fontSize=14,
    textColor=colors.HexColor('#2c3e50'),
    spaceAfter=12,
    spaceBefore=12,
    fontName='Helvetica-Bold'
)

normal_style = ParagraphStyle(
    'CustomNormal',
    parent=styles['Normal'],
    fontSize=10,
    leading=14,
    alignment=TA_JUSTIFY
)

# Story (content)
story = []

# Title
story.append(Paragraph('Akademik Makale Etki Değerlendirmesi Raporu', title_style))
story.append(Spacer(1, 0.5*cm))

# Paper Information
story.append(Paragraph('Makale Bilgileri', heading_style))

info_data = [
    ['Başlık:', data.get('paperTitle', 'N/A')],
    ['Yazarlar:', data.get('paperAuthors', 'N/A')],
    ['DOI:', data.get('paperDoi', 'N/A')],
    ['Yıl:', str(data.get('paperYear', 'N/A'))],
    ['Dergi/Konferans:', data.get('paperJournal', 'N/A')],
]

info_table = Table(info_data, colWidths=[4*cm, 13*cm])
info_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#f0f0f0')),
    ('TEXTCOLOR', (0, 0), (0, -1), colors.HexColor('#2c3e50')),
    ('ALIGN', (0, 0), (0, -1), 'LEFT'),
    ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
    ('FONTSIZE', (0, 0), (-1, -1), 10),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
    ('TOPPADDING', (0, 0), (-1, -1), 8),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
]))
story.append(info_table)
story.append(Spacer(1, 0.5*cm))

# Abstract
if data.get('paperAbstract'):
    story.append(Paragraph('Özet', heading_style))
    story.append(Paragraph(data.get('paperAbstract', ''), normal_style))
    story.append(Spacer(1, 0.5*cm))

# Scores
story.append(Paragraph('Değerlendirme Skorları', heading_style))

scores_data = [
    ['Boyut', 'Skor'],
    ['D1: Akademik Etki', f"{float(data.get('scoreD1', 0)):.2f}"],
    ['D2: Toplumsal ve Pratik Etki', f"{float(data.get('scoreD2', 0)):.2f}"],
    ['D3: Negatif Etki ve Risk', f"{float(data.get('scoreD3', 0)):.2f}"],
    ['D4: Etik ve Sorumluluk', f"{float(data.get('scoreD4', 0)):.2f}"],
]

scores_table = Table(scores_data, colWidths=[12*cm, 5*cm])
scores_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#4472C4')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
    ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
    ('ALIGN', (1, 1), (1, -1), 'CENTER'),
    ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
    ('FONTSIZE', (0, 0), (-1, -1), 10),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
    ('TOPPADDING', (0, 0), (-1, -1), 8),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
    ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f9f9f9')]),
]))
story.append(scores_table)
story.append(Spacer(1, 0.5*cm))

# HIS Score (highlighted)
his_data = [
    ['Bütünsel Etki Skoru (HIS)', f"{float(data.get('scoreHIS', 0)):.2f}"],
]

his_table = Table(his_data, colWidths=[12*cm, 5*cm])
his_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#FFC000')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.HexColor('#1a1a1a')),
    ('ALIGN', (0, 0), (0, 0), 'LEFT'),
    ('ALIGN', (1, 0), (1, 0), 'CENTER'),
    ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
    ('FONTSIZE', (0, 0), (-1, 0), 12),
    ('BOTTOMPADDING', (0, 0), (-1, 0), 10),
    ('TOPPADDING', (0, 0), (-1, 0), 10),
    ('GRID', (0, 0), (-1, 0), 1, colors.HexColor('#E6A000')),
]))
story.append(his_table)
story.append(Spacer(1, 1*cm))

# Indicators (if there are many, split into pages)
story.append(Paragraph('Gösterge Detayları', heading_style))

indicators = data.get('indicators', [])
if indicators:
    # Split indicators into chunks of 30 for better page layout
    chunk_size = 30
    for i in range(0, len(indicators), chunk_size):
        chunk = indicators[i:i+chunk_size]
        
        indicator_data = [['Gösterge Kodu', 'Değer']]
        for ind in chunk:
            indicator_data.append([ind['code'], f"{float(ind['value']):.2f}"])
        
        indicator_table = Table(indicator_data, colWidths=[12*cm, 5*cm])
        indicator_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#4472C4')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('ALIGN', (1, 1), (1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 9),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
            ('TOPPADDING', (0, 0), (-1, -1), 6),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f9f9f9')]),
        ]))
        story.append(indicator_table)
        
        if i + chunk_size < len(indicators):
            story.append(PageBreak())

# Build PDF
doc.build(story)

# Write to stdout
sys.stdout.buffer.write(buffer.getvalue())
`;

  // Write Python script to temp file
  const scriptPath = join(tmpdir(), `pdf_gen_${randomBytes(8).toString('hex')}.py`);
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
