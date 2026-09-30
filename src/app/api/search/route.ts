import { NextRequest, NextResponse } from "next/server";
import { dataService } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = (searchParams.get("q") || "").toLowerCase().trim();

    if (!query) {
      return NextResponse.json({
        success: true,
        query: "",
        results: { tools: [], workflows: [], guides: [], services: [], useCases: [] },
      });
    }

    const tokens = query.split(/\s+/).filter((t) => t.length > 1);

    const [allTools, allWorkflows, allGuides, allServices, allUseCases] = await Promise.all([
      dataService.getTools(),
      dataService.getWorkflows(),
      dataService.getGuides(),
      dataService.getAiServices(),
      dataService.getUseCases(),
    ]);

    // Match Tools
    const matchedTools = allTools
      .map((tool) => {
        const text = `${tool.name} ${tool.description} ${tool.category} ${tool.subcategory || ""} ${tool.features.join(" ")} ${tool.useCases.join(" ")}`.toLowerCase();
        let matches = 0;
        for (const t of tokens) {
          if (text.includes(t)) matches++;
        }
        return { item: tool, matches };
      })
      .filter((m) => m.matches > 0)
      .sort((a, b) => b.matches - a.matches)
      .map((m) => m.item);

    // Match Workflows
    const matchedWorkflows = allWorkflows
      .map((wf) => {
        const text = `${wf.title} ${wf.description} ${wf.category} ${wf.targetAudience} ${wf.goals.join(" ")}`.toLowerCase();
        let matches = 0;
        for (const t of tokens) {
          if (text.includes(t)) matches++;
        }
        return { item: wf, matches };
      })
      .filter((m) => m.matches > 0)
      .sort((a, b) => b.matches - a.matches)
      .map((m) => m.item);

    // Match Guides
    const matchedGuides = allGuides
      .map((guide) => {
        const text = `${guide.title} ${guide.intro} ${guide.content}`.toLowerCase();
        let matches = 0;
        for (const t of tokens) {
          if (text.includes(t)) matches++;
        }
        return { item: guide, matches };
      })
      .filter((m) => m.matches > 0)
      .sort((a, b) => b.matches - a.matches)
      .map((m) => m.item);

    // Match Services
    const matchedServices = allServices
      .map((srv) => {
        const text = `${srv.name} ${srv.description} ${srv.category}`.toLowerCase();
        let matches = 0;
        for (const t of tokens) {
          if (text.includes(t)) matches++;
        }
        return { item: srv, matches };
      })
      .filter((m) => m.matches > 0)
      .sort((a, b) => b.matches - a.matches)
      .map((m) => m.item);

    // Match Use Cases
    const matchedUseCases = allUseCases
      .map((uc) => {
        const text = `${uc.title} ${uc.targetRole} ${uc.summary} ${uc.problems.join(" ")}`.toLowerCase();
        let matches = 0;
        for (const t of tokens) {
          if (text.includes(t)) matches++;
        }
        return { item: uc, matches };
      })
      .filter((m) => m.matches > 0)
      .sort((a, b) => b.matches - a.matches)
      .map((m) => m.item);

    return NextResponse.json({
      success: true,
      query,
      results: {
        tools: matchedTools.slice(0, 12),
        workflows: matchedWorkflows.slice(0, 6),
        guides: matchedGuides.slice(0, 6),
        services: matchedServices.slice(0, 6),
        useCases: matchedUseCases.slice(0, 6),
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Search failed" },
      { status: 500 }
    );
  }
}
