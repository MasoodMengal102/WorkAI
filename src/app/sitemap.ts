import { MetadataRoute } from "next";
import { BRAND } from "@/config/brand";
import { dataService } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [tools, workflows, guides, comparisons, useCases, categories, services] = await Promise.all([
    dataService.getTools(),
    dataService.getWorkflows(),
    dataService.getGuides(),
    dataService.getComparisons(),
    dataService.getUseCases(),
    dataService.getCategories(),
    dataService.getAiServices(),
  ]);

  const baseUrl = BRAND.domain;
  const now = new Date();

  // Core public static pages
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/ai-finder`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/tools`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/workflows`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/ai-services`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/use-cases`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/guides`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/compare`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/search`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/privacy`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${baseUrl}/terms`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${baseUrl}/cookie-policy`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${baseUrl}/affiliate-disclosure`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${baseUrl}/disclaimer`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${baseUrl}/ai-policy`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
  ];

  // Tool Detail Pages (50+)
  const toolRoutes: MetadataRoute.Sitemap = tools.map((t) => ({
    url: `${baseUrl}/tools/${t.slug}`,
    lastModified: new Date(t.lastVerifiedAt || now),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Workflow Pages (20+)
  const workflowRoutes: MetadataRoute.Sitemap = workflows.map((w) => ({
    url: `${baseUrl}/workflows/${w.slug}`,
    lastModified: new Date(w.lastReviewedAt || now),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Guide Pages (20+)
  const guideRoutes: MetadataRoute.Sitemap = guides.map((g) => ({
    url: `${baseUrl}/guides/${g.slug}`,
    lastModified: new Date(g.lastReviewedAt || now),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Comparison Pages (10+)
  const comparisonRoutes: MetadataRoute.Sitemap = comparisons.map((c) => ({
    url: `${baseUrl}/compare/${c.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // Use Case Pages (15+)
  const useCaseRoutes: MetadataRoute.Sitemap = useCases.map((uc) => ({
    url: `${baseUrl}/use-cases/${uc.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // Category Pages (21)
  const categoryRoutes: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${baseUrl}/categories/${cat.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  // Free AI Service Pages (15)
  const serviceRoutes: MetadataRoute.Sitemap = services.map((srv) => ({
    url: `${baseUrl}/ai-services/${srv.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    ...staticRoutes,
    ...toolRoutes,
    ...workflowRoutes,
    ...guideRoutes,
    ...comparisonRoutes,
    ...useCaseRoutes,
    ...categoryRoutes,
    ...serviceRoutes,
  ];
}
