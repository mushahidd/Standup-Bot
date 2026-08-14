import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { projects, standups, type ProjectDetail, type MemberStatus } from "@/lib/api";
import { AppNav } from "@/components/app/AppNav";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/projects/$projectId/")({
  component: ProjectHome,
});

function ProjectHome() {
  const { projectId } = Route.useParams();
  const { user, isLoading: authLoading, login } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: project, isLoading: projectLoading } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => projects.get(projectId),
    enabled: !!user,
  });

  const { data: submissionStatus } = useQuery({
    queryKey: ["project", projectId, "status"],
    queryFn: () => standups.getStatus(projectId),
    enabled: !!user && !!project,
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  const { data: briefToday } = useQuery({
    queryKey: ["project", projectId, "brief", "today"],
    queryFn: () => projects.getBriefToday(projectId),
    enabled: !!user && !!project,
    retry: false,
  });

  useEffect(() => {
    if (!authLoading && !user) {
      login();
    }
  }, [authLoading, user, login]);

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

  const isLeader = project.current_member.role === "Project Leader";
  const submittedCount = submissionStatus?.filter((m) => m.submitted).length || 0;
  const totalMembers = submissionStatus?.length || 0;
  const canGenerateBrief = isLeader && submittedCount > 0 && !briefToday;

  const daysRemaining = project.deadline
    ? Math.ceil(
        (new Date(project.deadline).getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : null;

  const handleGenerateBrief = async () => {
    setIsGenerating(true);
    try {
      // Navigate to brief page which will handle streaming
      navigate({
        to: "/projects/$projectId/brief",
        params: { projectId },
        search: { generate: true },
      });
    } catch (error: any) {
      toast.error(error.data?.detail || "Failed to generate brief");
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <AppNav />

      <main className="mx-auto max-w-7xl px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-[var(--ink-soft)] hover:text-[var(--ink)] mb-4"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to dashboard
          </Link>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="font-display font-bold text-5xl md:text-6xl text-[var(--ink)]">
                {project.name}
              </h1>
              {project.description && (
                <p className="mt-3 text-lg text-[var(--ink-soft)]">{project.description}</p>
              )}
              <div className="flex items-center gap-4 mt-4">
                {isLeader && <span className="pill">Project Leader</span>}
                <span className="text-sm text-[var(--ink-soft)]">
                  Your role: <span className="font-medium text-[var(--ink)]">{project.current_member.role}</span>
                </span>
                {daysRemaining !== null && (
                  <span className="text-sm text-[var(--ink-soft)]">
                    {daysRemaining > 0 ? (
                      <>
                        <span className="font-medium text-[var(--ink)]">{daysRemaining}</span> days until deadline
                      </>
                    ) : daysRemaining === 0 ? (
                      <span className="font-medium text-[var(--destructive)]">Due today</span>
                    ) : (
                      <span className="font-medium text-[var(--destructive)]">Overdue</span>
                    )}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Submission tracker */}
            <div className="box box-shadow-hard p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-2xl text-[var(--ink)]">Today's submissions</h2>
                <div className="text-sm">
                  <span className="font-bold text-[var(--ink)]">{submittedCount}</span>
                  <span className="text-[var(--ink-soft)]"> of {totalMembers}</span>
                </div>
              </div>

              {submissionStatus && submissionStatus.length > 0 ? (
                <div className="space-y-3">
                  {submissionStatus.map((member, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 border border-[var(--line)] bg-[var(--surface)]"
                    >
                      <div>
                        <div className="font-medium text-[var(--ink)]">{member.name}</div>
                        <div className="text-xs text-[var(--ink-soft)]">{member.role}</div>
                      </div>
                      {member.submitted ? (
                        <div className="flex items-center gap-2 text-[#16A34A]">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20 6L9 17l-5-5" />
                          </svg>
                          <span className="text-sm font-medium">Submitted</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-[var(--ink-soft)]">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 6v6l4 2" />
                          </svg>
                          <span className="text-sm">Pending</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[var(--ink-soft)] text-center py-8">No members yet</p>
              )}
            </div>

            {/* Actions */}
            <div className="box box-shadow-hard p-6">
              <h2 className="font-display text-2xl text-[var(--ink)] mb-4">Quick actions</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                <Link
                  to="/projects/$projectId/standup"
                  params={{ projectId }}
                  className="btn-primary justify-center"
                >
                  Submit standup
                </Link>
                {briefToday ? (
                  <Link
                    to="/projects/$projectId/brief"
                    params={{ projectId }}
                    className="btn-ghost justify-center"
                  >
                    View today's brief
                  </Link>
                ) : isLeader && canGenerateBrief ? (
                  <button
                    onClick={handleGenerateBrief}
                    disabled={isGenerating}
                    className="btn-primary justify-center disabled:opacity-50"
                  >
                    {isGenerating ? "Generating..." : "Generate brief"}
                  </button>
                ) : isLeader ? (
                  <button disabled className="btn-ghost justify-center opacity-50 cursor-not-allowed">
                    Generate brief (need submissions)
                  </button>
                ) : null}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Team members */}
            <div className="box box-shadow-hard p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-xl text-[var(--ink)]">Team</h3>
                {isLeader && (
                  <Link
                    to="/projects/$projectId/members"
                    params={{ projectId }}
                    className="text-sm text-[var(--persian)] hover:underline"
                  >
                    Manage
                  </Link>
                )}
              </div>
              <div className="space-y-2">
                {project.members
                  .filter((m) => m.status === "active")
                  .map((member) => (
                    <div key={member.id} className="text-sm">
                      <div className="font-medium text-[var(--ink)]">{member.name || member.email}</div>
                      <div className="text-xs text-[var(--ink-soft)]">{member.role}</div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Project info */}
            <div className="box box-shadow-hard p-6">
              <h3 className="font-display text-xl text-[var(--ink)] mb-4">Project info</h3>
              <div className="space-y-3 text-sm">
                {project.deadline && (
                  <div>
                    <div className="text-[var(--ink-soft)]">Deadline</div>
                    <div className="font-medium text-[var(--ink)]">
                      {new Date(project.deadline).toLocaleDateString()}
                    </div>
                  </div>
                )}
                <div>
                  <div className="text-[var(--ink-soft)]">Standup closes at</div>
                  <div className="font-medium text-[var(--ink)]">{project.standup_closes_at}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
