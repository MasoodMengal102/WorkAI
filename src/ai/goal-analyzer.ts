import { GoalAnalysisResult, ToolItem, WorkflowItem, GuideItem } from "@/types";
import { dataService } from "@/lib/db";
import { executeAI } from "./factory";
import { AI_SERVICES } from "@/data/ai-services";

/**
 * Deterministic Goal Analyzer and Intent Engine.
 * 
 * Complies strictly with Requirement 14 & 83:
 * - Does NOT allow the LLM to invent tool data.
 * - Intent extraction turns user input into a structured goal object.
 * - Tool recommendations and workflows are queried deterministically from the verified database.
 * - Works 100% reliably even when AI API keys are not configured.
 */
export async function analyzeUserGoal(userInput: string, ipHash?: string): Promise<GoalAnalysisResult> {
  const query = userInput.toLowerCase().trim();
  const allTools = await dataService.getTools();
  const allWorkflows = await dataService.getWorkflows();
  const allGuides = await dataService.getGuides();

  // 1. Detect Category, Task Type & Experience Level deterministically
  let detectedCategory = "Productivity";
  let subcategory = "General Automation";
  let taskType = "Workflow Construction";
  let experienceLevel = "Beginner to Intermediate";

  if (query.includes("youtube") || query.includes("video") || query.includes("shorts") || query.includes("tiktok") || query.includes("b-roll")) {
    detectedCategory = "video";
    subcategory = query.includes("faceless") ? "Faceless Video Automation" : "Video Content Creation";
    taskType = "Video Production Pipeline";
  } else if (query.includes("cv") || query.includes("resume") || query.includes("cover letter") || query.includes("interview") || query.includes("job")) {
    detectedCategory = "career";
    subcategory = "Resume & Career Advancement";
    taskType = "Job Search Optimization";
  } else if (query.includes("code") || query.includes("programming") || query.includes("python") || query.includes("website") || query.includes("developer") || query.includes("react")) {
    detectedCategory = "coding";
    subcategory = "Software Development";
    taskType = "Code Acceleration & Learning";
  } else if (query.includes("study") || query.includes("exam") || query.includes("quiz") || query.includes("school") || query.includes("student") || query.includes("homework")) {
    detectedCategory = "education";
    subcategory = "Active Recall & Revision";
    taskType = "Academic Learning";
  } else if (query.includes("research") || query.includes("paper") || query.includes("academic") || query.includes("literature") || query.includes("thesis")) {
    detectedCategory = "research";
    subcategory = "Scientific Literature Review";
    taskType = "Evidence Synthesis";
  } else if (query.includes("write") || query.includes("blog") || query.includes("essay") || query.includes("copy") || query.includes("article")) {
    detectedCategory = "writing";
    subcategory = "Editorial & Copywriting";
    taskType = "Content Generation";
  } else if (query.includes("music") || query.includes("song") || query.includes("audio") || query.includes("podcast")) {
    detectedCategory = "music";
    subcategory = "Audio & Music Synthesis";
    taskType = "Audio Production";
  } else if (query.includes("image") || query.includes("draw") || query.includes("logo") || query.includes("art") || query.includes("photo") || query.includes("vector")) {
    detectedCategory = "image-generation";
    subcategory = "Visual Asset Generation";
    taskType = "Creative Design";
  } else if (query.includes("freelance") || query.includes("client") || query.includes("business") || query.includes("agency")) {
    detectedCategory = "business";
    subcategory = "Freelance Client Acceleration";
    taskType = "Client Delivery Pipeline";
  }

  // 2. Find matching Workflow from verified database
  let matchedWorkflow: WorkflowItem | undefined;
  if (query.includes("faceless")) {
    matchedWorkflow = allWorkflows.find((w) => w.slug === "create-faceless-youtube-video");
  } else if (query.includes("youtube") || query.includes("video")) {
    matchedWorkflow = allWorkflows.find((w) => w.slug === "create-youtube-video-with-ai");
  } else if (query.includes("resume") || query.includes("cv")) {
    matchedWorkflow = allWorkflows.find((w) => w.slug === "create-professional-cv-with-ai");
  } else if (query.includes("cover letter")) {
    matchedWorkflow = allWorkflows.find((w) => w.slug === "create-cover-letter-with-ai");
  } else if (query.includes("learn") && (query.includes("code") || query.includes("python") || query.includes("program"))) {
    matchedWorkflow = allWorkflows.find((w) => w.slug === "learn-programming-with-ai");
  } else if (query.includes("website") || query.includes("web app")) {
    matchedWorkflow = allWorkflows.find((w) => w.slug === "build-website-with-ai");
  } else if (query.includes("study") || query.includes("exam")) {
    matchedWorkflow = allWorkflows.find((w) => w.slug === "master-exam-prep-with-ai");
  } else if (query.includes("freelanc")) {
    matchedWorkflow = allWorkflows.find((w) => w.slug === "start-freelancing-with-ai");
  } else if (query.includes("podcast")) {
    matchedWorkflow = allWorkflows.find((w) => w.slug === "create-podcast-with-ai");
  } else if (query.includes("offline") || query.includes("private") || query.includes("local")) {
    matchedWorkflow = allWorkflows.find((w) => w.slug === "setup-private-offline-ai");
  } else {
    // Category match
    matchedWorkflow = allWorkflows.find((w) => w.category.toLowerCase().includes(detectedCategory)) || allWorkflows[0];
  }

  // 3. Filter & Rank Verified Tools for this Goal
  const candidateTools = allTools.filter((tool) => {
    if (tool.category === detectedCategory) return true;
    const textCorpus = `${tool.name} ${tool.description} ${tool.features.join(" ")} ${tool.useCases.join(" ")}`.toLowerCase();
    const queryTokens = query.split(/\s+/).filter((t) => t.length > 3);
    return queryTokens.some((token) => textCorpus.includes(token));
  });

  // Rank candidate tools: featured, verified status, free tier presence
  const sortedTools = [...candidateTools].sort((a, b) => {
    let scoreA = (a.isFeatured ? 5 : 0) + (a.verificationStatus === "VERIFIED" ? 4 : 0);
    let scoreB = (b.isFeatured ? 5 : 0) + (b.verificationStatus === "VERIFIED" ? 4 : 0);
    if (a.pricingStatus === "FREE" || a.pricingStatus === "FREEMIUM") scoreA += 3;
    if (b.pricingStatus === "FREE" || b.pricingStatus === "FREEMIUM") scoreB += 3;
    return scoreB - scoreA;
  });

  const topTools = sortedTools.slice(0, 6);
  const freeOptions = sortedTools.filter((t) => t.pricingStatus === "FREE" || t.pricingStatus === "FREEMIUM").slice(0, 4);

  // 4. Map Related Guides and Built-in Services
  const relatedGuides = allGuides
    .filter((g) => g.slug.includes(detectedCategory) || g.content.toLowerCase().includes(detectedCategory))
    .slice(0, 3)
    .map((g) => ({ title: g.title, slug: g.slug, readTime: g.estimatedReadTime }));

  const builtInServices = AI_SERVICES
    .filter((s) => s.category.toLowerCase().includes(detectedCategory) || s.description.toLowerCase().includes(detectedCategory))
    .slice(0, 4)
    .map((s) => ({ name: s.name, slug: s.slug, description: s.description }));

  // Fallback to top services if none matched category
  if (builtInServices.length === 0) {
    builtInServices.push(
      { name: AI_SERVICES[0].name, slug: AI_SERVICES[0].slug, description: AI_SERVICES[0].description },
      { name: AI_SERVICES[2].name, slug: AI_SERVICES[2].slug, description: AI_SERVICES[2].description }
    );
  }

  // 5. Structure Workflow Steps
  const workflowSteps = matchedWorkflow?.steps.map((s) => ({
    stepNumber: s.stepNumber,
    title: s.title,
    action: s.action,
    toolName: s.recommendedToolName,
    isFree: true,
  })) || [
    { stepNumber: 1, title: "Clarify Scope & Inputs", action: "Specify the exact parameters and target audience.", isFree: true },
    { stepNumber: 2, title: "AI-Augmented Drafting", action: "Execute drafting using verified free-tier tools.", isFree: true },
    { stepNumber: 3, title: "Review & Quality Verification", action: "Verify factual integrity and format final deliverable.", isFree: true },
  ];

  // Optional AI-enriched clarification if an API provider is active
  let understoodSummary = `You want to: "${userInput.trim()}". We mapped your objective to the ${subcategory} workflow with verified free and freemium tool options.`;

  try {
    const aiResponse = await executeAI(
      `The user submitted the goal: "${userInput}".
Summarize in ONE concise, encouraging, professional sentence (under 25 words) that you understand their exact objective and will show them the verified step-by-step workflow and tools. Do not mention any tool prices or brands not in their prompt.`,
      { maxTokens: 80, temperature: 0.3, ipHash }
    );
    if (aiResponse.text && aiResponse.text.trim().length > 10) {
      understoodSummary = aiResponse.text.trim();
    }
  } catch {
    // Graceful degradation: Deterministic summary is used without any disruption!
  }

  return {
    understoodGoal: understoodSummary,
    category: detectedCategory.charAt(0).toUpperCase() + detectedCategory.slice(1),
    subcategory,
    experienceLevel,
    taskType,
    requiredCapabilities: [
      "Natural language structuring",
      "Format conversion & export",
      "Quality validation & error checking",
    ],
    possibleSubtasks: [
      "Validate requirements & scope",
      "Execute automated drafting",
      "Verify facts & citations",
      "Publish or export deliverable",
    ],
    workflow: {
      title: matchedWorkflow?.title || `Complete Guide: ${userInput}`,
      steps: workflowSteps,
    },
    recommendedTools: topTools,
    freeOptions,
    relatedGuides,
    builtInServices,
  };
}
