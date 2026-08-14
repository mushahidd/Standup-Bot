import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { projects, type ProjectCreate } from "@/lib/api";
import { AppNav } from "@/components/app/AppNav";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/projects/new")({
  component: NewProject,
  head: () => ({
    meta: [
      { title: "New Project — StandupBot" },
      { name: "description", content: "Create a new project" },
    ],
  }),
});

function NewProject() {
  const { user, isLoading: authLoading, login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<ProjectCreate>({
    name: "",
    description: "",
    deadline: "",
    standup_closes_at: "21:00",
  });

  const createMutation = useMutation({
    mutationFn: (data: ProjectCreate) => projects.create(data),
    onSuccess: (project) => {
      toast.success("Project created!");
      navigate({
        to: "/projects/$projectId/members",
        params: { projectId: project.id },
      });
    },
    onError: (error: any) => {
      toast.error(error.data?.detail || "Failed to create project");
    },
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      login();
    }
  }, [authLoading, user, login]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-3 h-3 bg-[var(--persian)] rotate-45 animate-pulse" />
          <p className="mt-4 text-[var(--ink-soft)]">Loading...</p>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Project name is required");
      return;
    }
    createMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <AppNav />

      <main className="mx-auto max-w-3xl px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-display font-bold text-5xl md:text-6xl text-[var(--ink)]">
            Create a project
          </h1>
          <p className="mt-3 text-[var(--ink-soft)]">
            Set up your team's async standup in under 60 seconds.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="box box-shadow-hard p-8">
          {/* Project Name */}
          <div className="mb-6">
            <label
              htmlFor="name"
              className="block text-sm font-semibold text-[var(--ink)] mb-2"
            >
              Project name <span className="text-[var(--destructive)]">*</span>
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="e.g., FYP — E-commerce Platform"
              className="w-full px-4 py-3 border border-[var(--line-strong)] bg-[var(--surface)] text-[var(--ink)] placeholder:text-[var(--ink-soft)] focus:outline-none focus:ring-2 focus:ring-[var(--persian)]"
              required
            />
          </div>

          {/* Description */}
          <div className="mb-6">
            <label
              htmlFor="description"
              className="block text-sm font-semibold text-[var(--ink)] mb-2"
            >
              One-line description
            </label>
            <input
              type="text"
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="e.g., Building a full-stack e-commerce app with React and Node"
              className="w-full px-4 py-3 border border-[var(--line-strong)] bg-[var(--surface)] text-[var(--ink)] placeholder:text-[var(--ink-soft)] focus:outline-none focus:ring-2 focus:ring-[var(--persian)]"
            />
            <p className="text-xs text-[var(--ink-soft)] mt-1">
              This helps the AI understand your project context.
            </p>
          </div>

          {/* Deadline */}
          <div className="mb-6">
            <label
              htmlFor="deadline"
              className="block text-sm font-semibold text-[var(--ink)] mb-2"
            >
              Project deadline
            </label>
            <input
              type="date"
              id="deadline"
              value={formData.deadline}
              onChange={(e) =>
                setFormData({ ...formData, deadline: e.target.value })
              }
              className="w-full px-4 py-3 border border-[var(--line-strong)] bg-[var(--surface)] text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--persian)]"
            />
            <p className="text-xs text-[var(--ink-soft)] mt-1">
              The AI will calculate days remaining and flag deadline risk.
            </p>
          </div>

          {/* Standup closes at */}
          <div className="mb-8">
            <label
              htmlFor="standup_closes_at"
              className="block text-sm font-semibold text-[var(--ink)] mb-2"
            >
              Daily standup closes at
            </label>
            <input
              type="time"
              id="standup_closes_at"
              value={formData.standup_closes_at}
              onChange={(e) =>
                setFormData({ ...formData, standup_closes_at: e.target.value })
              }
              className="w-full px-4 py-3 border border-[var(--line-strong)] bg-[var(--surface)] text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--persian)]"
            />
            <p className="text-xs text-[var(--ink-soft)] mt-1">
              Members should submit before this time each day.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createMutation.isPending ? (
                <>
                  <div className="inline-block w-3 h-3 bg-[var(--ghost)] rotate-45 animate-pulse" />
                  Creating...
                </>
              ) : (
                <>
                  Create project
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
              onClick={() => navigate({ to: "/dashboard" })}
              className="btn-ghost"
            >
              Cancel
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
