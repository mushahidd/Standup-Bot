import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { projects, members, type InviteLinkCreate } from "@/lib/api";
import { AppNav } from "@/components/app/AppNav";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/projects/$projectId/invite-links")({
  component: InviteLinksPage,
});

function InviteLinksPage() {
  const { projectId } = Route.useParams();
  const { user, isLoading: authLoading, login } = useAuth();
  const queryClient = useQueryClient();

  const [role, setRole] = useState("");

  const { data: project, isLoading: projectLoading } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => projects.get(projectId),
    enabled: !!user,
  });

  const { data: inviteLinks, isLoading: linksLoading } = useQuery({
    queryKey: ["project", projectId, "invite-links"],
    queryFn: () => members.listInviteLinks(projectId),
    enabled: !!user && !!project,
  });

  const createLinkMutation = useMutation({
    mutationFn: (data: InviteLinkCreate) => members.createInviteLink(projectId, data),
    onSuccess: () => {
      toast.success("Invite link created!");
      setRole("");
      queryClient.invalidateQueries({ queryKey: ["project", projectId, "invite-links"] });
    },
    onError: (error: any) => {
      toast.error(error.data?.detail || "Failed to create invite link");
    },
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

  if (!isLeader) {
    return (
      <div className="min-h-screen bg-[var(--background)]">
        <AppNav />
        <main className="mx-auto max-w-7xl px-6 py-12">
          <div className="box border-[var(--destructive)] bg-[#FEE2E2] p-6">
            <p className="text-[var(--destructive)] font-medium">
              Only the project leader can manage invite links.
            </p>
          </div>
        </main>
      </div>
    );
  }

  const handleCreateLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!role.trim()) {
      toast.error("Role is required");
      return;
    }
    createLinkMutation.mutate({ role });
  };

  const copyToClipboard = (token: string) => {
    const url = `${window.location.origin}/join/${token}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <AppNav />

      <main className="mx-auto max-w-4xl px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/projects/$projectId/members"
            params={{ projectId }}
            className="inline-flex items-center gap-2 text-sm text-[var(--ink-soft)] hover:text-[var(--ink)] mb-4"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to members
          </Link>
          <h1 className="font-display font-bold text-5xl md:text-6xl text-[var(--ink)]">
            Invite links
          </h1>
          <p className="mt-3 text-[var(--ink-soft)]">
            Generate links with roles pre-assigned. Share via WhatsApp or anywhere.
          </p>
        </div>

        <div className="space-y-6">
          {/* Create new link */}
          <div className="box box-shadow-hard p-6">
            <h2 className="font-display text-2xl text-[var(--ink)] mb-4">
              Create new invite link
            </h2>
            <form onSubmit={handleCreateLink} className="space-y-4">
              <div>
                <label htmlFor="role" className="block text-sm font-semibold text-[var(--ink)] mb-2">
                  Role for this link
                </label>
                <input
                  type="text"
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g., Frontend Developer, QA Tester"
                  className="w-full px-4 py-3 border border-[var(--line-strong)] bg-[var(--surface)] text-[var(--ink)] placeholder:text-[var(--ink-soft)] focus:outline-none focus:ring-2 focus:ring-[var(--persian)]"
                />
                <p className="text-xs text-[var(--ink-soft)] mt-1">
                  Anyone who uses this link will join with this role.
                </p>
              </div>
              <button
                type="submit"
                disabled={createLinkMutation.isPending}
                className="btn-primary disabled:opacity-50"
              >
                {createLinkMutation.isPending ? "Generating..." : "Generate link"}
              </button>
            </form>
          </div>

          {/* Existing links */}
          <div className="box box-shadow-hard p-6">
            <h2 className="font-display text-2xl text-[var(--ink)] mb-6">
              Active invite links
            </h2>

            {linksLoading ? (
              <div className="text-center py-8">
                <div className="inline-block w-3 h-3 bg-[var(--persian)] rotate-45 animate-pulse" />
                <p className="mt-4 text-[var(--ink-soft)]">Loading links...</p>
              </div>
            ) : inviteLinks && inviteLinks.length > 0 ? (
              <div className="space-y-3">
                {inviteLinks.map((link) => (
                  <div
                    key={link.id}
                    className="p-4 border border-[var(--line)] bg-[var(--surface)]"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="font-medium text-[var(--ink)]">{link.role}</div>
                        <div className="text-xs text-[var(--ink-soft)] mt-1">
                          Created {new Date(link.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      {link.status === "invited" ? (
                        <span className="pill text-xs !py-1 !px-2 bg-[#DCFCE7] text-[#16A34A] border-0">
                          Available
                        </span>
                      ) : (
                        <span className="pill text-xs !py-1 !px-2 bg-[var(--muted)] text-[var(--muted-foreground)] border-0">
                          Used
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 px-3 py-2 bg-[var(--surface-2)] text-xs font-mono text-[var(--ink-soft)] border border-[var(--line)] overflow-x-auto">
                        {window.location.origin}/join/{link.invite_token}
                      </code>
                      <button
                        onClick={() => copyToClipboard(link.invite_token!)}
                        className="btn-ghost !py-2 !px-3 text-sm"
                        title="Copy to clipboard"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                          <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[var(--ink-soft)] text-center py-8">
                No invite links yet. Create one above.
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
