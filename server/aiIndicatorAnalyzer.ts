import { invokeLLM } from "./_core/llm";
import { ALL_DIMENSIONS } from "@shared/indicators";

interface IndicatorSuggestion {
  code: string;
  value: number | string;
  reasoning: string;
  confidence: 'high' | 'medium' | 'low';
}

interface AnalysisResult {
  suggestions: IndicatorSuggestion[];
  overallAssessment: string;
}

/**
 * Analyze paper content and suggest values for all 33 indicators using AI
 */
export async function analyzeIndicatorsWithAI(
  paperText: string,
  paperMetadata: {
    title: string;
    authors?: string;
    year?: number;
    journal?: string;
    abstract?: string;
  }
): Promise<AnalysisResult> {
  // Build comprehensive indicator list with descriptions
  const indicatorDescriptions = ALL_DIMENSIONS.flatMap(dim =>
    dim.subDimensions.flatMap(subdim =>
      subdim.indicators.map(ind => ({
        code: ind.code,
        name: ind.name,
        description: ind.description,
        type: ind.type,
        measurementMethod: ind.measurementMethod,
        scale: ind.type === 'quantitative' ? 'numeric (0+)' :
          ind.type === 'qualitative' ? 'Likert 1-5' : 'binary 0/1'
      }))
    )
  );

  // Prompt generation logic moved to dynamic fetching below

  const { getActiveAiPrompt } = await import("./db");
  const activePromptRecord = await getActiveAiPrompt();
  let promptTemplate = activePromptRecord ? activePromptRecord.promptText : generatePromptTemplate();

  // Replace placeholders
  const filledPrompt = promptTemplate
    .replace(/{MAKELE_BAŞLIĞI}|{MAKALE_BAŞLIĞI}/g, paperMetadata.title) // Handle potential typo in template
    .replace(/{YAZARLAR}/g, paperMetadata.authors || "Belirtilmemiş")
    .replace(/{YIL}/g, (paperMetadata.year || "").toString())
    .replace(/{DERGİ}/g, paperMetadata.journal || "Belirtilmemiş")
    .replace(/{ÖZET}/g, paperMetadata.abstract || "")
    .replace(/{MAKALE_METNİ_BURAYA_GELECEK}/g, paperText.substring(0, 15000)); // Increased limit

  // If using the default template which has the indicators section dynamically generated at the end, 
  // we might need to handle that. 
  // However, the user-defined prompt might EXPECT the indicators to be appended or included.
  // Let's assume the user-defined prompt INCLUDES instructions on what to do. 
  // BUT, our code below *appends* the indicator list if it's the default function.
  // Actually, looking at generatePromptTemplate, it returns a FULL string with indicators.
  // So if we pull from DB, that DB prompt should ideally have the indicators list OR we append it.
  // For now, let's assume the DB prompt is a FULL template like the default one. 
  // IF the DB prompt doesn't have the indicators, the AI won't know what to do.
  // To be safe, if it's a DB prompt, we should probably append the indicator list if it's not detected?
  // Let's stick to the simpler approach: The DB prompt is the source of truth.

  // Using the filled prompt
  const prompt = filledPrompt;

  try {
    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: "Sen akademik makale etki değerlendirmesi konusunda uzman bir AI asistanısın. Verilen makaleleri analiz edip objektif değerlendirmeler yaparsın."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "indicator_analysis",
          strict: true,
          schema: {
            type: "object",
            properties: {
              suggestions: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    code: { type: "string" },
                    value: {
                      oneOf: [
                        { type: "number" },
                        { type: "string" }
                      ]
                    },
                    reasoning: { type: "string" },
                    confidence: {
                      type: "string",
                      enum: ["high", "medium", "low"]
                    }
                  },
                  required: ["code", "value", "reasoning", "confidence"],
                  additionalProperties: false
                }
              },
              overallAssessment: { type: "string" }
            },
            required: ["suggestions", "overallAssessment"],
            additionalProperties: false
          }
        }
      }
    });

    const content = response.choices[0]?.message?.content;
    if (!content || typeof content !== 'string') {
      throw new Error("AI response is empty or invalid");
    }

    const result = JSON.parse(content) as AnalysisResult;

    // Validate that we have suggestions for all indicators
    if (result.suggestions.length < 33) {
      console.warn(`AI returned only ${result.suggestions.length} suggestions, expected 33`);
    }

    return result;
  } catch (error) {
    console.error("Error analyzing indicators with AI:", error);
    throw new Error("AI analizi sırasında bir hata oluştu. Lütfen tekrar deneyin.");
  }
}

/**
 * Returns the prompt template used for AI analysis
 */
export function generatePromptTemplate(): string {
  // Build comprehensive indicator list with descriptions
  const indicatorDescriptions = ALL_DIMENSIONS.flatMap(dim =>
    dim.subDimensions.flatMap(subdim =>
      subdim.indicators.map(ind => ({
        code: ind.code,
        name: ind.name,
        description: ind.description,
        type: ind.type,
        measurementMethod: ind.measurementMethod,
        scale: ind.type === 'quantitative' ? 'numeric (0+)' :
          ind.type === 'qualitative' ? 'Likert 1-5' : 'binary 0/1'
      }))
    )
  );

  return `Sen akademik makaleleri değerlendiren bir uzmansın. Aşağıdaki makaleyi analiz edip 33 gösterge için değer önerileri sunman gerekiyor.

# Makale Bilgileri
Başlık: {MAKELE_BAŞLIĞI}
Yazarlar: {YAZARLAR}
Yıl: {YIL}
Dergi: {DERGİ}
Özet:
{ÖZET}

# Makale İçeriği (İlk 8000 karakter)
{MAKALE_METNİ_BURAYA_GELECEK}

# Göstergeler
${indicatorDescriptions.map((ind, idx) =>
    `${idx + 1}. ${ind.code} - ${ind.name}
   Açıklama: ${ind.description}
   Ölçüm: ${ind.measurementMethod}
   Ölçek: ${ind.scale}`
  ).join('\n\n')}

# Görevin
Her gösterge için:
1. Makale içeriğine dayanarak uygun bir değer öner
2. Bu değeri neden önerdiğini açıkla (1-2 cümle)
3. Güven seviyeni belirt (high/medium/low)

Önemli Notlar:
- Nicel göstergeler (quantitative) için sayısal değer öner (örn: 50, 120, 1500)
- Nitel göstergeler (qualitative) için 1-5 arası Likert ölçeği değeri öner
- İkili göstergeler (binary) için 0 veya 1 öner
- Makale içeriğinde bilgi yoksa, güven seviyesini "low" olarak işaretle ve makul bir tahmin yap
- Atıf sayısı, sosyal medya etkisi gibi metrikler için makale yeni ise düşük değerler öner

Yanıtını JSON formatında ver:
{
  "suggestions": [
    {
      "code": "I_111",
      "value": 50,
      "reasoning": "Makale yeni yayınlandığı için atıf sayısı henüz düşük",
      "confidence": "medium"
    },
    ...
  ],
  "overallAssessment": "Makalenin genel değerlendirmesi (2-3 cümle)"
}`;
}

/**
 * Convert AI suggestions to a format compatible with evaluation indicators
 */
export function convertSuggestionsToIndicators(suggestions: IndicatorSuggestion[]): Record<string, number> {
  const indicators: Record<string, number> = {};

  for (const suggestion of suggestions) {
    const value = typeof suggestion.value === 'string'
      ? parseFloat(suggestion.value)
      : suggestion.value;

    if (!isNaN(value)) {
      indicators[suggestion.code] = value;
    }
  }

  return indicators;
}
