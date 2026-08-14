import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { projects, standups, type StandupSubmit } from "@/lib/api";
import { AppNav } from "@/components/app/AppNav";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/projects/$projectId/standup")({
  component: StandupPage,
});

function StandupPage() {
  const { projectId } = Route.useParams();
  const { user, isLoading: authLoading, login } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<StandupSubmit>({
    did: "",
    will_do: "",
    blocker: "",
  });

  const { data: project, isLoading: projectLoading } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => projects.get(projectId),
    enabled: !!user,
  });

  const { data: standupData, isLoading: standupLoading } = useQuery({
    queryKey: ["project", projectId, "standup", "today"],
    queryFn: () => standups.getToday(projectId),
    enabled: !!user && !!project,
  });

  const submitMutation = useMutation({
    mutationFn: (data: StandupSubmit) => standups.submit(projectId, data),
    onSuccess: (data) => {
      toast.success(
        `Submitted! ${data.submitted_count} of ${data.total_active_members} members have submitted.`
      );
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      navigate({
        to: "/projects/$projectId",
        params: { projectId },
      });
    },
    onError: (error: any) => {
      toast.error(error.data?.detail || "Failed to submit standup");
    },
  });

  // Pre-fill form if editing
  useEffect(() => {
    if (standupData?.submitted && standupData.standup) {
      setFormData({
        did: standupData.standup.did,
        will_do: standupData.standup.will_do,
        blocker: standupData.standup.blocker || "",
      });
    }
  }, [standupData]);

  useEffect(() => {
    if (!authLoading && !user) {
      login();
    }
  }, [authLoading, user, login]);

  if (authLoading || !user || projectLoading || standupLoading) {
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

  // Check if standup is closed
  if (standupData?.standup_closed) {
    return (
      <div className="min-h-screen bg-[var(--background)]">
        <AppNav />
        <main className="mx-auto max-w-3xl px-6 py-12">
          <div className="box border-[#D97706] bg-[#FEF3C7] p-8 text-center">
            <div className="inline-block w-4 h-4 bg-[#D97706] rotate-45 mb-4" />
            <h1 className="font-display text-2xl text-[var(--ink)] mb-2">
              Today's standup is closed
            </h1>
            <p className="text-[var(--ink-soft)] mb-6">
              The brief has already been generated. You can submit for tomorrow.
            </p>
            <Link
              to="/projects/$projectId/brief"
              params={{ projectId }}
              className="btn-primary"
            >
              View today's brief
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.did.trim() || !formData.will_do.trim()) {
      toast.error("Please answer all required questions");
      return;
    }
    submitMutation.mutate(formData);
  };

  const isEditing = standupData?.submitted;
  const isFirstStandup = standupData?.is_first_standup;

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <AppNav />

      <main className="mx-auto max-w-3xl px-6 py-12">
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
            {isEditing ? "Edit" : "Submit"} standup
          </h1>
          <p className="mt-3 text-[var(--ink-soft)]">
            {project.name} · {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </p>
          {isFirstStandup && (
            <div className="mt-4 p-4 bg-[#DBEAFE] border border-[#2563EB]">
              <p className="text-sm text-[#2563EB]">
                👋 This is your first standup! The AI will welcome you in today's brief.
              </p>
            </div>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="box box-shadow-hard p-8">
          <div className="space-y-8">
            {/* Question 1 */}
            <div>
              <label
                htmlFor="did"
                className="block font-display text-xl text-[var(--ink)] mb-3"
              >
                1. What did you do today?{" "}
                <span className="text-[var(--destructive)]">*</span>
              </label>
              <textarea
                id="did"
                value={formData.did}
                onChange={(e) => setFormData({ ...formData, did: e.target.value })}
                placeholder="e.g., Finished the login API, fixed 3 bugs in the checkout flow, reviewed Sara's PR"
                rows={4}
                className="w-full px-4 py-3 border border-[var(--line-strong)] bg-[var(--surface)] text-[var(--ink)] placeholder:text-[var(--ink-soft)] focus:outline-none focus:ring-2 focus:ring-[var(--persian)] resize-none"
                required
              />
            </div>

            {/* Question 2 */}
            <div>
              <label
                htmlFor="will_do"
                className="block font-display text-xl text-[var(--ink)] mb-3"
              >
                2. What will you do tomorrow?{" "}
                <span className="text-[var(--destructive)]">*</span>
              </label>
              <textarea
                id="will_do"
                value={formData.will_do}
                onChange={(e) =>
                  setFormData({ ...formData, will_do: e.target.value })
                }
                placeholder="e.g., Start the payment integration, write tests for the auth module"
                rows={4}
                className="w-full px-4 py-3 border border-[var(--line-strong)] bg-[var(--surface)] text-[var(--ink)] placeholder:text-[var(--ink-soft)] focus:outline-none focus:ring-2 focus:ring-[var(--persian)] resize-none"
                required
              />
            </div>

            {/* Question 3 */}
            <div>
              <label
                htmlFor="blocker"
                className="block font-display text-xl text-[var(--ink)] mb-3"
              >
                3. Any blockers?
              </label>
              <textarea
                id="blocker"
                value={formData.blocker}
                onChange={(e) =>
                  setFormData({ ...formData, blocker: e.target.value })
                }
                placeholder="Type 'none' if you have no blockers, or describe what's blocking you"
                rows={4}
                className="w-full px-4 py-3 border border-[var(--line-strong)] bg-[var(--surface)] text-[var(--ink)] placeholder:text-[var(--ink-soft)] focus:outline-none focus:ring-2 focus:ring-[var(--persian)] resize-none"
              />
              <p className="text-xs text-[var(--ink-soft)] mt-2">
                Be specific! If you're blocked on someone else's work, mention their name.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 mt-8 pt-8 border-t border-[var(--line)]">
            <button
              type="submit"
              disabled={submitMutation.isPending}
              className="btn-primary disabled:opacity-50"
            >
              {submitMutation.isPending ? (
                <>
                  <div className="inline-block w-3 h-3 bg-[var(--ghost)] rotate-45 animate-pulse" />
                  Submitting...
                </>
              ) : (
                <>
                  {isEditing ? "Update" : "Submit"} standup
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() =>
                navigate({ to: "/projects/$projectId", params: { projectId } })
              }
              className="btn-ghost"
            >
              Cancel
            </button>
          </div>
        </form>

        {/* Info box */}
        <div className="mt-6 p-4 bg-[var(--surface-2)] border border-[var(--line)]">
          <p className="text-sm text-[var(--ink-soft)]">
            💡 <strong>Tip:</strong> This takes 90 seconds. Be specific about blockers —
            the AI will connect them to teammates who can help.
          </p>
        </div>
      </main>
    </div>
  );
}
