import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { router, protectedProcedure, publicProcedure } from "./_core/trpc";
import { calculateHIS, type DimensionScores, type CascadeMetrics } from "./hisCalculator";
import { calculateCascadeMultipliersFromDimensions, calculate5LevelCascadeFromDimensions } from "./cascadeEngine";
import { z } from "zod";
import * as db from "./db";
import { sendEmail } from "./_core/email";
import { extractTextFromPDF, extractPaperMetadata, suggestIndicatorValues } from "./pdfProcessor";
import { uploadPdfFromBase64, cleanupTempFile } from "./fileUpload";
import { analyzeIndicatorsWithAI } from "./aiIndicatorAnalyzer";
import { bibliometricClient } from "./bibliometricClient";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts: any) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }: { ctx: any }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  evaluation: router({
    // Create a new evaluation
    create: protectedProcedure
      .input(z.object({
        paperTitle: z.string(),
        paperAuthors: z.string().optional(),
        paperDoi: z.string().optional(),
        paperYear: z.number().optional(),
        paperJournal: z.string().optional(),
        paperAbstract: z.string().optional(),
        evaluationMode: z.enum(["quick", "comprehensive"]).default("quick"),
      }))
      .mutation(async ({ ctx, input }) => {
        const evaluationId = await db.createEvaluation({
          userId: ctx.user.id,
          ...input,
        });

        await db.createAuditLog({
          userId: ctx.user.id,
          evaluationId,
          action: "EVALUATION_CREATED",
          details: { title: input.paperTitle },
        });

        return { evaluationId };
      }),

    // Get evaluation by ID
    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }: { input: any }) => {
        return await db.getEvaluationById(input.id);
      }),

    // List user's evaluations
    list: protectedProcedure
      .query(async ({ ctx }: { ctx: any }) => {
        const { role, id } = ctx.user;

        if (role === 'admin' || role === 'board_chair') {
          return await db.getAllEvaluations();
        }

        if (role === 'reviewer') {
          // For now, return assigned evaluations. 
          // If we want them to also see their own, we'd need to merge lists.
          return await db.getAssignedEvaluations(id);
        }

        return await db.getUserEvaluations(id);
      }),

    getMany: protectedProcedure
      .input(z.object({ ids: z.array(z.number()) }))
      .query(async ({ input }: { input: any }) => {
        return await db.getEvaluationsByIds(input.ids);
      }),

    // Update evaluation
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        paperTitle: z.string().optional(),
        paperAuthors: z.string().optional(),
        paperDoi: z.string().optional(),
        paperYear: z.number().optional(),
        paperJournal: z.string().optional(),
        paperAbstract: z.string().optional(),
        pdfPath: z.string().optional(),
        boardChairId: z.number().optional(),
        // Dimension scores (D1-D16)
        D1: z.number().optional(),
        D2: z.number().optional(),
        D3: z.number().optional(),
        D4: z.number().optional(),
        D5: z.number().optional(),
        D6: z.number().optional(),
        D7: z.number().optional(),
        D8: z.number().optional(),
        D9: z.number().optional(),
        D10: z.number().optional(),
        D11: z.number().optional(),
        D12: z.number().optional(),
        D13: z.number().optional(),
        D14: z.number().optional(),
        D15: z.number().optional(),
        D16: z.number().optional(),
        status: z.enum(["draft", "completed"]).optional(),
        completedAt: z.date().optional(),
      }))
      .mutation(async ({ ctx, input }: { ctx: any, input: any }) => {
        const { id, ...data } = input;

        // Auto-calculate HIS if dimension scores are provided
        if (data.D1 !== undefined || data.D2 !== undefined || data.D3 !== undefined || data.D4 !== undefined) {
          const scores: DimensionScores = {
            D1: data.D1,
            D2: data.D2,
            D3: data.D3,
            D4: data.D4,
            D5: data.D5,
            D6: data.D6,
            D7: data.D7,
            D8: data.D8,
            D9: data.D9,
            D10: data.D10,
            D11: data.D11,
            D12: data.D12,
            D13: data.D13,
            D14: data.D14,
            D15: data.D15,
            D16: data.D16,
          };

          // Determine mode based on which dimensions are filled
          const hasExtendedDimensions = data.D5 !== undefined || data.D6 !== undefined || data.D7 !== undefined;
          const mode = hasExtendedDimensions ? "comprehensive" : "quick";

          // Cascade metrics will be calculated for comprehensive mode
          let cascadeMetrics: CascadeMetrics | undefined;

          // Auto-calculate cascade multipliers for comprehensive mode
          if (mode === "comprehensive") {
            const cascadeResults = calculateCascadeMultipliersFromDimensions(scores);

            // Update cascade metrics for HIS calculation
            cascadeMetrics = cascadeResults;
          }

          // Calculate HIS
          const HIS = calculateHIS(mode, scores, cascadeMetrics);

          // Prepare data for database (convert to string format)
          const dbData: Record<string, any> = { ...data };

          // Convert dimension scores to scoreD1, scoreD2 format for database
          for (let i = 1; i <= 16; i++) {
            const dimKey = `D${i}` as keyof typeof data;
            const score = data[dimKey];
            if (score !== undefined && typeof score === 'number') {
              dbData[`scoreD${i}`] = score; // SQLite uses REAL (number)
              delete dbData[dimKey as string];
            }
          }

          // Add calculated metrics
          dbData.scoreHIS = HIS.toFixed(2);
          if (cascadeMetrics) {
            dbData.cascadeMultiplier = cascadeMetrics.cascadeMultiplier.toFixed(2);
            dbData.economicMultiplier = cascadeMetrics.economicMultiplier.toFixed(2);
            dbData.socialMultiplier = cascadeMetrics.socialMultiplier.toFixed(2);
            dbData.scientificMultiplier = cascadeMetrics.scientificMultiplier.toFixed(2);
            dbData.environmentalMultiplier = cascadeMetrics.environmentalMultiplier.toFixed(2);
            dbData.networkEffectScore = cascadeMetrics.networkEffectScore.toFixed(2);
          }

          await db.updateEvaluation(id, dbData);
          return { success: true, HIS, cascadeMetrics };
        }

        // No dimension scores provided, just update other fields
        await db.updateEvaluation(id, data);

        // Notify Board Chair if assigned
        if (data.boardChairId) {
          try {
            const boardChair = await db.getUserById(data.boardChairId);
            if (boardChair && boardChair.email) {
              await sendEmail({
                to: boardChair.email,
                subject: "Yeni Değerlendirme Ataması (Başhakem)",
                html: `
                  <h2>Yeni Başhakem Ataması</h2>
                  <p><strong>${input.paperTitle || 'Bir makale'}</strong> için Başhakem olarak atandınız.</p>
                  <p>Uzlaşma Panelini kullanarak hakem atamalarını gerçekleştirebilirsiniz.</p>
                  <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/consensus">Panele Git</a>
                `
              });
            }
          } catch (e) {
            console.error("Error sending board chair email:", e);
          }
        }

        if (data.status === "completed") {
          // Check notification setting
          const notifyCompletion = await db.getSystemSetting("notify_on_completion");

          if (notifyCompletion === "true") {
            // Get all admin users
            const users = await db.getAllUsers();
            const admins = users.filter(u => u.role === "admin" && u.email);

            for (const admin of admins) {
              await sendEmail({
                to: admin.email!,
                subject: "Değerlendirme Tamamlandı",
                html: `
                  <h2>Değerlendirme Tamamlandı</h2>
                  <p><strong>${input.paperTitle || 'Bir makale'}</strong> başlıklı değerlendirme tamamlandı.</p>
                  <p>Sonuçları görüntülemek için panele giriş yapınız.</p>
                 `
              });
            }
          }
        }

        await db.createAuditLog({
          userId: ctx.user.id,
          evaluationId: id,
          action: data.status === "completed" ? "EVALUATION_COMPLETED" : "EVALUATION_UPDATED",
          details: { status: data.status },
        });

        return { success: true };
      }),

    // Delete evaluation
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }: { input: any }) => {
        await db.deleteEvaluation(input.id);
        return { success: true };
      }),
  }),

  indicator: router({
    // Save indicator value
    save: protectedProcedure
      .input(z.object({
        evaluationId: z.number(),
        indicatorCode: z.string(),
        rawValue: z.string().optional(),
        normalizedScore: z.string().optional(),
        metadata: z.any().optional(),
      }))
      .mutation(async ({ input }: { input: any }) => {
        const indicatorId = await db.saveIndicator(input);
        return { indicatorId };
      }),

    // Get all indicators for an evaluation
    list: protectedProcedure
      .input(z.object({ evaluationId: z.number() }))
      .query(async ({ input }: { input: any }) => {
        return await db.getEvaluationIndicators(input.evaluationId);
      }),

    // Get specific indicator
    get: protectedProcedure
      .input(z.object({
        evaluationId: z.number(),
        indicatorCode: z.string(),
      }))
      .query(async ({ input }: { input: any }) => {
        return await db.getIndicatorByCode(input.evaluationId, input.indicatorCode);
      }),
  }),

  pdf: router({
    upload: protectedProcedure
      .input(z.object({
        base64Data: z.string(),
        filename: z.string(),
      }))
      .mutation(async ({ input }: { input: any }) => {
        const uploadResult = await uploadPdfFromBase64(input.base64Data, input.filename);
        return uploadResult;
      }),
    extractMetadata: protectedProcedure
      .input(z.object({ localPath: z.string() }))
      .mutation(async ({ input }: { input: any }) => {
        try {
          const text = await extractTextFromPDF(input.localPath);
          const metadata = await extractPaperMetadata(text);
          // File is persisted in uploads folder, so we don't delete it
          return metadata;
        } catch (error) {
          console.error("Metadata extraction failed:", error);
          throw error;
        }
      }),
    suggestIndicators: protectedProcedure
      .input(
        z.object({
          paperTitle: z.string(),
          paperAuthors: z.string().optional(),
          paperYear: z.number().optional(),
          paperJournal: z.string().optional(),
          metadata: z.object({
            title: z.string(),
            authors: z.string().optional(),
            doi: z.string().optional(),
            year: z.number().optional(),
            journal: z.string().optional(),
            abstract: z.string(),
            fullText: z.string(),
          }),
          indicatorCodes: z.array(z.string()),
        })
      )
      .mutation(async ({ input }) => {
        // 1. Fetch real bibliometric data if DOI is available
        let bibliometricData = {};
        if (input.metadata.doi) {
          bibliometricData = await bibliometricClient.fetchAll(input.metadata.doi);
        }

        // 2. Get AI suggestions
        const aiAnalysis = await analyzeIndicatorsWithAI(input.metadata.fullText, input.metadata);

        // 3. Merge real data into suggestions
        const suggestions = aiAnalysis.suggestions.map((ind: any) => {
          if (ind.code === "I_111" && (bibliometricData as any).citationCount !== undefined) {
            return {
              ...ind,
              value: (bibliometricData as any).citationCount,
              reasoning: `Semantic Scholar'dan gerçek veri: ${(bibliometricData as any).citationCount} atıf.`,
              confidence: "high" as const,
            };
          }
          if (ind.code === "I_121" && (bibliometricData as any).altmetricScore !== undefined) {
            return {
              ...ind,
              value: (bibliometricData as any).altmetricScore,
              reasoning: `Altmetric'ten gerçek veri: ${(bibliometricData as any).altmetricScore} skor.`,
              confidence: "high" as const,
            };
          }
          if (ind.code === "I_221" && (bibliometricData as any).patentCount !== undefined) {
            return {
              ...ind,
              value: (bibliometricData as any).patentCount,
              reasoning: `Lens.org'dan gerçek veri: ${(bibliometricData as any).patentCount} patent atıfı.`,
              confidence: "high" as const,
            };
          }
          return ind;
        });

        return {
          suggestions,
          overallAssessment: aiAnalysis.overallAssessment,
        };
      }),
  }),

  ai: router({
    analyzeAllIndicators: protectedProcedure
      .input(z.object({
        paperText: z.string(),
        paperMetadata: z.object({
          title: z.string(),
          authors: z.string().optional(),
          year: z.number().optional(),
          journal: z.string().optional(),
          abstract: z.string().optional(),
        }),
      }))
      .mutation(async ({ input }) => {
        return await analyzeIndicatorsWithAI(input.paperText, input.paperMetadata);
      }),
  }),

  export: router({
    // Export evaluation as Excel
    excel: protectedProcedure
      .input(z.object({ evaluationId: z.number() }))
      .mutation(async ({ input }) => {
        const { generateExcelReport } = await import('./excelExporter');

        // Get evaluation data
        const evaluation = await db.getEvaluationById(input.evaluationId);
        if (!evaluation) {
          throw new Error('Evaluation not found');
        }

        // Get indicators
        const indicators = await db.getEvaluationIndicators(input.evaluationId);

        // Generate Excel
        const excelBuffer = await generateExcelReport({
          paperTitle: evaluation.paperTitle || '',
          paperAuthors: evaluation.paperAuthors || '',
          paperDoi: evaluation.paperDoi || '',
          paperYear: evaluation.paperYear || undefined,
          paperJournal: evaluation.paperJournal || '',
          paperAbstract: evaluation.paperAbstract || '',
          scoreD1: evaluation.scoreD1?.toString() || '0',
          scoreD2: evaluation.scoreD2?.toString() || '0',
          scoreD3: evaluation.scoreD3?.toString() || '0',
          scoreD4: evaluation.scoreD4?.toString() || '0',
          scoreHIS: evaluation.scoreHIS?.toString() || '0',
          indicators: indicators.map((ind) => ({
            code: ind.indicatorCode,
            value: parseFloat(ind.normalizedScore?.toString() || '0'),
          })),
        });

        // Return base64 encoded
        return {
          data: excelBuffer.toString('base64'),
          filename: `evaluation_${input.evaluationId}.xlsx`,
        };
      }),

    // Export evaluation as PDF
    pdf: protectedProcedure
      .input(z.object({ evaluationId: z.number() }))
      .mutation(async ({ input }) => {
        const { generatePDFReport } = await import('./pdfExporter');

        // Get evaluation data
        const evaluation = await db.getEvaluationById(input.evaluationId);
        if (!evaluation) {
          throw new Error('Evaluation not found');
        }

        // Get indicators
        const indicators = await db.getEvaluationIndicators(input.evaluationId);

        // Generate PDF
        const pdfBuffer = await generatePDFReport({
          paperTitle: evaluation.paperTitle || '',
          paperAuthors: evaluation.paperAuthors || '',
          paperDoi: evaluation.paperDoi || '',
          paperYear: evaluation.paperYear || undefined,
          paperJournal: evaluation.paperJournal || '',
          paperAbstract: evaluation.paperAbstract || '',
          scoreD1: evaluation.scoreD1?.toString() || '0',
          scoreD2: evaluation.scoreD2?.toString() || '0',
          scoreD3: evaluation.scoreD3?.toString() || '0',
          scoreD4: evaluation.scoreD4?.toString() || '0',
          scoreHIS: evaluation.scoreHIS?.toString() || '0',
          indicators: indicators.map((ind) => ({
            code: ind.indicatorCode,
            value: parseFloat(ind.normalizedScore?.toString() || '0'),
          })),
        });

        // Return base64 encoded
        return {
          data: pdfBuffer.toString('base64'),
          filename: `evaluation_${input.evaluationId}.pdf`,
        };
      }),
  }),

  cascade: router({
    // Calculate cascade effects for comprehensive mode
    calculate: protectedProcedure
      .input(z.object({
        dimensionScores: z.record(z.string(), z.number()),
        evaluationMode: z.enum(["quick", "comprehensive"]),
      }))
      .mutation(async ({ input }) => {
        // Only calculate cascade effects for comprehensive mode
        if (input.evaluationMode !== "comprehensive") {
          return {
            cascadeMultiplier: 1.0,
            economicMultiplier: 1.0,
            socialMultiplier: 1.0,
            networkEffectScore: 0,
          };
        }

        // Calculate average dimension score
        const scores = Object.values(input.dimensionScores);
        const avgScore = scores.reduce((sum, s) => sum + s, 0) / scores.length;

        // Calculate multipliers based on dimension scores
        const economicScore = input.dimensionScores['D5'] || 0;
        const socialScore = input.dimensionScores['D10'] || 0;
        const techScore = input.dimensionScores['D9'] || 0;

        // Economic multiplier: 1.5 - 5.0x
        const economicMultiplier = 1.5 + (economicScore / 100) * 3.5;

        // Social multiplier: 2.0 - 10.0x
        const socialMultiplier = 2.0 + (socialScore / 100) * 8.0;

        // Network effect score (based on collaboration and tech dimensions)
        const collabScore = input.dimensionScores['D15'] || 0;
        const networkEffectScore = (techScore + collabScore) / 2;

        // Overall cascade multiplier (weighted average)
        const cascadeMultiplier = (
          economicMultiplier * 0.4 +
          socialMultiplier * 0.3 +
          (1 + networkEffectScore / 100) * 0.3
        );

        return {
          cascadeMultiplier: Math.min(cascadeMultiplier, 10.0), // Cap at 10x
          economicMultiplier,
          socialMultiplier,
          networkEffectScore,
        };
      }),
  }),

  review: router({
    save: protectedProcedure
      .input(z.object({
        evaluationId: z.number(),
        reviewerId: z.number(),
        scoreD1: z.number().optional(),
        scoreD2: z.number().optional(),
        scoreD3: z.number().optional(),
        scoreD4: z.number().optional(),
        scoreHIS: z.number().optional(),
        comment: z.string().optional(),
        status: z.enum(["draft", "submitted"]).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const reviewId = await db.saveReview({
          ...input,
          scoreD1: input.scoreD1,
          scoreD2: input.scoreD2,
          scoreD3: input.scoreD3,
          scoreD4: input.scoreD4,
          scoreHIS: input.scoreHIS,
        });

        if (input.status === "submitted") {
          const notifyReview = await db.getSystemSetting("notify_on_review_submission");
          if (notifyReview === "true") {
            const users = await db.getAllUsers();
            const recipients = users.filter(u => (u.role === "admin" || u.role === "board_chair") && u.email);

            // Get evaluation title for context
            const evaluation = await db.getEvaluationById(input.evaluationId);

            for (const recipient of recipients) {
              await sendEmail({
                to: recipient.email!,
                subject: "Yeni Hakem Raporu Gönderildi",
                html: `
                  <h2>Yeni Hakem Raporu</h2>
                  <p><strong>${evaluation?.paperTitle || 'Bir makale'}</strong> için yeni bir hakem raporu gönderildi.</p>
                  <p>Detayları görmek için panele giriş yapınız.</p>
                 `
              });
            }
          }
        }

        await db.createAuditLog({
          userId: ctx.user.id,
          evaluationId: input.evaluationId,
          action: input.status === "submitted" ? "REVIEW_SUBMITTED" : "REVIEW_SAVED",
          details: { reviewerId: input.reviewerId },
        });

        return { reviewId };
      }),

    listByEvaluation: protectedProcedure
      .input(z.object({ evaluationId: z.number() }))
      .query(async ({ input }) => {
        return await db.getReviewsByEvaluation(input.evaluationId);
      }),

    getByReviewer: protectedProcedure
      .input(z.object({ evaluationId: z.number(), reviewerId: z.number() }))
      .query(async ({ input }) => {
        return await db.getReviewByReviewer(input.evaluationId, input.reviewerId);
      }),

    getConsensusMetrics: protectedProcedure
      .input(z.object({ evaluationId: z.number() }))
      .query(async ({ input }) => {
        const reviews = await db.getReviewsByEvaluation(input.evaluationId);
        if (reviews.length < 2) return null;

        const dimensions = ['scoreD1', 'scoreD2', 'scoreD3', 'scoreD4'];
        let totalDiff = 0;
        let count = 0;

        dimensions.forEach(dim => {
          const scores = reviews
            .map(r => parseFloat((r as any)[dim] || '0'))
            .filter(s => !isNaN(s));

          if (scores.length >= 2) {
            const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
            const variance = scores.reduce((sum, s) => sum + Math.pow(s - mean, 2), 0) / scores.length;

            // Simplified Consensus: 100 - average deviation
            const avgDev = scores.reduce((sum, s) => sum + Math.abs(s - mean), 0) / scores.length;
            totalDiff += avgDev;
            count++;
          }
        });

        const consensusScore = count > 0 ? Math.max(0, 100 - (totalDiff / count)) : 100;

        return {
          consensusScore,
          reviewerCount: reviews.length,
          discrepancy: count > 0 ? totalDiff / count : 0,
        };
      }),
  }),

  assignment: router({
    assign: protectedProcedure
      .input(z.object({
        evaluationId: z.number(),
        reviewerId: z.number(),
      }))
      .mutation(async ({ ctx, input }) => {
        const assignmentId = await db.assignReviewer({
          ...input,
          status: "assigned",
        });

        await db.createAuditLog({
          userId: ctx.user.id,
          evaluationId: input.evaluationId,
          action: "REVIEWER_ASSIGNED",
          details: { reviewerId: input.reviewerId },
        });

        return { assignmentId };
      }),

    notify: protectedProcedure
      .input(z.object({
        evaluationId: z.number(),
        reviewerId: z.number(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { sendEmail } = await import("./_core/email");

        // Fetch evaluation and reviewer details
        const evaluation = await db.getEvaluationById(input.evaluationId);
        const reviewer = await db.getUserById(input.reviewerId); // Need to implement getUserById or use custom query
        // Since we don't have getUserById exposed yet, let's just do a quick fix or assume we can query users table
        // Actually, let's use a raw query or add getUserById to db.ts first? 
        // Better to rely on what we have.

        // Wait, I can't easily add a new DB function here without editing db.ts first.
        // But I can import db and maybe use a raw query if needed? No, better practice is db.ts.
        // Let's defer current implementation and just assume db.getUserById exists, 
        // OR I will add it to db.ts in next step.
        // For now, I will modify db.ts FIRST in a separate tool call if possible?
        // "getUserByOpenId" exists. "getAllUsers" exists.

        // Check if notification is enabled
        const notifyEnabled = await db.getSystemSetting("notify_on_assignment");

        if (notifyEnabled === "true" && reviewer && reviewer.email) {
          await sendEmail({
            to: reviewer.email,
            subject: "Yeni Makale Değerlendirme Görevi",
            html: `
                        <h2>Sayın ${reviewer.name || 'Hakem'},</h2>
                        <p>Size yeni bir makale değerlendirmesi atandı.</p>
                        <p><strong>Makale Başlığı:</strong> ${evaluation?.paperTitle}</p>
                        <p>Lütfen panele giriş yaparak değerlendirmeyi tamamlayınız.</p>
                        <br/>
                        <p>Saygılarımızla,<br/>Academic Impact Evaluator</p>
                    `
          });
        }

        return { success: true };
      }),

    listByEvaluation: protectedProcedure
      .input(z.object({ evaluationId: z.number() }))
      .query(async ({ input }) => {
        return await db.getReviewerAssignments(input.evaluationId);
      }),

    updateStatus: protectedProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["assigned", "in_progress", "completed"]),
      }))
      .mutation(async ({ input }) => {
        await db.updateReviewerAssignmentStatus(input.id, input.status);
        return { success: true };
      }),
  }),

  admin: router({
    listUsers: protectedProcedure
      .query(async ({ ctx }) => {
        if (ctx.user.role !== 'admin' && ctx.user.role !== 'board_chair') throw new Error("Unauthorized");
        return await db.getAllUsers();
      }),

    updateUserRole: protectedProcedure
      .input(z.object({
        userId: z.number(),
        role: z.enum(["user", "admin", "reviewer", "board_chair"]),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== 'admin') throw new Error("Unauthorized");

        await db.updateUserRole(input.userId, input.role as any);

        if (input.userId !== ctx.user.id) {
          const notifyRole = await db.getSystemSetting("notify_on_role_change");
          if (notifyRole === "true") {
            const targetUser = await db.getUserById(input.userId);
            if (targetUser && targetUser.email) {
              await sendEmail({
                to: targetUser.email,
                subject: "Kullanıcı Yetkiniz Güncellendi",
                html: `
                    <h2>Hesap Yetkiniz Değişti</h2>
                    <p>Sayın ${targetUser.name || 'Kullanıcı'},</p>
                    <p>Yönetici tarafından hesabınızın yetkisi güncellenmiştir.</p>
                    <p><strong>Yeni Rol:</strong> ${input.role}</p>
                    <p>Giriş yapmak için panele gidiniz.</p>
                   `
              });
            }
          }
        }

        await db.createAuditLog({
          userId: ctx.user.id,
          evaluationId: -1, // System audit
          action: "USER_ROLE_UPDATED",
          details: { targetUserId: input.userId, newRole: input.role },
        });

        return { success: true };
      }),

    createUser: protectedProcedure
      .input(z.object({
        name: z.string(),
        email: z.string(),
        password: z.string(),
        role: z.enum(["user", "admin", "reviewer", "board_chair"]),
        expertise: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== 'admin') throw new Error("Unauthorized");

        const existingUser = await db.getUserByEmail(input.email);
        if (existingUser) throw new Error("Bu e-posta adresi zaten kullanımda.");

        const { nanoid } = await import("nanoid");
        const openId = `admin-created-${nanoid(10)}`;

        await db.createUser({
          openId,
          name: input.name,
          email: input.email,
          password: input.password,
          role: input.role,
          expertise: input.expertise,
          loginMethod: "admin",
          lastSignedIn: new Date(),
        });

        await db.createAuditLog({
          userId: ctx.user.id,
          evaluationId: -1,
          action: "USER_CREATED_BY_ADMIN",
          details: { createdEmail: input.email, role: input.role },
        });

        return { success: true };
      }),

    updateUser: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string(),
        email: z.string().email(),
        expertise: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== 'admin') throw new Error("Unauthorized");

        await db.updateUser(input.id, {
          name: input.name,
          email: input.email,
          expertise: input.expertise,
        });

        await db.createAuditLog({
          userId: ctx.user.id,
          evaluationId: -1,
          action: "USER_UPDATED_BY_ADMIN",
          details: { targetUserId: input.id, updates: { name: input.name, email: input.email } },
        });

        return { success: true };
      }),

    resetPassword: protectedProcedure
      .input(z.object({
        id: z.number(),
        password: z.string().min(6),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== 'admin') throw new Error("Unauthorized");

        await db.updateUser(input.id, {
          password: input.password, // Ideally hash this if we used bcrypt in `createUser`
        });

        await db.createAuditLog({
          userId: ctx.user.id,
          evaluationId: -1,
          action: "USER_PASSWORD_RESET_BY_ADMIN",
          details: { targetUserId: input.id },
        });

        return { success: true };
      }),

    toggleBlock: protectedProcedure
      .input(z.object({
        id: z.number(),
        isBlocked: z.boolean(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== 'admin') throw new Error("Unauthorized");

        // Prevent blocking self
        if (input.id === ctx.user.id) throw new Error("Kendinizi engelleyemezsiniz.");

        await db.updateUserBlockStatus(input.id, input.isBlocked);

        await db.createAuditLog({
          userId: ctx.user.id,
          evaluationId: -1,
          action: input.isBlocked ? "USER_BLOCKED" : "USER_UNBLOCKED",
          details: { targetUserId: input.id },
        });

        return { success: true };
      }),

    // AI Prompt Management
    getPrompt: protectedProcedure
      .query(async ({ ctx }) => {
        // If there's an active prompt in DB, use it. Otherwise fall back to system default.
        if (ctx.user.role !== 'admin') throw new Error("Unauthorized");

        try {
          const activePrompt = await db.getActiveAiPrompt();
          if (activePrompt) {
            return activePrompt.promptText;
          }
        } catch (e) {
          console.error("Error fetching active prompt:", e);
        }

        const { generatePromptTemplate } = await import("./aiIndicatorAnalyzer");
        return generatePromptTemplate();
      }),

    savePrompt: protectedProcedure
      .input(z.object({
        promptText: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== 'admin') throw new Error("Unauthorized");

        const promptId = await db.createAiPrompt({
          promptText: input.promptText,
          isActive: true, // Auto-activate new prompt
          createdBy: ctx.user.id,
        });

        // Deactivate others? createAiPrompt doesn't handle that. 
        // We should use setActiveAiPrompt logic or handle it here.
        await db.setActiveAiPrompt(promptId as number);

        await db.createAuditLog({
          userId: ctx.user.id,
          evaluationId: -1,
          action: "AI_PROMPT_UPDATED",
          details: { promptId },
        });

        return { success: true, promptId };
      }),

    getPromptHistory: protectedProcedure
      .query(async ({ ctx }) => {
        if (ctx.user.role !== 'admin') throw new Error("Unauthorized");
        const history = await db.getAiPromptHistory();
        // Enrich with creator info? Ideally yes, but let's just return IDs for now.
        // We need creator names. 
        const users = await db.getAllUsers();
        const userMap = new Map(users.map(u => [u.id, u.name]));

        return history.map(h => ({
          ...h,
          creatorName: userMap.get(h.createdBy) || "Unknown",
        }));
      }),

    setActivePrompt: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== 'admin') throw new Error("Unauthorized");
        await db.setActiveAiPrompt(input.id);

        await db.createAuditLog({
          userId: ctx.user.id,
          evaluationId: -1,
          action: "AI_PROMPT_ACTIVATED",
          details: { promptId: input.id },
        });
        return { success: true };
      }),

    deletePrompt: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== 'admin') throw new Error("Unauthorized");

        const active = await db.getActiveAiPrompt();
        if (active && active.id === input.id) {
          throw new Error("Aktif prompt silinemez. Önce başka bir versiyonu aktif yapın.");
        }

        await db.deleteAiPrompt(input.id);
        return { success: true };
      }),

    getSettings: protectedProcedure
      .query(async ({ ctx }) => {
        if (ctx.user.role !== 'admin') throw new Error("Unauthorized");
        return await db.getSystemSettings();
      }),

    updateSetting: protectedProcedure
      .input(z.object({
        key: z.string(),
        value: z.string(),
        description: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== 'admin') throw new Error("Unauthorized");

        await db.updateSystemSetting(input.key, input.value, input.description);

        await db.createAuditLog({
          userId: ctx.user.id,
          evaluationId: -1,
          action: "SYSTEM_SETTING_UPDATED",
          details: { key: input.key },
        });

        return { success: true };
      }),
  }),

  audit: router({
    list: protectedProcedure
      .input(z.object({ evaluationId: z.number().optional() }))
      .query(async ({ input }) => {
        return await db.getAuditLogs(input.evaluationId);
      }),
  }),
});

export type AppRouter = typeof appRouter;
