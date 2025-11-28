import Link from "next/link";
import { CheckCircle2, LogIn, ArrowRight } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { hasEnvVars } from "@/lib/utils";

export default async function Home() {
  const envReady = Boolean(hasEnvVars);
  const supabase = envReady ? await createClient() : null;
  const { data } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
  const user = data.user;

  const metadata = (user?.user_metadata as Record<string, string | undefined>) ?? {};
  const firstName = metadata.first_name ?? metadata.firstName;
  const lastName = metadata.last_name ?? metadata.lastName;
  const combinedName = [firstName, lastName].filter(Boolean).join(" ").trim() || undefined;
  const nameFromMetadata = metadata.full_name ?? metadata.name ?? combinedName;
  const displayName = nameFromMetadata || user?.email;
  const headingText = user
    ? displayName
      ? `Welcome back, ${displayName}.`
      : "Welcome back."
    : "Welcome to the admin portal.";

  return (
    <main className="min-h-[70vh] bg-gradient-to-b from-secondary/5 via-ternary/5 to-background">
      <div className="max-w-5xl w-full mx-auto px-6 py-14 flex flex-col gap-10">
        <div className="space-y-3">
          <h1 className="text-4xl md:text-5xl font-bold text-primary">{headingText}</h1>
          <p className="text-lg text-neutral-700 max-w-3xl">
            {user
              ? "You're signed in and ready to keep UBC Bionics content fresh."
              : "Sign in to access the editing tools for blogs, members, and more."}
          </p>
          {!envReady && (
            <div className="rounded-xl border border-dashed border-primary/30 bg-primary/5 px-4 py-3 text-sm text-primary">
              Supabase keys are not set. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY to enable login detection.
            </div>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <section className="rounded-2xl border bg-white/70 backdrop-blur shadow-sm p-6">
            <div className="flex items-start gap-4">
              <div
                className={`rounded-full p-3 ${user ? "bg-secondary/10 text-secondary" : "bg-primary/10 text-primary"}`}
              >
                {user ? <CheckCircle2 className="h-6 w-6" /> : <LogIn className="h-6 w-6" />}
              </div>
              <div className="space-y-2">
                <div>
                  <p className="text-sm font-medium text-neutral-600">Login status</p>
                  <h2 className="text-2xl font-semibold text-primary">
                    {user ? "You're logged in" : "Awaiting sign-in"}
                  </h2>
                </div>
                <p className="text-sm text-neutral-600">
                  {user
                    ? "Thanks for verifying your credentials. Admin tools are unlocked."
                    : "Use your team email to log in and unlock the admin tools."}
                </p>
                {!user && (
                  <Link
                    href="/auth/login"
                    className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-background text-sm font-semibold hover:bg-secondary transition-colors"
                  >
                    Go to login
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                )}
              </div>
            </div>
          </section>

          <section className="rounded-2xl border bg-primary text-background shadow-sm p-6 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-background/10 p-2">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <p className="text-sm uppercase tracking-[0.2em]">Welcome</p>
            </div>
            <p className="text-lg leading-relaxed">
              {user
                ? `Good to see you, ${displayName}. You can jump straight into updating content.`
                : "Log in to manage posts, members, and more for the main site."}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <Link
                href="/blogs-select"
                className="group inline-flex items-center justify-between rounded-xl bg-background/10 px-4 py-3 font-semibold hover:bg-background/20 transition-colors"
              >
                Manage blogs
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/edit-members"
                className="group inline-flex items-center justify-between rounded-xl bg-background/10 px-4 py-3 font-semibold hover:bg-background/20 transition-colors"
              >
                Manage members
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
