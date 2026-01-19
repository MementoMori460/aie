import { DATA_SOURCES } from "@shared/completeIndicatorSystem";
import { ENV } from "./_core/env";

export interface BibliometricData {
    citationCount?: number;
    influentialCitationCount?: number;
    altmetricScore?: number;
    patentCount?: number;
    policyMentionCount?: number;
    field?: string;
}

/**
 * Service to fetch bibliometric data from various external APIs
 */
export class BibliometricClient {
    /**
     * Fetch citation data from Semantic Scholar
     */
    async fetchSemanticScholar(doi: string): Promise<Partial<BibliometricData>> {
        const config = DATA_SOURCES.semantic_scholar;
        if (!config.endpoint) return {};

        const url = config.endpoint.replace("{doi}", doi);
        try {
            const response = await fetch(`${url}?fields=citationCount,influentialCitationCount,fieldsOfStudy`, {
                headers: { "x-api-key": ENV.semanticScholarApiKey || "" }
            });
            if (!response.ok) return {};
            const data = await response.json();
            return {
                citationCount: data.citationCount,
                influentialCitationCount: data.influentialCitationCount,
                field: data.fieldsOfStudy?.[0]
            };
        } catch (error) {
            console.error("Semantic Scholar fetch error:", error);
            return {};
        }
    }

    /**
     * Fetch Altmetric data
     */
    async fetchAltmetric(doi: string): Promise<Partial<BibliometricData>> {
        const config = DATA_SOURCES.altmetric;
        if (!config.endpoint) return {};

        const url = config.endpoint.replace("{doi}", doi);
        try {
            const response = await fetch(url);
            if (!response.ok) return {};
            const data = await response.json();
            return {
                altmetricScore: data.score,
                policyMentionCount: data.cited_by_posts_count || 0
            };
        } catch (error) {
            console.error("Altmetric fetch error:", error);
            return {};
        }
    }

    /**
     * Fetch Patent data from Lens.org
     */
    async fetchLensPatents(doi: string): Promise<Partial<BibliometricData>> {
        const config = DATA_SOURCES.lens_org;
        if (!config.endpoint) return {};

        try {
            const response = await fetch(config.endpoint, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${ENV.lensApiKey || ""}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    query: {
                        bool: {
                            must: [{ match: { "scholarly_citations.doi": doi } }]
                        }
                    }
                })
            });
            if (!response.ok) return {};
            const data = await response.json();
            return {
                patentCount: data.total || 0
            };
        } catch (error) {
            console.error("Lens patents fetch error:", error);
            return {};
        }
    }

    /**
     * Aggregate data from multiple sources
     */
    async fetchAll(doi: string): Promise<BibliometricData> {
        const [ss, alt, lens] = await Promise.all([
            this.fetchSemanticScholar(doi),
            this.fetchAltmetric(doi),
            this.fetchLensPatents(doi)
        ]);

        return {
            ...ss,
            ...alt,
            ...lens
        };
    }
}

export const bibliometricClient = new BibliometricClient();
