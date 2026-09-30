import { PrismaClient } from "@prisma/client";
import { TOOLS } from "@/data/tools";
import { WORKFLOWS } from "@/data/workflows";
import { USE_CASES } from "@/data/use-cases";
import { GUIDES } from "@/data/guides";
import { COMPARISONS } from "@/data/comparisons";
import { CATEGORIES } from "@/data/categories";
import { AI_SERVICES } from "@/data/ai-services";
import { ToolItem, WorkflowItem, UseCaseItem, GuideItem, ComparisonItem, Role } from "@/types";

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
  users: [] as any[],
  sessions: [] as any[],
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

  async recordAuditLog(data: { adminId?: string; action: string; entityType: string; entityId?: string; details?: string; previousValue?: string; newValue?: string; ipAddress?: string }) {
    try {
      if (isDbAvailable()) {
        return await prisma.auditLog.create({ data });
      }
    } catch {
      markDbUnavailable();
    }
    inMemoryStore.auditLogs.unshift({ id: `audit-${Date.now()}`, ...data, createdAt: new Date() });
  },

  async getAuditLogs(limit = 50) {
    try {
      if (isDbAvailable()) {
        return await prisma.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: limit, include: { admin: { select: { email: true, name: true } } } });
      }
    } catch {
      markDbUnavailable();
    }
    return inMemoryStore.auditLogs.slice(0, limit);
  },

  // User Authentication & Management
  async createUser(data: {
    email: string;
    passwordHash: string;
    name?: string;
    role?: Role;
    emailVerified?: boolean;
    verificationToken?: string | null;
    verificationExpiresAt?: Date | null;
  }) {
    const cleanEmail = data.email.toLowerCase().trim();
    try {
      if (isDbAvailable()) {
        const user = await prisma.user.create({
          data: {
            email: cleanEmail,
            passwordHash: data.passwordHash,
            name: data.name?.trim() || null,
            role: data.role || "USER",
            emailVerified: data.emailVerified ?? false,
            verificationToken: data.verificationToken || null,
            verificationExpiresAt: data.verificationExpiresAt || null,
            isActive: true,
          },
        });
        return user;
      }
    } catch {
      markDbUnavailable();
    }
    const user = {
      id: `usr-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      email: cleanEmail,
      passwordHash: data.passwordHash,
      name: data.name?.trim() || null,
      role: data.role || "USER",
      emailVerified: data.emailVerified ?? false,
      emailVerifiedAt: data.emailVerified ? new Date() : null,
      verificationToken: data.verificationToken || null,
      verificationExpiresAt: data.verificationExpiresAt || null,
      passwordResetToken: null,
      passwordResetExpiresAt: null,
      isActive: true,
      lastLoginAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    inMemoryStore.users.push(user);
    return user;
  },

  async getUserByEmail(email: string) {
    const cleanEmail = email.toLowerCase().trim();
    try {
      if (isDbAvailable()) {
        return await prisma.user.findUnique({ where: { email: cleanEmail } });
      }
    } catch {
      markDbUnavailable();
    }
    return inMemoryStore.users.find((u) => u.email.toLowerCase() === cleanEmail) || null;
  },

  async getUserById(id: string) {
    try {
      if (isDbAvailable()) {
        return await prisma.user.findUnique({ where: { id } });
      }
    } catch {
      markDbUnavailable();
    }
    return inMemoryStore.users.find((u) => u.id === id) || null;
  },

  async getUserByVerificationToken(token: string) {
    if (!token) return null;
    try {
      if (isDbAvailable()) {
        return await prisma.user.findUnique({ where: { verificationToken: token } });
      }
    } catch {
      markDbUnavailable();
    }
    return inMemoryStore.users.find((u) => u.verificationToken === token) || null;
  },

  async getUserByPasswordResetToken(token: string) {
    if (!token) return null;
    try {
      if (isDbAvailable()) {
        return await prisma.user.findUnique({ where: { passwordResetToken: token } });
      }
    } catch {
      markDbUnavailable();
    }
    return inMemoryStore.users.find((u) => u.passwordResetToken === token) || null;
  },

  async updateUser(id: string, data: any) {
    try {
      if (isDbAvailable()) {
        return await prisma.user.update({ where: { id }, data });
      }
    } catch {
      markDbUnavailable();
    }
    const idx = inMemoryStore.users.findIndex((u) => u.id === id);
    if (idx !== -1) {
      inMemoryStore.users[idx] = { ...inMemoryStore.users[idx], ...data, updatedAt: new Date() };
      return inMemoryStore.users[idx];
    }
    return null;
  },

  async verifyUserEmail(token: string): Promise<{ success: boolean; error?: string }> {
    const user = await this.getUserByVerificationToken(token);
    if (!user) {
      return { success: false, error: "Invalid or already used verification link." };
    }
    if (user.verificationExpiresAt && new Date(user.verificationExpiresAt) < new Date()) {
      return { success: false, error: "This verification link has expired. Please request a new one." };
    }

    await this.updateUser(user.id, {
      emailVerified: true,
      emailVerifiedAt: new Date(),
      verificationToken: null,
      verificationExpiresAt: null,
    });
    return { success: true };
  },

  async setPasswordResetToken(email: string, token: string, expiresAt: Date) {
    const user = await this.getUserByEmail(email);
    if (!user) return null;

    return await this.updateUser(user.id, {
      passwordResetToken: token,
      passwordResetExpiresAt: expiresAt,
    });
  },

  async resetPassword(token: string, newPasswordHash: string): Promise<{ success: boolean; error?: string }> {
    const user = await this.getUserByPasswordResetToken(token);
    if (!user) {
      return { success: false, error: "Invalid or expired password reset link." };
    }
    if (user.passwordResetExpiresAt && new Date(user.passwordResetExpiresAt) < new Date()) {
      return { success: false, error: "This password reset link has expired. Please request a new link." };
    }

    await this.updateUser(user.id, {
      passwordHash: newPasswordHash,
      passwordResetToken: null,
      passwordResetExpiresAt: null,
    });
    await this.deleteUserSessions(user.id);
    return { success: true };
  },

  async deleteUser(userId: string) {
    try {
      if (isDbAvailable()) {
        await prisma.user.delete({ where: { id: userId } });
        return true;
      }
    } catch {
      markDbUnavailable();
    }
    inMemoryStore.users = inMemoryStore.users.filter((u) => u.id !== userId);
    inMemoryStore.sessions = inMemoryStore.sessions.filter((s) => s.userId !== userId);
    for (const fav of Array.from(inMemoryStore.favorites)) {
      if (fav.startsWith(`${userId}:`)) inMemoryStore.favorites.delete(fav);
    }
    for (const sw of Array.from(inMemoryStore.savedWorkflows)) {
      if (sw.startsWith(`${userId}:`)) inMemoryStore.savedWorkflows.delete(sw);
    }
    inMemoryStore.generations = inMemoryStore.generations.filter((g) => g.userId !== userId);
    return true;
  },

  async getAllUsers() {
    try {
      if (isDbAvailable()) {
        return await prisma.user.findMany({
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            emailVerified: true,
            emailVerifiedAt: true,
            isActive: true,
            lastLoginAt: true,
            createdAt: true,
            updatedAt: true,
          },
          orderBy: { createdAt: "desc" },
        });
      }
    } catch {
      markDbUnavailable();
    }
    return inMemoryStore.users.map(({ passwordHash, verificationToken, passwordResetToken, ...safeUser }) => safeUser);
  },

  // Sessions
  async createSession(data: { userId: string; token: string; expiresAt: Date; ipAddress?: string; userAgent?: string }) {
    try {
      if (isDbAvailable()) {
        return await prisma.session.create({ data });
      }
    } catch {
      markDbUnavailable();
    }
    const session = { id: `sess-${Date.now()}`, ...data, createdAt: new Date() };
    inMemoryStore.sessions.push(session);
    return session;
  },

  async getSession(token: string) {
    try {
      if (isDbAvailable()) {
        return await prisma.session.findUnique({ where: { token }, include: { user: true } });
      }
    } catch {
      markDbUnavailable();
    }
    const s = inMemoryStore.sessions.find((sess) => sess.token === token);
    if (!s) return null;
    const user = inMemoryStore.users.find((u) => u.id === s.userId);
    return { ...s, user: user || null };
  },

  async deleteSession(token: string) {
    try {
      if (isDbAvailable()) {
        await prisma.session.delete({ where: { token } });
        return true;
      }
    } catch {
      markDbUnavailable();
    }
    inMemoryStore.sessions = inMemoryStore.sessions.filter((s) => s.token !== token);
    return true;
  },

  async deleteUserSessions(userId: string) {
    try {
      if (isDbAvailable()) {
        await prisma.session.deleteMany({ where: { userId } });
        return true;
      }
    } catch {
      markDbUnavailable();
    }
    inMemoryStore.sessions = inMemoryStore.sessions.filter((s) => s.userId !== userId);
    return true;
  },

  // User Favorites & Workflows (Ownership Protected)
  async getUserFavorites(userId: string) {
    try {
      if (isDbAvailable()) {
        const favs = await prisma.favorite.findMany({
          where: { userId },
          include: { tool: true },
          orderBy: { createdAt: "desc" },
        });
        return favs.map((f) => f.tool);
      }
    } catch {
      markDbUnavailable();
    }
    const toolIds: string[] = [];
    for (const entry of Array.from(inMemoryStore.favorites)) {
      if (entry.startsWith(`${userId}:`)) {
        toolIds.push(entry.split(":")[1]);
      }
    }
    const allTools = await this.getTools();
    return allTools.filter((t) => toolIds.includes(t.id));
  },

  async toggleFavorite(userId: string, toolId: string) {
    const key = `${userId}:${toolId}`;
    try {
      if (isDbAvailable()) {
        const existing = await prisma.favorite.findUnique({ where: { userId_toolId: { userId, toolId } } });
        if (existing) {
          await prisma.favorite.delete({ where: { id: existing.id } });
          return { isFavorite: false };
        } else {
          await prisma.favorite.create({ data: { userId, toolId } });
          return { isFavorite: true };
        }
      }
    } catch {
      markDbUnavailable();
    }
    if (inMemoryStore.favorites.has(key)) {
      inMemoryStore.favorites.delete(key);
      return { isFavorite: false };
    } else {
      inMemoryStore.favorites.add(key);
      return { isFavorite: true };
    }
  },

  async getUserSavedWorkflows(userId: string) {
    try {
      if (isDbAvailable()) {
        const saved = await prisma.savedWorkflow.findMany({
          where: { userId },
          include: { workflow: true },
          orderBy: { createdAt: "desc" },
        });
        return saved.map((s) => s.workflow);
      }
    } catch {
      markDbUnavailable();
    }
    const workflowIds: string[] = [];
    for (const entry of Array.from(inMemoryStore.savedWorkflows)) {
      if (entry.startsWith(`${userId}:`)) {
        workflowIds.push(entry.split(":")[1]);
      }
    }
    const allWorkflows = await this.getWorkflows();
    return allWorkflows.filter((w) => workflowIds.includes(w.id));
  },

  async toggleSavedWorkflow(userId: string, workflowId: string) {
    const key = `${userId}:${workflowId}`;
    try {
      if (isDbAvailable()) {
        const existing = await prisma.savedWorkflow.findUnique({ where: { userId_workflowId: { userId, workflowId } } });
        if (existing) {
          await prisma.savedWorkflow.delete({ where: { id: existing.id } });
          return { isSaved: false };
        } else {
          await prisma.savedWorkflow.create({ data: { userId, workflowId } });
          return { isSaved: true };
        }
      }
    } catch {
      markDbUnavailable();
    }
    if (inMemoryStore.savedWorkflows.has(key)) {
      inMemoryStore.savedWorkflows.delete(key);
      return { isSaved: false };
    } else {
      inMemoryStore.savedWorkflows.add(key);
      return { isSaved: true };
    }
  },

  async getUserGenerations(userId: string) {
    try {
      if (isDbAvailable()) {
        return await prisma.aiGeneration.findMany({
          where: { userId },
          orderBy: { createdAt: "desc" },
          take: 50,
        });
      }
    } catch {
      markDbUnavailable();
    }
    return inMemoryStore.generations.filter((g) => g.userId === userId);
  },

  async recordGeneration(data: {
    userId?: string;
    serviceSlug: string;
    inputParams: string;
    generatedContent: string;
    tokensUsed: number;
    provider: string;
    model: string;
    latencyMs: number;
  }) {
    try {
      if (isDbAvailable()) {
        return await prisma.aiGeneration.create({ data });
      }
    } catch {
      markDbUnavailable();
    }
    const gen = { id: `gen-${Date.now()}`, ...data, createdAt: new Date() };
    inMemoryStore.generations.unshift(gen);
    return gen;
  },

  async deleteUserGeneration(userId: string, generationId: string) {
    try {
      if (isDbAvailable()) {
        await prisma.aiGeneration.deleteMany({ where: { id: generationId, userId } });
        return true;
      }
    } catch {
      markDbUnavailable();
    }
    inMemoryStore.generations = inMemoryStore.generations.filter((g) => !(g.id === generationId && g.userId === userId));
    return true;
  },

  async clearUserGenerations(userId: string) {
    try {
      if (isDbAvailable()) {
        await prisma.aiGeneration.deleteMany({ where: { userId } });
        return true;
      }
    } catch {
      markDbUnavailable();
    }
    inMemoryStore.generations = inMemoryStore.generations.filter((g) => g.userId !== userId);
    return true;
  },
};
