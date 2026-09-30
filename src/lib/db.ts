import { PrismaClient } from "@prisma/client";
import { TOOLS } from "@/data/tools";
import { WORKFLOWS } from "@/data/workflows";
import { USE_CASES } from "@/data/use-cases";
import { GUIDES } from "@/data/guides";
import { COMPARISONS } from "@/data/comparisons";
import { CATEGORIES } from "@/data/categories";
import { AI_SERVICES } from "@/data/ai-services";
import { ToolItem, WorkflowItem, UseCaseItem, GuideItem, ComparisonItem } from "@/types";

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: PrismaClient | undefined;
}

export const prisma =
  globalThis.prismaGlobal ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = prisma;
}

// In-memory fallback stores for when DB is not yet connected during local dev/tests
const inMemoryStore = {
  feedbacks: [] as any[],
  contactMessages: [] as any[],
  usageLogs: [] as any[],
  auditLogs: [] as any[],
  systemAlerts: [] as any[],
  favorites: new Set<string>(), // "userId:toolId"
  savedWorkflows: new Set<string>(), // "userId:workflowId"
  generations: [] as any[],
};

let dbUnavailableUntil = 0;

function isDbAvailable(): boolean {
  if (!process.env.DATABASE_URL) return false;
  return Date.now() > dbUnavailableUntil;
}

function markDbUnavailable(): void {
  dbUnavailableUntil = Date.now() + 60000;
}

/**
 * Robust Data Access Service:
 * Connects to PostgreSQL via Prisma when available, and seamlessly
 * falls back to verified dataset records if the database is unreachable or offline.
 */
export const dataService = {
  // Tools
  async getTools(): Promise<ToolItem[]> {
    try {
      if (isDbAvailable()) {
        const dbTools = await prisma.tool.findMany({
          orderBy: { name: "asc" },
        });
        if (dbTools && dbTools.length > 0) {
          return dbTools.map((t) => ({
            id: t.id,
            name: t.name,
            slug: t.slug,
            description: t.description,
            category: t.categoryId,
            subcategory: t.subcategory || undefined,
            officialUrl: t.officialUrl,
            logoUrl: t.logoUrl || undefined,
            features: JSON.parse(t.features || "[]"),
            useCases: JSON.parse(t.useCases || "[]"),
            pricingStatus: t.pricingStatus as any,
            freeAvailability: t.freeAvailability,
            platforms: JSON.parse(t.platforms || "[]"),
            apiAvailability: t.apiAvailability,
            commercialUse: t.commercialUse,
            limitations: t.limitations,
            editorialNotes: t.editorialNotes,
            sourceUrl: t.sourceUrl,
            lastVerifiedAt: t.lastVerifiedAt.toISOString().split("T")[0],
            verificationStatus: t.verificationStatus as any,
            verificationSourceType: t.verificationSourceType,
            affiliateUrl: t.affiliateUrl || undefined,
            affiliateStatus: t.affiliateStatus as any,
            affiliateProgram: t.affiliateProgram || undefined,
            isFeatured: t.isFeatured,
            viewsCount: t.viewsCount,
          }));
        }
      }
    } catch {
      markDbUnavailable();
    }
    return TOOLS;
  },

  async getToolBySlug(slug: string): Promise<ToolItem | null> {
    try {
      if (isDbAvailable()) {
        const t = await prisma.tool.findUnique({
          where: { slug },
        });
        if (t) {
          return {
            id: t.id,
            name: t.name,
            slug: t.slug,
            description: t.description,
            category: t.categoryId,
            subcategory: t.subcategory || undefined,
            officialUrl: t.officialUrl,
            logoUrl: t.logoUrl || undefined,
            features: JSON.parse(t.features || "[]"),
            useCases: JSON.parse(t.useCases || "[]"),
            pricingStatus: t.pricingStatus as any,
            freeAvailability: t.freeAvailability,
            platforms: JSON.parse(t.platforms || "[]"),
            apiAvailability: t.apiAvailability,
            commercialUse: t.commercialUse,
            limitations: t.limitations,
            editorialNotes: t.editorialNotes,
            sourceUrl: t.sourceUrl,
            lastVerifiedAt: t.lastVerifiedAt.toISOString().split("T")[0],
            verificationStatus: t.verificationStatus as any,
            verificationSourceType: t.verificationSourceType,
            affiliateUrl: t.affiliateUrl || undefined,
            affiliateStatus: t.affiliateStatus as any,
            affiliateProgram: t.affiliateProgram || undefined,
            isFeatured: t.isFeatured,
            viewsCount: t.viewsCount,
          };
        }
      }
    } catch {
      markDbUnavailable();
    }
    const found = TOOLS.find((tool) => tool.slug === slug);
    return found || null;
  },

  // Workflows
  async getWorkflows(): Promise<WorkflowItem[]> {
    try {
      if (isDbAvailable()) {
        const list = await prisma.workflow.findMany({
          include: { steps: { orderBy: { stepNumber: "asc" } } },
          orderBy: { title: "asc" },
        });
        if (list && list.length > 0) {
          return list.map((w) => ({
            id: w.id,
            title: w.title,
            slug: w.slug,
            description: w.description,
            category: w.category,
            difficulty: w.difficulty as any,
            estimatedTime: w.estimatedTime,
            targetAudience: w.targetAudience,
            goals: JSON.parse(w.goals || "[]"),
            prerequisites: JSON.parse(w.prerequisites || "[]"),
            lastReviewedAt: w.lastReviewedAt.toISOString().split("T")[0],
            steps: w.steps.map((s) => ({
              stepNumber: s.stepNumber,
              title: s.title,
              explanation: s.explanation,
              action: s.action,
              recommendedToolName: s.recommendedToolId || "",
              alternativeTools: JSON.parse(s.alternativeTools || "[]"),
              whyItHelps: s.whyItHelps,
              officialSiteUrl: s.officialSiteUrl || undefined,
              relatedTutorial: s.relatedTutorial || undefined,
              estimatedTime: s.estimatedTime,
              promptTemplate: s.promptTemplate || undefined,
            })),
          }));
        }
      }
    } catch {
      markDbUnavailable();
    }
    return WORKFLOWS;
  },

  async getWorkflowBySlug(slug: string): Promise<WorkflowItem | null> {
    try {
      if (isDbAvailable()) {
        const w = await prisma.workflow.findUnique({
          where: { slug },
          include: { steps: { orderBy: { stepNumber: "asc" } } },
        });
        if (w) {
          return {
            id: w.id,
            title: w.title,
            slug: w.slug,
            description: w.description,
            category: w.category,
            difficulty: w.difficulty as any,
            estimatedTime: w.estimatedTime,
            targetAudience: w.targetAudience,
            goals: JSON.parse(w.goals || "[]"),
            prerequisites: JSON.parse(w.prerequisites || "[]"),
            lastReviewedAt: w.lastReviewedAt.toISOString().split("T")[0],
            steps: w.steps.map((s) => ({
              stepNumber: s.stepNumber,
              title: s.title,
              explanation: s.explanation,
              action: s.action,
              recommendedToolName: s.recommendedToolId || "",
              alternativeTools: JSON.parse(s.alternativeTools || "[]"),
              whyItHelps: s.whyItHelps,
              officialSiteUrl: s.officialSiteUrl || undefined,
              relatedTutorial: s.relatedTutorial || undefined,
              estimatedTime: s.estimatedTime,
              promptTemplate: s.promptTemplate || undefined,
            })),
          };
        }
      }
    } catch {
      markDbUnavailable();
    }
    const found = WORKFLOWS.find((w) => w.slug === slug);
    return found || null;
  },

  // Use Cases
  async getUseCases(): Promise<UseCaseItem[]> {
    return USE_CASES;
  },

  async getUseCaseBySlug(slug: string): Promise<UseCaseItem | null> {
    const found = USE_CASES.find((uc) => uc.slug === slug);
    return found || null;
  },

  // Guides
  async getGuides(): Promise<GuideItem[]> {
    return GUIDES;
  },

  async getGuideBySlug(slug: string): Promise<GuideItem | null> {
    const found = GUIDES.find((g) => g.slug === slug);
    return found || null;
  },

  // Comparisons
  async getComparisons(): Promise<ComparisonItem[]> {
    return COMPARISONS;
  },

  async getComparisonBySlug(slug: string): Promise<ComparisonItem | null> {
    const found = COMPARISONS.find((c) => c.slug === slug);
    return found || null;
  },

  // Categories
  async getCategories() {
    return CATEGORIES;
  },

  // AI Services
  async getAiServices() {
    return AI_SERVICES;
  },

  async getAiServiceBySlug(slug: string) {
    return AI_SERVICES.find((s) => s.slug === slug) || null;
  },

  // Feedback & Contact
  async recordFeedback(data: {
    pagePath: string;
    isHelpful: boolean;
    entityType?: string;
    entityId?: string;
    message?: string;
    ipHash?: string;
    userId?: string;
  }) {
    try {
      if (isDbAvailable()) {
        return await prisma.feedback.create({ data });
      }
    } catch {
      markDbUnavailable();
    }
    const entry = { id: `fb-${Date.now()}`, ...data, createdAt: new Date() };
    inMemoryStore.feedbacks.unshift(entry);
    return entry;
  },

  async recordContact(data: { name: string; email: string; subject: string; message: string; ipHash?: string }) {
    try {
      if (isDbAvailable()) {
        return await prisma.contactMessage.create({ data });
      }
    } catch {
      markDbUnavailable();
    }
    const entry = { id: `contact-${Date.now()}`, ...data, isRead: false, createdAt: new Date() };
    inMemoryStore.contactMessages.unshift(entry);
    return entry;
  },

  async recordUsageLog(data: { endpoint: string; provider: string; model: string; tokensEstimated: number; costEstimated: number; status: string; latencyMs: number; ipHash?: string }) {
    try {
      if (isDbAvailable()) {
        return await prisma.usageLog.create({ data });
      }
    } catch {
      markDbUnavailable();
    }
    inMemoryStore.usageLogs.unshift({ id: `log-${Date.now()}`, ...data, createdAt: new Date() });
  },

  async getUsageLogs() {
    try {
      if (isDbAvailable()) {
        return await prisma.usageLog.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
      }
    } catch {
      markDbUnavailable();
    }
    return inMemoryStore.usageLogs;
  },

  async recordAuditLog(data: { adminId?: string; action: string; entityType: string; entityId?: string; previousValue?: string; newValue?: string; ipAddress?: string }) {
    try {
      if (isDbAvailable()) {
        return await prisma.auditLog.create({ data });
      }
    } catch {
      markDbUnavailable();
    }
    inMemoryStore.auditLogs.unshift({ id: `audit-${Date.now()}`, ...data, createdAt: new Date() });
  },

  async getAuditLogs() {
    try {
      if (isDbAvailable()) {
        return await prisma.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 50 });
      }
    } catch {
      markDbUnavailable();
    }
    return inMemoryStore.auditLogs;
  },
};
