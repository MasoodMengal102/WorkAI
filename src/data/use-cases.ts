import { UseCaseItem } from "@/types";

export const USE_CASES: UseCaseItem[] = [
  {
    id: "uc-youtubers",
    title: "AI for YouTubers & Video Creators",
    slug: "ai-for-youtubers",
    targetRole: "YouTubers, Vloggers & Video Creators",
    summary: "Discover how video creators leverage verified AI tools to research viral video angles, generate natural narration, assemble B-roll, and craft high-CTR thumbnails without expensive studio gear.",
    problems: [
      "Spending 15+ hours editing a single 10-minute video",
      "Hitting creator burnout trying to maintain a consistent weekly upload schedule",
      "Struggling with low click-through rates (CTR) on thumbnails and titles",
      "Lacking budget for professional voice actors or motion graphic designers"
    ],
    opportunities: [
      "Cut pre-production and drafting time by 60% with structured AI scriptwriting",
      "Generate clean voiceover audio and studio sound with zero microphone background hum",
      "Automate animated word-by-word subtitle creation that increases viewer retention",
      "Rapidly A/B test thumbnail concepts before publishing"
    ],
    practicalSolutions: [
      "Use Perplexity to validate video topic interest with real viewer search queries",
      "Draft two-column formatted video scripts with the WorkAI YouTube Script Generator",
      "Synthesize voiceovers using ElevenLabs free tier or clean audio with Descript Studio Sound",
      "Assemble final cuts and generate kinetic auto-captions in CapCut"
    ],
    relatedTools: ["elevenlabs", "capcut", "descript", "canva", "perplexity", "leonardo-ai"],
    relatedWorkflows: ["create-youtube-video-with-ai", "create-faceless-youtube-video"],
  },
  {
    id: "uc-students",
    title: "AI for Students & Academic Learners",
    slug: "ai-for-students",
    targetRole: "University, College & High School Students",
    summary: "Transform passive studying into high-retention active recall. Build structured revision roadmaps, generate practice exam questions, and synthesize complex academic papers ethically.",
    problems: [
      "Overwhelmed by hundreds of pages of dense textbook reading before exams",
      "Passive highlighting results in low long-term memory retention",
      "Struggling to find reliable peer-reviewed research for thesis papers",
      "Difficulty understanding abstract mathematical or scientific explanations"
    ],
    opportunities: [
      "Have AI interrogate you in Socratic mode to test conceptual understanding",
      "Convert lecture slide PDFs into active recall flashcards in minutes",
      "Find peer-reviewed scientific studies with verifiable DOIs and citation trees",
      "Break complex concepts into customized real-world analogies"
    ],
    practicalSolutions: [
      "Use Consensus and Semantic Scholar to locate peer-reviewed papers with proven consensus",
      "Draft personalized revision timetables using the WorkAI Study Planner",
      "Practice exam questions with the WorkAI Quiz Generator",
      "Proofread academic essays with Grammarly and QuillBot for sentence clarity"
    ],
    relatedTools: ["consensus", "semantic-scholar", "elicit", "grammarly", "quillbot", "claude"],
    relatedWorkflows: ["master-exam-prep-with-ai", "research-topic-with-ai"],
  },
  {
    id: "uc-freelancers",
    title: "AI for Freelancers & Independent Consultants",
    slug: "ai-for-freelancers",
    targetRole: "Freelancers, Solopreneurs & Consultants",
    summary: "Scale your billable output without increasing working hours. Automate proposal drafting, client intake, market research, and repetitive delivery tasks.",
    problems: [
      "Spending unpaid hours writing customized client proposals that don't get selected",
      "Solo capacity bottlenecks capping total monthly revenue",
      "Administrative overhead (invoicing, scoping, emails) stealing creative time",
      "Difficulty offering adjacent services (e.g. adding copywriting to design)"
    ],
    opportunities: [
      "Respond to high-ticket job postings within 15 minutes with customized proposals",
      "Expand client offerings by augmenting your workflow with generative tools",
      "Automate client intake and notification flows with no-code webhooks",
      "Polishing executive client deliverables with modern slide generators"
    ],
    practicalSolutions: [
      "Draft customized proposals answering client briefs with ChatGPT and Claude",
      "Generate client presentations and project briefs with Gamma App",
      "Automate lead capture and CRM updates using Make or Zapier",
      "Create branded graphics and mockups in Canva Magic Studio"
    ],
    relatedTools: ["claude", "gamma", "canva", "make", "zapier", "chatgpt"],
    relatedWorkflows: ["start-freelancing-with-ai", "automate-repetitive-work-with-ai"],
  },
  {
    id: "uc-developers",
    title: "AI for Software Engineers & Developers",
    slug: "ai-for-developers",
    targetRole: "Full-Stack, Backend, Frontend & DevOps Engineers",
    summary: "Supercharge your engineering workflow: eliminate boilerplate, debug cryptic runtime exceptions with live doc references, and scaffold clean UI components in seconds.",
    problems: [
      "Context switching to read through outdated documentation for API changes",
      "Writing tedious repetitive boilerplate and unit tests",
      "Debugging obscure framework errors across complex dependency trees",
      "Spending hours prototyping frontend UI components from scratch"
    ],
    opportunities: [
      "Refactor multi-file architectures with codebase-aware AI IDEs",
      "Scaffold responsive Tailwind components from natural language prompts",
      "Debug terminal error logs with search engines indexed on live documentation",
      "Run 100% private local LLMs on your workstation without cloud dependencies"
    ],
    practicalSolutions: [
      "Use Cursor for codebase-indexed multi-file refactoring and terminal commands",
      "Generate responsive React components with v0 by Vercel",
      "Look up real-time framework error fixes with Phind",
      "Run private, offline models with Ollama or LM Studio"
    ],
    relatedTools: ["cursor", "v0", "phind", "codeium", "ollama", "github-copilot"],
    relatedWorkflows: ["build-website-with-ai", "learn-programming-with-ai", "setup-private-offline-ai"],
  },
  {
    id: "uc-small-businesses",
    title: "AI for Small Businesses & Local Companies",
    slug: "ai-for-small-businesses",
    targetRole: "Small Business Owners & Local Operators",
    summary: "Compete with enterprise marketing budgets. Automate customer inquiry responses, produce professional social campaigns, and streamline inventory tracking.",
    problems: [
      "Lacking dedicated budget for agency retainers or full-time marketing staff",
      "Missing client inquiries that arrive after regular business hours",
      "Irregular social media and marketing presence due to lack of time",
      "Manual spreadsheet data entry causing operational errors"
    ],
    opportunities: [
      "Deploy 24/7 automated customer deflection and FAQ chatbots",
      "Create consistent local marketing collateral in minutes",
      "Automate appointment reminders and invoice follow-ups",
      "Transcribe and summarize client phone calls automatically"
    ],
    practicalSolutions: [
      "Design flyers, promotional banners, and social posts with Canva Magic Studio",
      "Automate customer follow-ups and spreadsheet logging using Zapier or Make",
      "Summarize customer meetings with Otter.ai",
      "Draft promotional emails and local Google Business posts with Copy.ai"
    ],
    relatedTools: ["canva", "zapier", "make", "otter-ai", "copy-ai", "chatgpt"],
    relatedWorkflows: ["automate-repetitive-work-with-ai", "create-marketing-content-with-ai"],
  },
  {
    id: "uc-marketers",
    title: "AI for Digital Marketers & Growth Teams",
    slug: "ai-for-marketers",
    targetRole: "Growth Leads, Performance Marketers & Social Managers",
    summary: "Accelerate campaign velocity: iterate on high-converting ad angles, audit competitive SEO gaps, and produce omnichannel content from single pillar assets.",
    problems: [
      "Creative fatigue: ad creative burn-out requiring dozens of fresh variants weekly",
      "Slow production cycles for landing pages and campaign assets",
      "Keeping pace with changing search engine algorithms and ranking criteria",
      "Inconsistent brand tone across multi-channel campaigns"
    ],
    opportunities: [
      "Generate 20 distinct emotional angles for ad copy testing in 5 minutes",
      "Repurpose a single webinar or whitepaper into 20+ social and email assets",
      "Identify high-intent content gaps that competitors missed on the SERP",
      "Create high-contrast visual ad creatives with generative image engines"
    ],
    practicalSolutions: [
      "Draft campaign copy variants with Copy.ai and Claude",
      "Audit search competitor headings with Surfer SEO or Semrush",
      "Generate vector ad illustrations with Recraft.ai",
      "Produce short-form teaser clips using CapCut and Runway"
    ],
    relatedTools: ["copy-ai", "surfer-seo", "recraft-ai", "capcut", "runway", "claude"],
    relatedWorkflows: ["create-marketing-content-with-ai", "seo-blog-production-pipeline"],
  },
  {
    id: "uc-designers",
    title: "AI for UI/UX & Graphic Designers",
    slug: "ai-for-designers",
    targetRole: "Product Designers, UI/UX Designers & Illustrators",
    summary: "Elevate your creative workflow: generate editable vector icons, rapidly prototype design concepts on infinite canvases, and remove backgrounds with zero manual masking.",
    problems: [
      "Spending hours creating custom vector icon sets for design systems",
      "Tedious manual pen-tool masking for complex photo cutouts",
      "Creative blocks during initial moodboard and concept development",
      "Aligning stakeholders on wireframes before starting high-fidelity mocks"
    ],
    opportunities: [
      "Generate pure SVG vector assets that snap directly into Figma",
      "Create cinematic visual moodboards with photorealistic generative tools",
      "Perform one-click generative fills and canvas expansions safely",
      "Turn prompt wireframes into interactive code prototypes"
    ],
    practicalSolutions: [
      "Generate customizable SVG vector icons and illustrations in Recraft.ai",
      "Create visual concepts and hero imagery using Midjourney and Leonardo.ai",
      "Use Adobe Firefly for commercially safe generative fills and background expansion",
      "Prototype interactive UI elements with v0 by Vercel"
    ],
    relatedTools: ["recraft-ai", "midjourney", "leonardo-ai", "adobe-firefly", "v0", "canva"],
    relatedWorkflows: ["build-website-with-ai", "create-instagram-content-with-ai"],
  },
  {
    id: "uc-writers",
    title: "AI for Authors, Copywriters & Journalists",
    slug: "ai-for-writers",
    targetRole: "Fiction Authors, Journalists, Bloggers & Editors",
    summary: "Overcome writer's block ethically: structure deep narrative arcs, polish prose readability, catch passive voice, and research factual citations with zero hallucination.",
    problems: [
      "Writer's block when staring at a blank screen",
      "Accidental tone drift across long multi-chapter manuscripts",
      "Spending hours hunting down obscure historical or scientific facts",
      "Cluttered, wordy sentences that drag down reading engagement"
    ],
    opportunities: [
      "Brainstorm plot twists, character motivations, and outline structures",
      "Audit sentence complexity and readability grade levels in real-time",
      "Fact-check claims with verified inline academic citations",
      "Paraphrase repetitive phrases without losing emotional nuance"
    ],
    practicalSolutions: [
      "Structure long narratives and brainstorm dialogue with Claude",
      "Audit readability, passive voice, and adverbs using Hemingway Editor Plus",
      "Proofread real-time grammatical nuance and tone with Grammarly",
      "Find primary citations for non-fiction using Perplexity AI"
    ],
    relatedTools: ["claude", "hemingway-editor", "grammarly", "perplexity", "quillbot", "deepl"],
    relatedWorkflows: ["seo-blog-production-pipeline", "research-topic-with-ai"],
  },
  {
    id: "uc-job-seekers",
    title: "AI for Job Seekers & Career Changers",
    slug: "ai-for-job-seekers",
    targetRole: "Active Job Seekers, Career Changers & Recent Graduates",
    summary: "Land more interviews: optimize your resume for Applicant Tracking Systems (ATS), write hyper-tailored cover letters, and practice mock behavioral interview questions.",
    problems: [
      "Submitting dozens of applications into corporate portals and getting zero replies",
      "Resumes failing automated ATS keyword screening filters",
      "Spending 45 minutes writing a customized cover letter for every single job",
      "Freezing up or stumbling during live behavioral interview rounds"
    ],
    opportunities: [
      "Extract exact technical proficiencies from job descriptions into your bullet points",
      "Draft customized, respectful cover letters in under 3 minutes",
      "Practice mock interview simulations with real-time constructive feedback",
      "Translate career achievements from past industries into relevant modern terminology"
    ],
    practicalSolutions: [
      "Build ATS-friendly resume bullet points with the WorkAI Resume Builder",
      "Generate company-specific cover letters with the WorkAI Cover Letter Generator",
      "Conduct mock behavioral interviews with Claude acting as the hiring manager",
      "Format clean, single-column export PDFs in Canva Magic Studio"
    ],
    relatedTools: ["claude", "canva", "chatgpt", "grammarly"],
    relatedWorkflows: ["create-professional-cv-with-ai", "create-cover-letter-with-ai"],
  },
  {
    id: "uc-teachers",
    title: "AI for Teachers & Educators",
    slug: "ai-for-teachers",
    targetRole: "K-12 Teachers, Professors & Corporate Trainers",
    summary: "Reclaim your evenings: generate customized lesson plans, differentiate reading levels for students, create engaging classroom quizzes, and format interactive slide decks.",
    problems: [
      "Spending 10+ unpaid hours every weekend grading and preparing lesson plans",
      "Struggling to differentiate reading materials for varying student reading levels",
      "Creating fresh quiz questions that prevent students from looking up answers online",
      "Designing visually engaging slide decks for daily classroom lectures"
    ],
    opportunities: [
      "Generate complete, standards-aligned lesson plans with discussion questions in minutes",
      "Rewrite complex historical or scientific texts at multiple reading grade levels",
      "Create interactive multiple-choice and conceptual quizzes instantly",
      "Produce clean visual presentation slides with automated card layouts"
    ],
    practicalSolutions: [
      "Generate customized quizzes with the WorkAI Quiz Generator",
      "Create interactive lesson presentations in Gamma App",
      "Differentiate reading passages using Claude and QuillBot",
      "Organize classroom materials and rubrics inside Notion AI"
    ],
    relatedTools: ["gamma", "claude", "quillbot", "notion-ai", "canva"],
    relatedWorkflows: ["master-exam-prep-with-ai", "create-presentation-with-ai"],
  },
  {
    id: "uc-researchers",
    title: "AI for Scientists & Academic Researchers",
    slug: "ai-for-researchers",
    targetRole: "PhD Candidates, Postdocs, Principal Investigators & Scientists",
    summary: "Accelerate scientific discovery: synthesize thousands of peer-reviewed papers, extract experimental parameters into comparison matrices, and track scientific consensus.",
    problems: [
      "Drowning in thousands of newly published papers across preprint servers monthly",
      "Spending weeks manually extracting sample sizes and dosages into spreadsheets",
      "Risk of missing critical foundational studies in adjacent disciplines",
      "Drafting tedious grant proposal literature review sections"
    ],
    opportunities: [
      "Query academic literature with plain English questions and get verified DOI citations",
      "Extract methodology and outcome data across dozens of PDFs automatically",
      "Visualize citation networks to uncover influential foundational papers",
      "Synthesize conflicting research results to identify scientific consensus"
    ],
    practicalSolutions: [
      "Map scientific consensus and study agreement with Consensus",
      "Extract clinical and empirical data across papers using Elicit",
      "Discover influential citations across 200M+ papers with Semantic Scholar",
      "Synthesize complex preprint PDFs using Claude's long-context window"
    ],
    relatedTools: ["consensus", "elicit", "semantic-scholar", "claude", "perplexity"],
    relatedWorkflows: ["research-topic-with-ai"],
  },
  {
    id: "uc-podcasters",
    title: "AI for Podcasters & Audio Creators",
    slug: "ai-for-podcasters",
    targetRole: "Podcast Hosts, Audio Engineers & Interviewers",
    summary: "Produce broadcast-grade podcasts: remove room echo and background hum, edit audio by simply editing text, generate royalty-free theme music, and produce timestamped show notes.",
    problems: [
      "Poor audio quality due to untreated home recording rooms",
      "Spending 4 hours manually cutting 'ums' and false starts from a 1-hour interview",
      "Copyright strike risks when using commercial music for theme songs",
      "Writing SEO show notes and timestamps after hours of recording"
    ],
    opportunities: [
      "Transform cheap microphone audio into studio broadcast clarity with one click",
      "Edit out mistakes simply by deleting words in the transcript text",
      "Generate custom, copyright-free instrumental theme music in any genre",
      "Auto-generate YouTube and Spotify timestamped chapters and summaries"
    ],
    practicalSolutions: [
      "Edit audio by editing text and clean background noise with Descript",
      "Synthesize unique custom intro theme music using Suno or Udio",
      "Generate accurate transcripts and SRT files with Whisper",
      "Draft timestamped show notes and guest bios with Claude"
    ],
    relatedTools: ["descript", "suno", "udio", "whisper", "elevenlabs", "claude"],
    relatedWorkflows: ["create-podcast-with-ai"],
  },
  {
    id: "uc-real-estate",
    title: "AI for Real Estate Agents & Property Managers",
    slug: "ai-for-real-estate",
    targetRole: "Realtors, Brokers & Property Managers",
    summary: "Sell homes faster: craft evocative property listings, stage vacant rooms with virtual generative photography, and produce social video tours in minutes.",
    problems: [
      "Spending hundreds of dollars on physical home staging for vacant listings",
      "Writing repetitive, generic property descriptions that fail to stand out",
      "Creating engaging video reels for open houses with tight turnaround times",
      "Managing dozens of incoming buyer questions across WhatsApp and email"
    ],
    opportunities: [
      "Virtually furnish vacant rooms with AI generative interior design",
      "Generate sensory, narrative property descriptions highlighting neighborhood perks",
      "Create vertical video walkthroughs with automated captions and voiceover",
      "Automate lead qualification and viewing appointment scheduling"
    ],
    practicalSolutions: [
      "Generate lifestyle descriptions using the WorkAI Product Description Generator",
      "Design listing flyers and social carousels in Canva Magic Studio",
      "Produce virtual listing video tours in CapCut with ElevenLabs voiceover",
      "Automate lead follow-up emails using Zapier and Gmail"
    ],
    relatedTools: ["canva", "capcut", "elevenlabs", "zapier", "chatgpt"],
    relatedWorkflows: ["create-marketing-content-with-ai", "create-tiktok-content-with-ai"],
  },
  {
    id: "uc-product-managers",
    title: "AI for Product Managers & Technical Leaders",
    slug: "ai-for-product-managers",
    targetRole: "Product Managers, Technical Leads & Scrum Masters",
    summary: "Ship better software products: synthesize customer feedback across thousands of reviews, draft comprehensive Product Requirement Documents (PRDs), and prototype wireframes.",
    problems: [
      "Drowning in fragmented feedback across Zendesk, Slack, app store reviews, and sales calls",
      "Spending days writing 20-page PRDs that developers find too tedious to read",
      "Slow turnaround times from designers for simple interface prototypes",
      "Aligning distributed stakeholders on roadmap trade-offs"
    ],
    opportunities: [
      "Cluster thousands of customer complaints into the top 5 requested feature areas",
      "Generate structured user stories with clear acceptance criteria (Given/When/Then)",
      "Prototype interactive UI mockups in natural language to validate with users",
      "Summarize customer research interviews automatically into key insights"
    ],
    practicalSolutions: [
      "Cluster customer feedback across documents using Google Gemini 1.5 Pro",
      "Prototype interactive component flows with v0 by Vercel",
      "Transcribe and synthesize user interviews with Otter.ai",
      "Draft concise PRDs and user story acceptance criteria with Claude"
    ],
    relatedTools: ["gemini", "v0", "otter-ai", "claude", "notion-ai"],
    relatedWorkflows: ["automate-meeting-summaries-with-ai", "customer-support-knowledge-base-with-ai"],
  },
  {
    id: "uc-sales-teams",
    title: "AI for B2B Sales & Business Development",
    slug: "ai-for-sales-teams",
    targetRole: "SDRs, Account Executives & Sales Directors",
    summary: "Close more deals: automate prospect account research, draft hyper-personalized cold outreach emails, and transcribe discovery calls to extract buyer objections.",
    problems: [
      "Spending 45 minutes manually researching each prospect's website and LinkedIn profile",
      "Generic mass email templates ending up directly in recipient spam folders",
      "Forgetting crucial buyer objections mentioned in passing during 45-minute discovery calls",
      "Manual CRM updates taking time away from active prospecting and calls"
    ],
    opportunities: [
      "Uncover recent prospect executive hires, funding rounds, and pain points in 60 seconds",
      "Send bespoke 4-sentence emails referencing verified prospect milestones",
      "Automatically log call transcripts and agreed action items directly into CRM records",
      "Role-play high-stakes objection handling before crucial prospect presentations"
    ],
    practicalSolutions: [
      "Research prospect accounts in real-time with Perplexity AI",
      "Generate concise, high-reply outreach emails with the WorkAI Email Writer",
      "Record and extract buyer objections from calls with Otter.ai",
      "Sync prospect lead tables automatically with Zapier or Make"
    ],
    relatedTools: ["perplexity", "otter-ai", "zapier", "make", "claude"],
    relatedWorkflows: ["personalized-cold-outreach-with-ai", "automate-repetitive-work-with-ai"],
  },
];
