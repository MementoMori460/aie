import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createTestContext(): { ctx: TrpcContext } {
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

describe("pdf.upload", () => {
  it("uploads PDF from base64 and returns file info", async () => {
    const { ctx } = createTestContext();
    const caller = appRouter.createCaller(ctx);

    // Create a minimal PDF base64 (just for testing structure, not a real PDF)
    const testBase64 = Buffer.from("test pdf content").toString("base64");

    const result = await caller.pdf.upload({
      base64Data: testBase64,
      filename: "test-paper.pdf",
    });

    expect(result).toHaveProperty("fileKey");
    expect(result).toHaveProperty("url");
    expect(result).toHaveProperty("localPath");
    expect(result.fileKey).toContain("pdf-uploads/");
    expect(result.fileKey).toContain("test-paper.pdf");
  });
});

describe("pdf.suggestIndicators", () => {
  it("returns indicator suggestions based on paper metadata", { timeout: 30000 }, async () => {
    const { ctx } = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.pdf.suggestIndicators({
      paperTitle: "Machine Learning Applications in Healthcare",
      paperAuthors: "Smith, J., Johnson, A.",
      paperYear: 2023,
      paperJournal: "Nature Medicine",
      paperAbstract: "This paper explores the application of machine learning techniques in healthcare diagnostics...",
      indicatorCodes: ["I_111", "I_112", "I_211"],
    });

    expect(Array.isArray(result)).toBe(true);
    // Note: LLM responses may vary, so we just check structure
    if (result.length > 0) {
      expect(result[0]).toHaveProperty("indicatorCode");
      expect(result[0]).toHaveProperty("suggestedValue");
      expect(result[0]).toHaveProperty("confidence");
      expect(result[0]).toHaveProperty("reasoning");
    }
  });
});
