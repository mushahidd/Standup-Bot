import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { projects, members, type MemberInvite } from "@/lib/api";
import { AppNav } from "@/components/app/AppNav";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/projects/$projectId/members")({
  component: MembersPage,
});

function MembersPage() {
  const { projectId } = Route.useParams();
  const { user, isLoading: authLoading, login } = useAuth();
  const queryClient = useQueryClient();

  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  const { data: project, isLoading: projectLoading } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => projects.get(projectId),
    enabled: !!user,
  });

  const addMemberMutation = useMutation({
    mutationFn: (data: MemberInvite) => members.addByEmail(projectId, data),
    onSuccess: () => {
      toast.success("Member invited!");
      setEmail("");
      setRole("");
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
    },
    onError: (error: any) => {
      toast.error(error.data?.detail || "Failed to invite member");
    },
  });

  const removeMemberMutation = useMutation({
    mutationFn: (memberId: number) => members.remove(projectId, memberId),
    onSuccess: () => {
      toast.success("Member removed");
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
    },
    onError: (error: any) => {
      toast.error(error.data?.detail || "Failed to remove member");
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
              Only the project leader can manage members.
            </p>
          </div>
        </main>
      </div>
    );
  }

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !role.trim()) {
      toast.error("Email and role are required");
      return;
    }
    addMemberMutation.mutate({ email, role });
  };

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
            Manage members
          </h1>
          <p className="mt-3 text-[var(--ink-soft)]">{project.name}</p>
        </div>

        <div className="space-y-6">
          {/* Add member by email */}
          <div className="box box-shadow-hard p-6">
            <h2 className="font-display text-2xl text-[var(--ink)] mb-4">
              Add member by email
            </h2>
            <form onSubmit={handleAddMember} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-[var(--ink)] mb-2">
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="teammate@university.edu"
                  className="w-full px-4 py-3 border border-[var(--line-strong)] bg-[var(--surface)] text-[var(--ink)] placeholder:text-[var(--ink-soft)] focus:outline-none focus:ring-2 focus:ring-[var(--persian)]"
                />
              </div>
              <div>
                <label htmlFor="role" className="block text-sm font-semibold text-[var(--ink)] mb-2">
                  Role
                </label>
                <input
                  type="text"
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g., Backend Developer, UI Designer"
                  className="w-full px-4 py-3 border border-[var(--line-strong)] bg-[var(--surface)] text-[var(--ink)] placeholder:text-[var(--ink-soft)] focus:outline-none focus:ring-2 focus:ring-[var(--persian)]"
                />
              </div>
              <button
                type="submit"
                disabled={addMemberMutation.isPending}
                className="btn-primary disabled:opacity-50"
              >
                {addMemberMutation.isPending ? "Inviting..." : "Send invite"}
              </button>
            </form>
          </div>

          {/* Or use invite links */}
          <div className="box box-shadow-hard p-6 bg-[var(--surface-2)]">
            <h3 className="font-display text-xl text-[var(--ink)] mb-2">
              Or use invite links
            </h3>
            <p className="text-sm text-[var(--ink-soft)] mb-4">
              Generate a link with a role pre-assigned. Share it via WhatsApp or anywhere.
            </p>
            <Link
              to="/projects/$projectId/invite-links"
              params={{ projectId }}
              className="btn-ghost"
            >
              Manage invite links
            </Link>
          </div>

          {/* Current members */}
          <div className="box box-shadow-hard p-6">
            <h2 className="font-display text-2xl text-[var(--ink)] mb-6">
              Current members
            </h2>
            <div className="space-y-3">
              {project.members
                .filter((m) => m.status !== "removed")
                .map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-4 border border-[var(--line)] bg-[var(--surface)]"
                  >
                    <div className="flex items-center gap-4">
                      {member.avatar_url && (
                        <img
                          src={member.avatar_url}
                          alt={member.name || member.email || ""}
                          className="w-10 h-10 rounded-full border border-[var(--line-strong)]"
                        />
                      )}
                      <div>
                        <div className="font-medium text-[var(--ink)]">
                          {member.name || member.email}
                        </div>
                        <div className="text-sm text-[var(--ink-soft)]">{member.role}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {member.status === "invited" && (
                        <span className="pill text-xs !py-1 !px-2 bg-[#FEF3C7] text-[#D97706] border-0">
                          Invited
                        </span>
                      )}
                      {member.status === "active" && (
                        <span className="pill text-xs !py-1 !px-2 bg-[#DCFCE7] text-[#16A34A] border-0">
                          Active
                        </span>
                      )}
                      {member.status === "declined" && (
                        <span className="pill text-xs !py-1 !px-2 bg-[#FEE2E2] text-[#DC2626] border-0">
                          Declined
                        </span>
                      )}
                      {member.role !== "Project Leader" && member.status === "active" && (
                        <button
                          onClick={() => {
                            if (confirm(`Remove ${member.name || member.email} from the project?`)) {
                              removeMemberMutation.mutate(member.id);
                            }
                          }}
                          className="text-sm text-[var(--destructive)] hover:underline"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
