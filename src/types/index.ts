export type PricingStatus = 'FREE' | 'FREEMIUM' | 'FREE_TRIAL' | 'PAID' | 'NOT_VERIFIED';

export type VerificationStatus = 'VERIFIED' | 'NEEDS_REVIEW' | 'UNVERIFIED' | 'ARCHIVED';

export type DifficultyLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

export type Role = 'USER' | 'REVIEWER' | 'EDITOR' | 'ADMIN' | 'SUPER_ADMIN';

export interface ToolItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  categoryId?: string;
  subcategory?: string;
  officialUrl: string;
  logoUrl?: string;
  features: string[];
  useCases: string[];
  pricingStatus: PricingStatus;
  freeAvailability: string;
  platforms: string[]; // e.g., ["Browser", "Desktop", "Mobile", "API"]
  apiAvailability: boolean;
  commercialUse: string; // "Verified", "Prohibited", "Not Verified", "Paid Tiers Only"
  limitations: string;
  editorialNotes: string;
  sourceUrl: string;
  lastVerifiedAt: string;
  verificationStatus: VerificationStatus;
  verificationSourceType: string;
  affiliateUrl?: string;
  affiliateStatus: 'ACTIVE' | 'NONE' | 'INACTIVE';
  affiliateProgram?: string;
  isFeatured?: boolean;
  viewsCount?: number;
}

export interface WorkflowStepItem {
  stepNumber: number;
  title: string;
  explanation: string;
  action: string;
  recommendedToolName: string;
  recommendedToolSlug?: string;
  alternativeTools: string[];
  whyItHelps: string;
  officialSiteUrl?: string;
  relatedTutorial?: string;
  estimatedTime: string;
  promptTemplate?: string;
}

export interface WorkflowItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  difficulty: DifficultyLevel;
  estimatedTime: string;
  targetAudience: string;
  goals: string[];
  prerequisites: string[];
  lastReviewedAt: string;
  steps: WorkflowStepItem[];
}

export interface UseCaseItem {
  id: string;
  title: string;
  slug: string;
  targetRole: string;
  summary: string;
  problems: string[];
  opportunities: string[];
  practicalSolutions: string[];
  relatedTools: string[]; // tool slugs
  relatedWorkflows: string[]; // workflow slugs
}

export interface GuideItem {
  id: string;
  title: string;
  slug: string;
  intro: string;
  content: string; // Markdown or rich text
  tableOfContents: { title: string; anchor: string }[];
  practicalSteps: string[];
  difficulty: DifficultyLevel;
  estimatedReadTime: string;
  authorName: string;
  reviewerName: string;
  lastReviewedAt: string;
}

export interface ComparisonItem {
  id: string;
  slug: string;
  title: string;
  toolASlug: string;
  toolAName: string;
  toolBSlug: string;
  toolBName: string;
  summary: string;
  keyDifferences: string[];
  strengthsA: string[];
  strengthsB: string[];
  limitationsA: string[];
  limitationsB: string[];
  verdict: string;
}

export interface AiServiceInputField {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'select';
  placeholder: string;
  required: boolean;
  options?: string[];
}

export interface AiServiceItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  inputFields: AiServiceInputField[];
  rateLimitMinutes: number;
  tokenCeiling: number;
}

export interface GoalAnalysisResult {
  understoodGoal: string;
  category: string;
  subcategory?: string;
  experienceLevel: string;
  taskType: string;
  requiredCapabilities: string[];
  possibleSubtasks: string[];
  workflow: {
    title: string;
    steps: {
      stepNumber: number;
      title: string;
      action: string;
      toolName?: string;
      isFree: boolean;
    }[];
  };
  recommendedTools: ToolItem[];
  freeOptions: ToolItem[];
  relatedGuides: { title: string; slug: string; readTime: string }[];
  builtInServices: { name: string; slug: string; description: string }[];
}

export interface UserSession {
  id: string;
  email: string;
  name?: string;
  role: Role;
  emailVerified: boolean;
  isActive: boolean;
  createdAt?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  role: Role;
  emailVerified: boolean;
  emailVerifiedAt?: string;
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLogItem {
  id: string;
  adminId?: string;
  adminEmail?: string;
  action: string;
  entityType: string;
  entityId?: string;
  details?: string;
  previousValue?: string;
  newValue?: string;
  ipAddress?: string;
  createdAt: string;
}
