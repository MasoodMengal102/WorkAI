import { executeAI } from "../factory";
import { z } from "zod";

export interface ServiceExecutionParams {
  serviceSlug: string;
  inputs: Record<string, string>;
  ipHash?: string;
}

export interface ServiceExecutionResponse {
  success: boolean;
  result?: string;
  error?: string;
  provider?: string;
  model?: string;
  tokensUsed?: number;
}

/**
 * Service-specific system instructions and prompt builders.
 * Enforces input sanitization and prompt injection safety.
 */
export async function executeService(params: ServiceExecutionParams): Promise<ServiceExecutionResponse> {
  const { serviceSlug, inputs, ipHash } = params;

  // 1. Basic sanitization: strip dangerous control characters and limit length
  const sanitizedInputs: Record<string, string> = {};
  for (const [key, value] of Object.entries(inputs)) {
    if (typeof value === "string") {
      sanitizedInputs[key] = value.trim().slice(0, 3000);
    }
  }

  let systemPrompt = "You are a professional, accurate AI assistant for the WorkAI productivity platform. Deliver structured, high-value, ready-to-use output. Do not include conversational greetings or conversational sign-offs.";
  let userPrompt = "";
  let maxTokens = 2000;

  switch (serviceSlug) {
    case "resume-builder":
      userPrompt = `Build an ATS-optimized professional resume profile.
Candidate Name: ${sanitizedInputs.fullName || "Candidate"}
Target Role: ${sanitizedInputs.targetRole || "Professional"}
Career Level: ${sanitizedInputs.careerLevel || "Experienced"}
Core Skills: ${sanitizedInputs.keySkills || ""}
Raw Duties & Work Experience:
${sanitizedInputs.workExperience || ""}

Instructions:
1. Write a 3-sentence executive summary highlighting quantifiable impact.
2. Structure bullet points for experience using the STAR method ([Action Verb] + [Context] + [Quantifiable Metric]).
3. Format as clean, readable Markdown with standard ATS section headings: Professional Summary, Core Competencies, Professional Experience, Education.`;
      maxTokens = 2500;
      break;

    case "cover-letter-generator":
      userPrompt = `Write a tailored, high-converting professional cover letter.
Applicant Name: ${sanitizedInputs.applicantName || "Candidate"}
Target Company: ${sanitizedInputs.targetCompany || "Employer"}
Target Role: ${sanitizedInputs.targetRole || "Role"}
Job Description Excerpt:
${sanitizedInputs.jobDescription || ""}
Candidate Achievements:
${sanitizedInputs.candidateHighlights || ""}

Instructions:
- Do NOT use generic clichés like 'I am writing to express my interest'.
- Paragraph 1: State why the company's recent strategic initiatives resonate and how the candidate directly addresses their goals.
- Paragraph 2: Highlight 2 specific past achievements with metrics directly relevant to the role.
- Paragraph 3: Confident, low-friction closing inviting a conversation.
- Output clean text formatted as a business letter.`;
      maxTokens = 2000;
      break;

    case "youtube-script-generator":
      userPrompt = `Create a complete, high-retention YouTube video script.
Topic: ${sanitizedInputs.topic || "Topic"}
Target Duration: ${sanitizedInputs.targetDuration || "8-10 minutes"}
Target Audience: ${sanitizedInputs.targetAudience || "General"}
Delivery Tone: ${sanitizedInputs.tone || "Engaging & Conversational"}
Key Points:
${sanitizedInputs.keyTakeaways || ""}

Format:
- HOOK (0:00 - 0:15): High-curiosity opening that prevents clicking away.
- INTRO & PROMISE (0:15 - 0:45): Exactly what will be learned.
- SECTION 1, 2, 3: Numbered core segments with bracketed visual B-roll cues [Visual: Screen recording or animation].
- CONCLUSION & CTA: Clear single call to action.`;
      maxTokens = 3000;
      break;

    case "youtube-title-generator":
      userPrompt = `Generate 10 high-CTR, psychological curiosity YouTube video titles.
Video Subject: ${sanitizedInputs.videoTopic || "Topic"}
Video Format: ${sanitizedInputs.videoFormat || "Tutorial"}
Focus Keyword: ${sanitizedInputs.primaryKeyword || "None"}

Instructions:
- Group into 3 categories: Curiosity / Counter-Intuitive, Direct How-To / Case Study, and High-Stakes / Story.
- Keep titles strictly between 45 and 65 characters so they do not truncate on mobile screens.
- Avoid deceitful clickbait. Ensure every title matches the video premise.`;
      maxTokens = 1200;
      break;

    case "youtube-description-generator":
      userPrompt = `Create an SEO-optimized YouTube video description.
Video Title: ${sanitizedInputs.title || "Video"}
Summary: ${sanitizedInputs.summary || ""}
Links & Resources: ${sanitizedInputs.linksAndResources || ""}

Include:
1. Compelling 2-sentence summary with target keywords in the first 120 characters (above the 'Show More' fold).
2. Bulleted key takeaways.
3. Timestamp placeholders for chapters (0:00 Intro, etc.).
4. Resources / Links section.
5. 3-5 relevant hashtags at the bottom.`;
      maxTokens = 1500;
      break;

    case "thumbnail-prompt-generator":
      userPrompt = `Generate 3 descriptive, high-contrast visual prompts for YouTube video thumbnails.
Video Premise: ${sanitizedInputs.videoTopic || "Topic"}
Visual Mood: ${sanitizedInputs.visualMood || "Cinematic"}
Target AI Tool: ${sanitizedInputs.targetTool || "Midjourney"}

Instructions:
- Emphasize visual contrast, dramatic lighting, and clear subject silhouette.
- Format with camera lenses, lighting parameters, and aspect ratio tags appropriate for ${sanitizedInputs.targetTool || "Midjourney"}.`;
      maxTokens = 1200;
      break;

    case "image-prompt-generator":
      userPrompt = `Generate a master image generator prompt.
Subject: ${sanitizedInputs.subject || "Subject"}
Artistic Style: ${sanitizedInputs.artStyle || "Photorealistic"}
Lighting: ${sanitizedInputs.lighting || "Cinematic"}
Aspect Ratio: ${sanitizedInputs.aspectRatio || "16:9"}

Provide:
1. Master Prompt (Dense, descriptive, lighting, optics, negative constraints).
2. Midjourney format with parameters (--ar, --v 6.1, --style raw).
3. Stable Diffusion format with positive and negative prompt blocks.
4. Plain English explanation of why the stylistic choices enhance the composition.`;
      maxTokens = 1500;
      break;

    case "blog-outline-generator":
      userPrompt = `Create a comprehensive SEO blog post outline.
Primary Keyword: ${sanitizedInputs.targetKeyword || "Topic"}
Search Intent: ${sanitizedInputs.searchIntent || "Informational"}
Target Audience: ${sanitizedInputs.targetAudience || "General Readers"}
Unique Perspective: ${sanitizedInputs.keyAngle || "Practical Guide"}

Structure:
- Recommended H1 Title (under 60 characters)
- Meta Description (150-160 characters)
- H2 / H3 section outline with bulleted reader takeaways for each section
- FAQ section answering 3 top conversational questions people search for
- Recommended internal link opportunities`;
      maxTokens = 2200;
      break;

    case "social-media-post-generator":
      userPrompt = `Generate a high-engagement social media post.
Platform: ${sanitizedInputs.platform || "LinkedIn"}
Core Message: ${sanitizedInputs.coreMessage || ""}
Brand Tone: ${sanitizedInputs.tone || "Professional"}
Call to Action: ${sanitizedInputs.callToAction || ""}

Format:
- First-line hook engineered for mobile feed dwell time.
- White space and short 1-2 sentence paragraphs for effortless scanning.
- Actionable takeaway framework.
- Natural closing question or call to action.`;
      maxTokens = 1800;
      break;

    case "email-writer":
      userPrompt = `Write a professional business email.
Scenario: ${sanitizedInputs.scenario || "Outreach"}
Recipient: ${sanitizedInputs.recipient || "Colleague"}
Key Points: ${sanitizedInputs.keyPoints || ""}
Tone: ${sanitizedInputs.tone || "Courteous & Direct"}

Provide:
- 3 Subject Line Options (Clear, high open rate, under 8 words).
- Complete Email Body (Concise, polite, clear next step).`;
      maxTokens = 1500;
      break;

    case "product-description-generator":
      userPrompt = `Generate compelling product copy.
Product Name: ${sanitizedInputs.productName || "Product"}
Product Category: ${sanitizedInputs.productType || "SaaS"}
Key Features: ${sanitizedInputs.featuresList || ""}
Target Customer: ${sanitizedInputs.targetCustomer || "Users"}

Include:
1. Punchy 1-sentence value proposition.
2. 3 Benefit-driven bullet points (Feature + Emotional/Practical Benefit).
3. 2-paragraph narrative description highlighting problem solved.
4. Technical specifications / compatibility list.`;
      maxTokens = 1800;
      break;

    case "study-planner":
      userPrompt = `Create a day-by-day revision schedule based on spaced repetition.
Subject: ${sanitizedInputs.subject || "Subject"}
Days Until Exam: ${sanitizedInputs.daysAvailable || "14 days"}
Study Hours per Day: ${sanitizedInputs.hoursPerDay || "2 hours"}
Syllabus Topics:
${sanitizedInputs.topicsList || ""}

Structure:
- Phase 1: Core comprehension and active retrieval.
- Phase 2: Interleaved practice and problem sets.
- Phase 3: Timed mock quizzes and weak-spot remediation.
- Day-by-day table with specific topic focus and review intervals.`;
      maxTokens = 2200;
      break;

    case "quiz-generator":
      userPrompt = `Generate a high-yield diagnostic practice quiz.
Topic: ${sanitizedInputs.topic || "Topic"}
Academic Level: ${sanitizedInputs.educationLevel || "Undergraduate"}
Question Count: ${sanitizedInputs.numberOfQuestions || "5 Questions"}
Source Excerpt: ${sanitizedInputs.sourceNotes || "None"}

For EACH question:
- Question stem testing conceptual application (not rote trivia).
- Options A, B, C, D.
- Correct Answer declared.
- Detailed 2-sentence rationale explaining WHY the correct option is right and why the common distractor option is incorrect.`;
      maxTokens = 2500;
      break;

    case "presentation-outline-generator":
      userPrompt = `Create an executive 10-slide presentation deck outline.
Topic: ${sanitizedInputs.presentationTitle || "Presentation"}
Audience: ${sanitizedInputs.audience || "Stakeholders"}
Single Core Outcome: ${sanitizedInputs.coreGoal || "Decision"}
Key Data / Arguments: ${sanitizedInputs.keyArguments || ""}

For each of the 10 slides provide:
- Slide Title
- Visual Concept (Chart, diagram, or single bold statistic)
- 3 Bullet points for the slide
- Speaker talking notes (what to say out loud)`;
      maxTokens = 2200;
      break;

    case "job-application-assistant":
      userPrompt = `Prepare a candidate for an upcoming job interview.
Job Title: ${sanitizedInputs.targetJobTitle || "Role"}
Industry: ${sanitizedInputs.industry || "General"}
Key Requirements: ${sanitizedInputs.jobRequirements || ""}

Generate:
1. Top 5 Behavioral Interview Questions likely to be asked.
2. Recommended STAR framework answer outline for each question.
3. 3 insightful questions the candidate should ask the interviewers.`;
      maxTokens = 2500;
      break;

    default:
      userPrompt = `Help with the following request: ${JSON.stringify(sanitizedInputs)}`;
  }

  try {
    const aiResult = await executeAI(userPrompt, {
      systemPrompt,
      maxTokens,
      temperature: 0.7,
      endpoint: `ai-service:${serviceSlug}`,
      ipHash,
    });

    return {
      success: true,
      result: aiResult.text,
      provider: aiResult.provider,
      model: aiResult.model,
      tokensUsed: aiResult.tokensUsed,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "AI generation failed",
    };
  }
}
