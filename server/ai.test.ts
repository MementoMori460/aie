import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return { ctx };
}

describe("ai.analyzeAllIndicators", () => {
  it("should analyze paper and return suggestions for all indicators", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const samplePaperText = `
      This paper presents a novel machine learning approach for early cancer detection.
      The method achieves 95% accuracy on a dataset of 10,000 patients.
      The research has been cited by several follow-up studies and has potential
      for clinical application. The study was approved by the institutional review board
      and follows all ethical guidelines for medical research.
    `;

    const result = await caller.ai.analyzeAllIndicators({
      paperText: samplePaperText,
      paperMetadata: {
        title: "Machine Learning for Early Cancer Detection",
        authors: "Smith, J., Johnson, A.",
        year: 2023,
        journal: "Nature Medicine",
        abstract: "A novel approach for cancer detection using ML",
      },
    });

    // Verify response structure
    expect(result).toHaveProperty("suggestions");
    expect(result).toHaveProperty("overallAssessment");
    expect(Array.isArray(result.suggestions)).toBe(true);
    expect(typeof result.overallAssessment).toBe("string");

    // Verify we have suggestions
    expect(result.suggestions.length).toBeGreaterThan(0);

    // Verify each suggestion has required fields
    for (const suggestion of result.suggestions) {
      expect(suggestion).toHaveProperty("code");
      expect(suggestion).toHaveProperty("value");
      expect(suggestion).toHaveProperty("reasoning");
      expect(suggestion).toHaveProperty("confidence");
      
      expect(typeof suggestion.code).toBe("string");
      expect(["number", "string"].includes(typeof suggestion.value)).toBe(true);
      expect(typeof suggestion.reasoning).toBe("string");
      expect(["high", "medium", "low"].includes(suggestion.confidence)).toBe(true);
    }

    // Verify overall assessment is meaningful
    expect(result.overallAssessment.length).toBeGreaterThan(10);
  }, 60000); // 60 second timeout for AI analysis

  it("should handle papers with minimal information", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const minimalPaperText = "A short paper about AI.";

    const result = await caller.ai.analyzeAllIndicators({
      paperText: minimalPaperText,
      paperMetadata: {
        title: "AI Research",
      },
    });

    expect(result).toHaveProperty("suggestions");
    expect(result).toHaveProperty("overallAssessment");
    expect(result.suggestions.length).toBeGreaterThan(0);
  }, 60000);
});
