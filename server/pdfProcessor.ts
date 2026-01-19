import fs from "fs";
// @ts-ignore
import pdf from "pdf-parse";
import { invokeLLM } from "./_core/llm";

export interface ExtractedPaperMetadata {
  title: string;
  authors: string;
  doi: string;
  year: number;
  journal: string;
  abstract: string;
  fullText: string;
}

export interface IndicatorSuggestion {
  indicatorCode: string;
  suggestedValue: string;
  confidence: "high" | "medium" | "low";
  reasoning: string;
}

/**
 * Extract text from PDF file using pdf-parse (pure JS)
 */
export async function extractTextFromPDF(pdfPath: string): Promise<string> {
  try {
    const dataBuffer = fs.readFileSync(pdfPath);
    const data = await pdf(dataBuffer);
    return data.text;
  } catch (error) {
    console.error("PDF text extraction error:", error);
    throw new Error(`PDF metin çıkarma başarısız oldu: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Extract paper metadata from PDF text using LLM
 */
export async function extractPaperMetadata(pdfText: string): Promise<ExtractedPaperMetadata> {
  const prompt = `Aşağıdaki akademik makale metninden şu bilgileri çıkar ve JSON formatında döndür:

1. title: Makalenin başlığı
2. authors: Yazarların isimleri (virgülle ayrılmış)
3. doi: DOI numarası (varsa, yoksa boş string)
4. year: Yayın yılı (sayı olarak)
5. journal: Dergi veya konferans adı (varsa)
6. abstract: Makalenin özeti (abstract bölümü)

Makale metni:
${pdfText.substring(0, 8000)}

JSON formatında döndür. Eğer bir bilgi bulunamazsa, boş string veya 0 kullan.`;

  try {
    const response = await invokeLLM({
      messages: [
        { role: "system", content: "Sen akademik makale analizi yapan bir asistansın. Sadece JSON formatında yanıt ver." },
        { role: "user", content: prompt },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "paper_metadata",
          strict: true,
          schema: {
            type: "object",
            properties: {
              title: { type: "string" },
              authors: { type: "string" },
              doi: { type: "string" },
              year: { type: "integer" },
              journal: { type: "string" },
              abstract: { type: "string" },
            },
            required: ["title", "authors", "doi", "year", "journal", "abstract"],
            additionalProperties: false,
          },
        },
      },
    });

    const content = response.choices[0]?.message?.content;
    if (!content || typeof content !== "string") {
      throw new Error("LLM yanıt vermedi");
    }

    const metadata = JSON.parse(content);
    return {
      ...metadata,
      fullText: pdfText,
    };
  } catch (error) {
    console.error("Metadata extraction error:", error);
    throw new Error("Makale bilgileri çıkarılamadı");
  }
}

/**
 * Analyze paper content and suggest indicator values using LLM
 */
export async function suggestIndicatorValues(
  paperMetadata: ExtractedPaperMetadata,
  indicatorCodes: string[]
): Promise<IndicatorSuggestion[]> {
  const indicatorPrompt = `Aşağıdaki akademik makale için belirtilen göstergelerin değerlerini tahmin et ve öner:

Makale Başlığı: ${paperMetadata.title}
Yazarlar: ${paperMetadata.authors}
Yayın Yılı: ${paperMetadata.year}
Dergi: ${paperMetadata.journal}
Özet: ${paperMetadata.abstract}

Gösterge Kodları: ${indicatorCodes.join(", ")}

Her gösterge için:
- Makale içeriğine dayanarak bir değer öner
- Güven seviyesi belirt (high/medium/low)
- Kısa bir gerekçe yaz

Gösterge Açıklamaları:
- I_111: Atıf sayısı (nicel, sayı)
- I_112: h-indeksi etkisi (nitel, 1-5)
- I_121: Disiplinlerarası atıflar (nitel, 1-5)
- I_211: Medya görünürlüğü (nitel, 1-5)
- I_212: Politika etkisi (nitel, 1-5)
- I_311: Negatif sosyal etki (nitel, 1-5, düşük daha iyi)
- I_411: Etik onay (ikili, 0 veya 1)

JSON formatında döndür.`;

  try {
    const response = await invokeLLM({
      messages: [
        { role: "system", content: "Sen akademik makale analizi yapan bir asistansın." },
        { role: "user", content: indicatorPrompt },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "indicator_suggestions",
          strict: true,
          schema: {
            type: "object",
            properties: {
              suggestions: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    indicatorCode: { type: "string" },
                    suggestedValue: { type: "string" },
                    confidence: { type: "string", enum: ["high", "medium", "low"] },
                    reasoning: { type: "string" },
                  },
                  required: ["indicatorCode", "suggestedValue", "confidence", "reasoning"],
                  additionalProperties: false,
                },
              },
            },
            required: ["suggestions"],
            additionalProperties: false,
          },
        },
      },
    });

    const content = response.choices[0]?.message?.content;
    if (!content || typeof content !== "string") {
      throw new Error("LLM yanıt vermedi");
    }

    const result = JSON.parse(content);
    return result.suggestions;
  } catch (error) {
    console.error("Indicator suggestion error:", error);
    return [];
  }
}
