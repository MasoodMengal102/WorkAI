export interface CategoryDef {
  name: string;
  slug: string;
  description: string;
  icon: string;
}

export const CATEGORIES: CategoryDef[] = [
  {
    name: "AI Chatbots & Assistants",
    slug: "chatbots",
    description: "Conversational AI models for general problem solving, analysis, and multimodal reasoning.",
    icon: "MessageSquare",
  },
  {
    name: "AI Writing & Editing",
    slug: "writing",
    description: "Tools for drafting, paraphrasing, copy editing, blog writing, and document structuring.",
    icon: "PenTool",
  },
  {
    name: "AI Coding & Developer Tools",
    slug: "coding",
    description: "Code completions, debugging assistants, agentic refactoring, and automated testing utilities.",
    icon: "Code",
  },
  {
    name: "AI Image Generation & Editing",
    slug: "image-generation",
    description: "Generative art, vector creation, photo retouching, upscaling, and visual asset generation.",
    icon: "Image",
  },
  {
    name: "AI Video & Animation",
    slug: "video",
    description: "Text-to-video models, AI avatars, automated subtitle generation, and video editing suites.",
    icon: "Video",
  },
  {
    name: "AI Voice & Speech",
    slug: "voice",
    description: "Text-to-speech voiceovers, speech-to-text transcription, voice cloning, and audio cleanup.",
    icon: "Mic",
  },
  {
    name: "AI Music & Audio",
    slug: "music",
    description: "Song generation, background score creation, stem separation, and audio mastering.",
    icon: "Music",
  },
  {
    name: "AI Design & UI/UX",
    slug: "design",
    description: "Interface generation, wireframing, presentation design, and branding collateral.",
    icon: "Layout",
  },
  {
    name: "AI Presentations",
    slug: "presentations",
    description: "Slide generation, interactive deck builders, and visual document formatting.",
    icon: "Presentation",
  },
  {
    name: "AI Marketing & Copywriting",
    slug: "marketing",
    description: "Ad copy, landing page messaging, campaign brainstorming, and conversion rate optimization.",
    icon: "Megaphone",
  },
  {
    name: "AI SEO & Content Optimization",
    slug: "seo",
    description: "Keyword clustering, content gap identification, on-page optimization, and SERP analysis.",
    icon: "TrendingUp",
  },
  {
    name: "AI Research & Science",
    slug: "research",
    description: "Academic paper discovery, literature synthesis, citation mapping, and data summarization.",
    icon: "BookOpen",
  },
  {
    name: "AI Education & Learning",
    slug: "education",
    description: "Personalized tutoring, flashcard generation, study schedule planning, and quiz building.",
    icon: "GraduationCap",
  },
  {
    name: "AI Productivity & Note Taking",
    slug: "productivity",
    description: "Meeting summaries, workspace organizers, document search, and personal knowledge bases.",
    icon: "CheckSquare",
  },
  {
    name: "AI Automation & Workflows",
    slug: "automation",
    description: "No-code task automation, autonomous web scraping, and cross-application integrations.",
    icon: "Cpu",
  },
  {
    name: "AI Business & Strategy",
    slug: "business",
    description: "Market intelligence, business plan generation, competitor research, and forecasting.",
    icon: "Briefcase",
  },
  {
    name: "AI Sales & Outreach",
    slug: "sales",
    description: "Cold email personalization, CRM enrichment, prospect analysis, and pipeline automation.",
    icon: "Target",
  },
  {
    name: "AI Customer Support",
    slug: "customer-support",
    description: "Customer deflection bots, knowledge base triage, and automated ticket resolution.",
    icon: "Headphones",
  },
  {
    name: "AI Career & Resume",
    slug: "career",
    description: "CV formatting, job application tailoring, interview preparation, and skill gap review.",
    icon: "UserCheck",
  },
  {
    name: "AI Social Media",
    slug: "social-media",
    description: "Caption creation, thread scheduling, hashtag research, and short-form video scripts.",
    icon: "Share2",
  },
  {
    name: "Local & Open Source AI",
    slug: "open-source",
    description: "Self-hostable LLMs, offline desktop execution, and open weights for complete privacy.",
    icon: "Terminal",
  },
];
