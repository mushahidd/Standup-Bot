import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { projects } from "@/lib/api";
import { AppNav } from "@/components/app/AppNav";
import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { renderMarkdown, colorCodeBrief } from "@/lib/markdown";

export const Route = createFileRoute("/projects/$projectId/brief")({
  component: BriefPage,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      generate: search.generate === true || search.generate === "true",
    };
  },
});

function BriefPage() {
  const { projectId } = Route.useParams();
  const { generate } = Route.useSearch();
  const { user, isLoading: authLoading, login } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [streamingContent, setStreamingContent] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamComplete, setStreamComplete] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const { data: project, isLoading: projectLoading } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => projects.get(projectId),
    enabled: !!user,
  });

  const { data: brief, isLoading: briefLoading, refetch } = useQuery({
    queryKey: ["project", projectId, "brief", "today"],
    queryFn: () => projects.getBriefToday(projectId),
    enabled: !!user && !!project && !generate,
    retry: false,
  });

  // Handle streaming generation
  useEffect(() => {
    if (generate && user && project && !isStreaming && !streamComplete) {
      startStreaming();
    }
  }, [generate, user, project]);

  const startStreaming = async () => {
    setIsStreaming(true);
    setStreamingContent("");

    try {
      abortControllerRef.current = new AbortController();
      const response = await fetch(projects.generateBrief(projectId), {
        method: "POST",
        credentials: "include",
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Failed to generate brief");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No response body");
      }

      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") {
              setStreamComplete(true);
              setIsStreaming(false);
              // Refresh the brief data
              queryClient.invalidateQueries({ queryKey: ["project", projectId, "brief", "today"] });
              queryClient.invalidateQueries({ queryKey: ["project", projectId] });
              // Remove generate flag from URL
              navigate({
                to: "/projects/$projectId/brief",
                params: { projectId },
                replace: true,
              });
              return;
            }
            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                setStreamingContent((prev) => prev + parsed.content);
              }
            } catch (e) {
              // Ignore parse errors
            }
          }
        }
      }
    } catch (error: any) {
      if (error.name === "AbortError") {
        toast.info("Brief generation cancelled");
      } else {
        toast.error(error.message || "Failed to generate brief");
      }
      setIsStreaming(false);
      navigate({
        to: "/projects/$projectId",
        params: { projectId },
      });
    }
  };

  useEffect(() => {
    if (!authLoading && !user) {
      login();
    }
  }, [authLoading, user, login]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  if (authLoading || !user || projectLoading) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-3 h-3 bg-[var(--persian)] rotate-45 animate-pulse" />
          <p className="mt-4 text-[var(--ink-soft)]">Loading...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[var(--background)]">
        <AppNav />
        <main className="mx-auto max-w-7xl px-6 py-12">
          <div className="box border-[var(--destructive)] bg-[#FEE2E2] p-6">
            <p className="text-[var(--destructive)] font-medium">
              Project not found or you don't have access.
            </p>
          </div>
        </main>
      </div>
    );
  }

  // Show streaming view
  if (isStreaming || (generate && !streamComplete)) {
    return (
      <div className="min-h-screen bg-[var(--background)]">
        <AppNav />
        <main className="mx-auto max-w-4xl px-6 py-12">
          <div className="mb-8">
            <h1 className="font-display font-bold text-5xl md:text-6xl text-[var(--ink)]">
              Generating brief...
            </h1>
            <p className="mt-3 text-[var(--ink-soft)]">
              AI is reading all submissions and finding connections
            </p>
          </div>

          <div className="box box-shadow-hard p-8">
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-[var(--line)]">
              <div className="inline-block w-3 h-3 bg-[var(--persian)] rotate-45 animate-pulse" />
              <span className="text-sm text-[var(--ink-soft)]">Streaming live...</span>
            </div>

            <div
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{
                __html: colorCodeBrief(renderMarkdown(streamingContent || "_Waiting for AI..._")),
              }}
            />

            <div className="mt-6 pt-6 border-t border-[var(--line)]">
              <span className="inline-block w-2 h-2 bg-[var(--persian)] rounded-full animate-pulse mr-2" />
              <span className="text-xs text-[var(--ink-soft)]">
                This usually takes 10-15 seconds
              </span>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Show brief not found
  if (!briefLoading && !brief) {
    return (
      <div className="min-h-screen bg-[var(--background)]">
        <AppNav />
        <main className="mx-auto max-w-4xl px-6 py-12">
          <div className="mb-8">
            <Link
              to="/projects/$projectId"
              params={{ projectId }}
              className="inline-flex items-center gap-2 text-sm text-[var(--ink-soft)] hover:text-[var(--ink)] mb-4"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Back to project
            </Link>
            <h1 className="font-display font-bold text-5xl md:text-6xl text-[var(--ink)]">
              No brief yet
            </h1>
          </div>

          <div className="box box-shadow-hard p-8 text-center">
            <div className="inline-block w-4 h-4 bg-[var(--persian)] rotate-45 mb-4" />
            <p className="text-[var(--ink-soft)] mb-6">
              Today's brief hasn't been generated yet. The project leader can generate it once members submit their standups.
            </p>
            <Link
              to="/projects/$projectId"
              params={{ projectId }}
              className="btn-primary"
            >
              Back to project
            </Link>
          </div>
        </main>
      </div>
    );
  }

  // Show the brief
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <AppNav />

      <main className="mx-auto max-w-4xl px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/projects/$projectId"
            params={{ projectId }}
            className="inline-flex items-center gap-2 text-sm text-[var(--ink-soft)] hover:text-[var(--ink)] mb-4"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to project
          </Link>
          <h1 className="font-display font-bold text-5xl md:text-6xl text-[var(--ink)]">
            Team brief
          </h1>
          <p className="mt-3 text-[var(--ink-soft)]">
            {new Date(brief!.date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </p>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-6 mb-6">
          <div className="pill">
            <span className="font-bold">{brief!.submissions_count}</span> of{" "}
            <span className="font-bold">{brief!.total_active_members}</span> submitted
          </div>
          <div className="text-xs text-[var(--ink-soft)]">
            Generated {new Date(brief!.generated_at).toLocaleTimeString()}
          </div>
        </div>

        {/* Brief content */}
        <div className="box box-shadow-hard p-8">
          <div
            className="prose prose-sm max-w-none
              prose-headings:font-display prose-headings:text-[var(--ink)]
              prose-p:text-[var(--ink)] prose-p:leading-relaxed
              prose-strong:text-[var(--ink)] prose-strong:font-semibold
              prose-ul:text-[var(--ink)] prose-li:text-[var(--ink)]
              prose-code:text-[var(--persian)] prose-code:bg-[var(--surface-2)]
              prose-code:px-1 prose-code:py-0.5 prose-code:rounded"
            dangerouslySetInnerHTML={{
              __html: colorCodeBrief(renderMarkdown(brief!.content)),
            }}
          />
        </div>

        {/* Legend */}
        <div className="mt-6 box p-6 bg-[var(--surface-2)]">
          <h3 className="font-display text-sm font-semibold text-[var(--ink)] mb-3">
            Color legend
          </h3>
          <div className="grid sm:grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#DC2626] rounded" />
              <span className="text-[var(--ink-soft)]">Blockers (red)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#16A34A] rounded" />
              <span className="text-[var(--ink-soft)]">Progress (green)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#2563EB] rounded" />
              <span className="text-[var(--ink-soft)]">New members (blue)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#D97706] rounded" />
              <span className="text-[var(--ink-soft)]">Missing (amber)</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
