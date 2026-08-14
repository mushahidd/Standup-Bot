import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { members } from "@/lib/api";
import { useEffect } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/join/$token")({
  component: JoinInvite,
});

function JoinInvite() {
  const { token } = Route.useParams();
  const { user, isLoading: authLoading, login } = useAuth();
  const navigate = useNavigate();

  const { data: invite, isLoading: inviteLoading, error } = useQuery({
    queryKey: ["invite", token],
    queryFn: () => members.previewInvite(token),
    retry: false,
  });

  const acceptMutation = useMutation({
    mutationFn: () => members.acceptInvite(token),
    onSuccess: (data) => {
      toast.success("Welcome to the team!");
      navigate({
        to: "/projects/$projectId",
        params: { projectId: data.project_id },
      });
    },
    onError: (error: any) => {
      toast.error(error.data?.detail || "Failed to accept invite");
    },
  });

  // If not logged in, redirect to Google OAuth
  useEffect(() => {
    if (!authLoading && !user) {
      // Store the invite token in sessionStorage so we can redirect back after auth
      sessionStorage.setItem("pending_invite", token);
      login();
    }
  }, [authLoading, user, login, token]);

  // Check if we just came back from OAuth
  useEffect(() => {
    if (user) {
      const pendingInvite = sessionStorage.getItem("pending_invite");
      if (pendingInvite === token) {
        sessionStorage.removeItem("pending_invite");
      }
    }
  }, [user, token]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-3 h-3 bg-[var(--persian)] rotate-45 animate-pulse" />
          <p className="mt-4 text-[var(--ink-soft)]">Redirecting to sign in...</p>
        </div>
      </div>
    );
  }

  if (inviteLoading) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-3 h-3 bg-[var(--persian)] rotate-45 animate-pulse" />
          <p className="mt-4 text-[var(--ink-soft)]">Loading invite...</p>
        </div>
      </div>
    );
  }

  if (error || !invite) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center px-6">
        <div className="max-w-md w-full">
          <div className="box border-[var(--destructive)] bg-[#FEE2E2] p-8 text-center">
            <div className="inline-block w-4 h-4 bg-[var(--destructive)] rotate-45 mb-4" />
            <h1 className="font-display text-2xl text-[var(--destructive)] mb-2">
              Invalid invite
            </h1>
            <p className="text-[var(--destructive)]/80 mb-6">
              {error?.status === 410
                ? "This invite link has already been used."
                : "This invite link is invalid or has expired."}
            </p>
            <button
              onClick={() => navigate({ to: "/dashboard" })}
              className="btn-ghost"
            >
              Go to dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        <div className="box box-shadow-hard p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-block w-4 h-4 bg-[var(--persian)] rotate-45 mb-4" />
            <h1 className="font-display text-3xl text-[var(--ink)] mb-2">
              You're invited!
            </h1>
            <p className="text-[var(--ink-soft)]">
              Join the team and start collaborating
            </p>
          </div>

          {/* Invite details */}
          <div className="space-y-4 mb-8">
            <div className="p-4 bg-[var(--surface-2)] border border-[var(--line)]">
              <div className="text-xs text-[var(--ink-soft)] mb-1">Project</div>
              <div className="font-display text-xl text-[var(--ink)]">
                {invite.project_name}
              </div>
            </div>
            <div className="p-4 bg-[var(--surface-2)] border border-[var(--line)]">
              <div className="text-xs text-[var(--ink-soft)] mb-1">Your role</div>
              <div className="font-medium text-[var(--ink)]">{invite.role}</div>
            </div>
            <div className="p-4 bg-[var(--surface-2)] border border-[var(--line)]">
              <div className="text-xs text-[var(--ink-soft)] mb-1">Signed in as</div>
              <div className="font-medium text-[var(--ink)]">{user.email}</div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={() => acceptMutation.mutate()}
              disabled={acceptMutation.isPending}
              className="btn-primary w-full justify-center disabled:opacity-50"
            >
              {acceptMutation.isPending ? (
                <>
                  <div className="inline-block w-3 h-3 bg-[var(--ghost)] rotate-45 animate-pulse" />
                  Joining...
                </>
              ) : (
                <>
                  Accept & join project
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </button>
            <button
              onClick={() => navigate({ to: "/dashboard" })}
              className="btn-ghost w-full justify-center"
            >
              Decline
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-[var(--ink-soft)] mt-6">
          By accepting, you'll be able to submit daily standups and view team briefs.
        </p>
      </div>
    </div>
  );
}
