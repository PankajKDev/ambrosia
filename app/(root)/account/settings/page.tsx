"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  FlaskConical,
  Laptop,
  Loader2,
  Moon,
  Settings,
  Sparkles,
  Sun,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { useTheme } from "@teispace/next-themes";
import { cn } from "@/lib/utils";
import Switch from "@/components/ui/switch";
import SectionCard from "@/components/shared/Settings/SectionCard";

const themeOptions = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Laptop },
];

export default function SettingsPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user ?? null;
  const { theme, setTheme } = useTheme();

  const [aiEnabled, setAiEnabled] = useState(Boolean(user?.aiEnabled));
  const [isSaving, setIsSaving] = useState(false);
  const [saveState, setSaveState] = useState<"idle" | "saved" | "error">(
    "idle",
  );

  if (isPending) return null;
  if (!user) {
    router.replace("/sign-in");
    return null;
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6">
      <header className="flex items-center gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-(--mood-soft) text-(--mood-gold)">
          <Settings className="size-5" />
        </span>
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
            Settings
          </h1>
          <p className="text-sm text-muted-foreground">
            Tune how Ambrosia looks and works for you.
          </p>
        </div>
      </header>

      <div className="mt-8 space-y-6">
        <SectionCard
          title="Appearance"
          description="Choose how Ambrosia looks. System follows your device."
          icon={Sun}
        >
          <div className="grid grid-cols-3 gap-2.5">
            {themeOptions.map((opt) => {
              const active = theme === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setTheme(opt.value)}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-3xl border px-3 py-4 text-sm font-medium transition-all focus-visible:outline-2 focus-visible:outline-ring",
                    active
                      ? "border-(--mood-gold)/40 bg-(--mood-soft) shadow-sm"
                      : "border-border hover:bg-muted",
                  )}
                >
                  <opt.icon className="size-5 text-(--mood-gold)" />
                  {opt.label}
                </button>
              );
            })}
          </div>
        </SectionCard>

        <SectionCard
          title="AI insights"
          description="Let Ambrosia read your check-ins and surface patterns."
          icon={Sparkles}
          badge="Experimental"
        >
          <div className="flex items-center justify-between gap-4 rounded-3xl border border-border bg-background px-4 py-3.5">
            <div>
              <p className="text-sm font-medium text-foreground">
                Enable AI for insights
              </p>
              <p className="text-xs text-muted-foreground">
                If turned off, insights show raw data only.
              </p>
            </div>
            <div className="flex items-center gap-3">
              {isSaving ? (
                <Loader2 className="size-4 animate-spin text-muted-foreground" />
              ) : saveState === "saved" ? (
                <p className="flex items-center gap-1 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                  <Check className="size-4" /> Saved
                </p>
              ) : saveState === "error" ? (
                <p className="text-sm font-medium text-destructive">
                  Couldn&apos;t save
                </p>
              ) : null}
              <Switch
                checked={aiEnabled}
                disabled={isSaving}
                onChange={(v) => {
                  setAiEnabled(v);
                  setSaveState("idle");
                  setIsSaving(true);
                  authClient
                    .updateUser({
                      aiEnabled: v,
                    })
                    .then(() => setSaveState("saved"))
                    .catch(() => setSaveState("error"))
                    .finally(() => setIsSaving(false));
                }}
              />
            </div>
          </div>

          <p className="mt-4 flex items-start gap-2 rounded-2xl bg-amber-500/10 px-3.5 py-2.5 text-xs leading-relaxed text-amber-700 dark:text-amber-400">
            <FlaskConical className="mt-0.5 size-3.5 shrink-0" />
            This feature is experimental. AI-generated insights may be imprecise
            and should not replace professional advice.
          </p>
        </SectionCard>
      </div>
    </div>
  );
}
