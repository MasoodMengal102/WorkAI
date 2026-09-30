import { ComparisonItem } from "@/types";

export const COMPARISONS: ComparisonItem[] = [
  {
    id: "comp-chatgpt-claude",
    slug: "chatgpt-vs-claude",
    title: "ChatGPT vs Claude: In-Depth Comparison",
    toolASlug: "chatgpt",
    toolAName: "ChatGPT",
    toolBSlug: "claude",
    toolBName: "Claude",
    summary: "Both ChatGPT (OpenAI) and Claude (Anthropic) represent the leading edge of foundational conversational models, but they diverge in writing tone, coding ergonomics, and ecosystem integration.",
    keyDifferences: [
      "Ecosystem: ChatGPT offers native web search, custom GPT marketplace, and live voice conversations; Claude focuses on deep context analysis and interactive Artifacts.",
      "Writing Style: Claude tends toward natural, nuanced human cadence with less boilerplate; ChatGPT defaults to structured bulleted answers.",
      "Context Window: Claude 3.5 Sonnet supports a 200,000 token context window natively; ChatGPT standard chats operate on 128k context.",
      "Code Interaction: Claude Artifacts allows viewing rendered HTML/React/SVG code side-by-side in real-time; ChatGPT utilizes Code Interpreter for Python execution."
    ],
    strengthsA: [
      "Voice conversation mode is exceptionally low-latency and realistic",
      "Massive ecosystem of custom GPTs and third-party integrations",
      "Python Code Interpreter executes code, processes CSVs, and plots charts directly",
      "Widespread native mobile and desktop applications"
    ],
    strengthsB: [
      "Superior prose quality with less robotic, repetitive filler language",
      "Artifacts provide immediate visual feedback for frontend UI development",
      "Nuanced comprehension of complex legal, medical, and technical documents",
      "High refusal accuracy without preachy or patronizing responses"
    ],
    limitationsA: [
      "Can sound repetitive or overly formulaic in long-form essays",
      "Variable rate limits during high global usage hours on free tier"
    ],
    limitationsB: [
      "Free tier dynamic limits can be restrictive during peak US daytime hours",
      "No native live voice-to-voice conversation mode equivalent to ChatGPT Advanced Voice"
    ],
    verdict: "Suitable for different priorities: Choose Claude when crafting nuanced essays, analyzing long technical documents, or iterating on frontend UI with Artifacts. Choose ChatGPT when you need multimodal voice chat, Python data execution, or access to the broad custom GPT ecosystem.",
  },
  {
    id: "comp-cursor-github-copilot",
    slug: "cursor-vs-github-copilot",
    title: "Cursor vs GitHub Copilot: Developer Tool Comparison",
    toolASlug: "cursor",
    toolAName: "Cursor",
    toolBSlug: "github-copilot",
    toolBName: "GitHub Copilot",
    summary: "While GitHub Copilot brought AI autocomplete to existing IDEs, Cursor redesigned the code editor experience from the ground up around codebase indexing and multi-file agentic changes.",
    keyDifferences: [
      "Architecture: GitHub Copilot is an extension for VS Code, JetBrains, and Neovim; Cursor is a dedicated fork of VS Code with native AI bindings.",
      "Codebase Indexing: Cursor computes semantic vector embeddings across your entire local repository to understand relationships between distant files; Copilot relies on active open editor tabs.",
      "Multi-File Editing: Cursor's Composer can generate and edit multiple files simultaneously; Copilot Chat operates primarily on the currently focused file.",
      "Pricing: Cursor provides a free tier with 2,000 completions; GitHub Copilot requires a subscription ($10/mo) after a 30-day trial (free for verified students)."
    ],
    strengthsA: [
      "Composer allows multi-file feature implementation from a single prompt",
      "Understands project-wide symbols and architecture via local indexing",
      "Direct terminal command generation and error resolution",
      "Generous free tier for individual developers"
    ],
    strengthsB: [
      "Works seamlessly across JetBrains IDEs (IntelliJ, PyCharm, WebStorm) and Neovim",
      "Deep integration with GitHub pull requests, issues, and security alerts",
      "Enterprise audit controls and corporate IP indemnification guarantees",
      "Lightweight extension without needing a separate IDE installation"
    ],
    limitationsA: [
      "Requires migrating to a separate VS Code fork rather than your existing editor setup",
      "Initial repository indexing can consume significant local CPU/battery on large codebases"
    ],
    limitationsB: [
      "Lacks native multi-file editing orchestration equivalent to Cursor Composer",
      "No permanent free tier for non-student individual programmers"
    ],
    verdict: "Consider Cursor if you want a complete AI-first editor that can write features across multiple files and understand your whole repository. Consider GitHub Copilot if you must stay inside JetBrains/Neovim or your employer mandates enterprise GitHub governance.",
  },
  {
    id: "comp-midjourney-adobe-firefly",
    slug: "midjourney-vs-adobe-firefly",
    title: "Midjourney vs Adobe Firefly: Visual AI Comparison",
    toolASlug: "midjourney",
    toolAName: "Midjourney",
    toolBSlug: "adobe-firefly",
    toolBName: "Adobe Firefly",
    summary: "Midjourney dominates artistic expression, photorealism, and stylistic flair, while Adobe Firefly prioritizes commercial copyright safety, precision Photoshop integration, and inpainting.",
    keyDifferences: [
      "Training Data & Copyright: Firefly is trained exclusively on Adobe Stock and public domain images, offering corporate IP indemnity; Midjourney is trained on open internet datasets.",
      "Aesthetic Quality: Midjourney produces unmatched cinematic lighting and hyper-realistic detail; Firefly produces clean, commercial-safe graphic and photographic assets.",
      "Workflow: Firefly is integrated directly into Photoshop and Illustrator for Generative Fill; Midjourney operates via web and Discord.",
      "Free Tier: Firefly offers 25 free monthly credits; Midjourney requires a paid monthly subscription."
    ],
    strengthsA: [
      "Industry benchmark for aesthetic beauty, lighting, and cinematic realism",
      "Complex prompt interpretation and stylistic variety (--sref style matching)",
      "High-resolution detailed character and environmental concept art",
      "Active creative community for prompt discovery"
    ],
    strengthsB: [
      "Certified commercially safe with enterprise copyright indemnification",
      "Seamless Generative Fill and Expand directly inside Adobe Photoshop",
      "Free monthly generative credits with a free Adobe ID",
      "Clean user interface without requiring Discord navigation"
    ],
    limitationsA: [
      "No permanent free tier; requires monthly subscription ($10-$60/mo)",
      "Cannot offer enterprise IP indemnification against training data lawsuits"
    ],
    limitationsB: [
      "Artistic generation can feel more sterile or stock-photo-like than Midjourney",
      "Strict content safety filters can occasionally block benign creative prompts"
    ],
    verdict: "Useful for distinct scenarios: Midjourney is the clear choice for artists, game designers, and creative directors seeking maximum visual aesthetic impact. Adobe Firefly is the necessary choice for corporate enterprise marketing teams requiring certified copyright indemnity and Photoshop integration.",
  },
  {
    id: "comp-runway-pika",
    slug: "runway-vs-pika",
    title: "Runway vs Pika: AI Video Generation Compared",
    toolASlug: "runway",
    toolAName: "Runway",
    toolBSlug: "pika",
    toolBName: "Pika",
    summary: "Runway and Pika represent two competing visions of AI video generation: Runway targets cinematic realism and studio director controls, while Pika excels at playful viral effects, sound design, and short loops.",
    keyDifferences: [
      "Visual Style: Runway Gen-3 focuses on filmic photorealism and dynamic cinematic camera moves; Pika specializes in stylized animation, surreal physics effects, and memes.",
      "Camera Controls: Runway provides advanced Motion Brush and precise camera direction; Pika offers one-click physics effects (Inflate, Melt, Explode).",
      "Sound Integration: Pika automatically synthesizes sound effects for generated video clips; Runway focuses primarily on high-fidelity video motion.",
      "Free Allowance: Runway provides 125 one-time credits on registration; Pika provides 30 initial credits with a 30-credit daily replenishment."
    ],
    strengthsA: [
      "Gen-3 Alpha delivers cinematic lighting, realistic human movement, and camera depth",
      "Motion Brush allows animating specific portions of a static frame",
      "Professional director camera controls (pan, zoom, tilt, roll)",
      "Video-to-video restyling capabilities"
    ],
    strengthsB: [
      "30 free credits replenish every 24 hours for continuous experimentation",
      "Automated audio sound effects generated to match video action",
      "Intuitive physics effects (squish, melt, crumble) popular for viral social clips",
      "Clean, accessible web interface"
    ],
    limitationsA: [
      "Free credits do not refill automatically each month once exhausted",
      "Longer generation wait times during high-traffic periods"
    ],
    limitationsB: [
      "Free exports include visible Pika watermark",
      "Cinematic realism is generally lower than Runway Gen-3"
    ],
    verdict: "Better suited to: Choose Runway for professional B-roll, cinematic short films, and fine camera choreography. Choose Pika for rapid social media content, viral TikTok effects, and everyday experimentation with daily free credits.",
  },
  {
    id: "comp-zapier-make",
    slug: "zapier-vs-make",
    title: "Zapier vs Make: Workflow Automation Compared",
    toolASlug: "zapier",
    toolAName: "Zapier",
    toolBSlug: "make",
    toolBName: "Make",
    summary: "Zapier and Make are the two titans of no-code integration. Zapier offers the largest connector library and simplest linear setup, while Make provides visual branching power and significantly lower per-operation costs.",
    keyDifferences: [
      "Interface: Zapier uses a linear top-to-bottom step builder; Make uses an infinite visual drag-and-drop flowchart canvas.",
      "Free Tier: Zapier offers 100 tasks/month; Make offers 1,000 operations/month with 2 active scenarios.",
      "Pricing Model: Make is significantly more affordable for complex, high-volume automated data pipelines.",
      "Ecosystem: Zapier connects with over 6,000 apps; Make connects with approximately 1,500+ apps."
    ],
    strengthsA: [
      "Vast app library: integrates with virtually any SaaS tool on the market",
      "Linear interface is intuitive for non-technical beginners",
      "Zapier Central offers natural language AI agents that execute actions",
      "Excellent reliability with managed enterprise error re-runs"
    ],
    strengthsB: [
      "Visual flowchart makes complex multi-branching logic easy to map and debug",
      "10x more operations on the free plan (1,000 vs 100)",
      "Advanced data parsing, array aggregators, and JSON transformers built-in",
      "Substantially lower cost per thousand operations at scale"
    ],
    limitationsA: [
      "Gets very expensive quickly when processing thousands of tasks monthly",
      "Complex branching paths require expensive multi-step plans"
    ],
    limitationsB: [
      "Steeper initial learning curve for understanding iterators and aggregators",
      "Free tier has a 15-minute polling interval limit"
    ],
    verdict: "Consider Zapier if you need quick linear connections between obscure niche SaaS tools and prefer simplicity. Consider Make if you need complex multi-branch data transformations or have high transaction volumes where cost efficiency is paramount.",
  },
  {
    id: "comp-notion-ai-otter-ai",
    slug: "notion-ai-vs-otter-ai",
    title: "Notion AI vs Otter.ai: Workplace Productivity Compared",
    toolASlug: "notion-ai",
    toolAName: "Notion AI",
    toolBSlug: "otter-ai",
    toolBName: "Otter.ai",
    summary: "Notion AI connects knowledge across your databases and documentation, while Otter.ai specializes in real-time meeting capture, automated transcription, and speech-to-text action items.",
    keyDifferences: [
      "Primary Purpose: Otter.ai is an automated meeting attendee that listens and transcribes live spoken audio; Notion AI is a text workspace assistant that analyzes written documents.",
      "Live Audio: Otter.ai connects directly to Zoom/Teams/Meet calls; Notion AI processes text entered or stored in Notion pages.",
      "Workspace Search: Notion AI can query across your entire corporate wiki; Otter.ai searches across past meeting audio transcripts.",
      "Free Tier: Otter.ai provides 300 monthly transcription minutes free; Notion AI provides a limited free trial before an add-on fee."
    ],
    strengthsA: [
      "Q&A answers questions by indexing across all team pages and databases",
      "Autofills database properties with summary tags and status updates",
      "Generates project briefs, task breakdowns, and technical specs inside notes",
      "No need to leave your primary workspace environment"
    ],
    strengthsB: [
      "Automatically joins scheduled calendar calls and transcribes live conversation",
      "Speaker identification separates who said what accurately",
      "Automated action item extraction highlights agreed responsibilities",
      "300 free minutes per month for ongoing team utility"
    ],
    limitationsA: [
      "Cannot listen to live audio or join conference calls directly",
      "Requires an active Notion workspace subscription plus AI add-on"
    ],
    limitationsB: [
      "Specialized only for audio and transcripts, not general project management",
      "30-minute cap per call on the free plan"
    ],
    verdict: "Complementary tools: Use Otter.ai to capture spoken discussions during client or team calls. Use Notion AI to synthesize those transcripts into long-term company documentation and project trackers.",
  },
  {
    id: "comp-suno-vs-udio",
    slug: "suno-vs-udio",
    title: "Suno vs Udio: AI Music Generation Compared",
    toolASlug: "suno",
    toolAName: "Suno",
    toolBSlug: "udio",
    toolBName: "Udio",
    summary: "Suno and Udio are the two breakthroughs in generative song creation. Suno delivers rapid full-song coherence and catchy pop structures, while Udio provides audiophile fidelity and complex multi-track extension.",
    keyDifferences: [
      "Musical Structure: Suno excels at radio-ready verse-chorus-verse pop song structures in a single prompt; Udio excels at incremental track extension up to 15 minutes.",
      "Acoustic Fidelity: Udio often achieves higher instrumental clarity on complex jazz, classical, and rock arrangements; Suno delivers punchy, catchy hooks.",
      "Daily Allowance: Suno provides 50 daily credits (10 songs); Udio provides 100 monthly credits.",
      "User Control: Udio offers fine-grained control over prompt weight and lyric timing markers."
    ],
    strengthsA: [
      "Generates catchy 2-minute songs with clear verse-chorus transitions instantly",
      "Generous daily refill of 50 credits (10 songs per day for free)",
      "Simple prompt interface accessible to anyone without musical training",
      "Fast generation speed with reliable vocal delivery"
    ],
    strengthsB: [
      "Exceptional instrumental separation and audio depth",
      "Granular track extension allows building 15-minute progressive epics",
      "Advanced control over lyric timing and musical phrase continuation",
      "Outstanding nuance in acoustic guitar, piano, and jazz arrangements"
    ],
    limitationsA: [
      "Vocals can occasionally have subtle robotic phasing or compression artifacts",
      "Non-commercial licensing on the free tier"
    ],
    limitationsB: [
      "Building a complete song often requires multiple iterative extension steps",
      "Longer wait times during peak processing queue periods"
    ],
    verdict: "Better suited to: Choose Suno for instant catchy songs, comedic tracks, and rapid creative brainstorming with 50 daily free credits. Choose Udio for serious musical compositions, intricate instrumental arrangements, and extended multi-movement tracks.",
  },
  {
    id: "comp-perplexity-vs-gemini",
    slug: "perplexity-vs-gemini",
    title: "Perplexity AI vs Google Gemini: Research Tools Compared",
    toolASlug: "perplexity",
    toolAName: "Perplexity AI",
    toolBSlug: "gemini",
    toolBName: "Google Gemini",
    summary: "Perplexity AI is a citation-first research engine designed for verifiable facts, while Google Gemini is a massive multimodal platform integrated into Google Workspace and YouTube.",
    keyDifferences: [
      "Information Provenance: Every claim in Perplexity is grounded with an explicit numbered footnote citation; Gemini synthesizes answers using Google Search without footnote granularity.",
      "Context Window: Gemini 1.5 Pro features a massive 1M+ token context window; Perplexity specializes in concise web query answers.",
      "Multimodal Input: Gemini can analyze 1-hour YouTube videos, huge PDF files, and audio recordings directly; Perplexity focuses primarily on web and text synthesis.",
      "Academic Filter: Perplexity offers a dedicated Academic Focus mode indexing peer-reviewed papers."
    ],
    strengthsA: [
      "Footnote citations make fact-checking and bibliography building effortless",
      "Focus modes (Academic, YouTube, Reddit, Writing) target specific source types",
      "Pro Search asks clarifying questions to narrow ambiguous research queries",
      "Clean, ad-free interface dedicated to transparent information discovery"
    ],
    strengthsB: [
      "1,000,000+ token context window can analyze entire books or code repositories in one prompt",
      "Direct integration with Google Docs, Drive, Gmail, and YouTube",
      "Superior multimodal comprehension of video lectures and technical diagrams",
      "Completely free access to high-performance Gemini 1.5 Flash"
    ],
    limitationsA: [
      "Not designed for massive multi-megabyte document uploads in standard chat",
      "Pro searches limited to 5 every 4 hours on free tier"
    ],
    limitationsB: [
      "Citations are general web links rather than granular numbered footnotes",
      "Formatting can occasionally be loose or overly conversational"
    ],
    verdict: "Suitable for: Choose Perplexity AI when you are writing a research paper, fact-checking news, or needing verifiable academic citations. Choose Google Gemini when you need to digest a 200-page PDF report, analyze a YouTube video, or work within the Google Docs ecosystem.",
  },
  {
    id: "comp-leonardo-ai-vs-canva",
    slug: "leonardo-ai-vs-canva",
    title: "Leonardo.ai vs Canva Magic Studio: Visual Creation Compared",
    toolASlug: "leonardo-ai",
    toolAName: "Leonardo.ai",
    toolBSlug: "canva",
    toolBName: "Canva Magic Studio",
    summary: "Leonardo.ai is a specialized generative asset studio for fine-tuned illustration and game art, while Canva is an all-in-one graphic design suite for social media, print, and marketing collateral.",
    keyDifferences: [
      "Design Scope: Canva provides thousands of layout templates for flyers, social posts, and slides with typography tools; Leonardo generates raw imagery and illustrations on a canvas.",
      "Generative Control: Leonardo offers custom model training, Realtime Canvas, and ControlNet posing; Canva focuses on simple text-to-image and Magic Eraser.",
      "Free Daily Allowance: Leonardo gives 150 fast tokens every 24 hours with commercial rights; Canva offers 50 lifetime Magic Write uses on free tier with unlimited manual templates.",
      "Output: Leonardo generates standalone raster and game assets; Canva designs complete finished marketing collateral with text, shapes, and logos."
    ],
    strengthsA: [
      "150 free generation tokens reset every 24 hours",
      "Commercial usage rights included on free tier assets",
      "Realtime Canvas allows drawing rough sketches that transform into art instantly",
      "Custom LoRA model training for consistent character designs"
    ],
    strengthsB: [
      "Vast library of professionally designed templates for every social platform",
      "Complete typography and page layout controls for marketing flyers",
      "One-click social media resizing and instant printing integrations",
      "Intuitive collaborative editing for teams and non-designers"
    ],
    limitationsA: [
      "Not a graphic design layout tool: cannot add typography or design multi-page PDFs",
      "Free tier images are visible to the public community"
    ],
    limitationsB: [
      "AI features (Magic Studio) are heavily restricted behind Canva Pro subscription",
      "Generative image quality is standard compared to dedicated generative engines"
    ],
    verdict: "Complementary workflow: Generate your custom illustrations, character art, and backgrounds in Leonardo.ai using your 150 daily free tokens, then import those assets into Canva to add typography, branding, and export final marketing graphics.",
  },
  {
    id: "comp-ollama-vs-lm-studio",
    slug: "ollama-vs-lm-studio",
    title: "Ollama vs LM Studio: Local Offline AI Compared",
    toolASlug: "ollama",
    toolAName: "Ollama",
    toolBSlug: "lm-studio",
    toolBName: "LM Studio",
    summary: "Ollama and LM Studio are the leading tools for running open-source language models locally without cloud dependencies. Ollama provides a developer CLI and API server, while LM Studio provides an intuitive graphical user interface.",
    keyDifferences: [
      "Interface: Ollama is terminal/CLI-first with a background daemon; LM Studio is a complete desktop graphical application with search, chats, and sliders.",
      "Developer Use: Ollama provides a native REST API directly drop-in compatible with the OpenAI API for scripts and applications; LM Studio includes an in-app local server toggle.",
      "Model Discovery: LM Studio has built-in Hugging Face search to browse and download GGUF models visually; Ollama downloads models via `ollama run <name>`.",
      "Hardware Acceleration: Both support Apple Silicon Metal, NVIDIA CUDA, and AMD ROCm acceleration out-of-the-box."
    ],
    strengthsA: [
      "Lightweight, headless CLI that runs seamlessly on servers, Docker, and workstations",
      "Standard choice for developer pipelines, LangChain, and Cursor local models",
      "Zero UI overhead, maximizing available RAM for model weights",
      "100% open-source MIT license"
    ],
    strengthsB: [
      "Polished conversational desktop UI that requires zero terminal knowledge",
      "Visual discovery and direct downloading of thousands of Hugging Face GGUF models",
      "Hardware compatibility warning if a chosen model exceeds your system RAM",
      "Adjustable temperature, system prompts, and context sliders right in the UI"
    ],
    limitationsA: [
      "No built-in graphical chat window (requires web UI wrapper like Open WebUI for non-programmers)",
      "Curated model library requires manual Modelfile creation for custom GGUFs"
    ],
    limitationsB: [
      "Desktop GUI consumes additional memory compared to a pure CLI daemon",
      "Proprietary license for corporate enterprise environments"
    ],
    verdict: "Consider Ollama if you are a developer looking to integrate local models into coding scripts, VS Code extensions, or terminal workflows. Consider LM Studio if you want an elegant, point-and-click desktop ChatGPT experience that runs 100% privately on your PC without typing terminal commands.",
  },
];
