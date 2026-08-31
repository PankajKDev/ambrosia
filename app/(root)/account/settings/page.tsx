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
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const themeOptions = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Laptop },
];

const modelOptions = [
  { value: "gemini", label: "Gemini" },
  { value: "chatgpt", label: "ChatGPT" },
  { value: "deepseek", label: "DeepSeek" },
  { value: "claude", label: "Claude" },
];

const LABELS: Record<string, string> = {
  gemini: "Gemini",
  chatgpt: "ChatGPT",
  deepseek: "DeepSeek",
  claude: "Claude",
};

type AiUser = {
  aiEnabled?: boolean;
  aiModel?: string;
};

function SectionCard({
  title,
  description,
  icon: Icon,
  badge,
  children,
}: {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-4xl border border-border bg-background/85 p-6 shadow-sm sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-(--mood-soft) text-(--mood-gold)">
            <Icon className="size-5" />
          </span>
          <div>
            <h2 className="font-heading text-lg font-semibold tracking-tight text-foreground">
              {title}
            </h2>
            <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
          </div>
        </div>
        {badge && (
          <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/40 bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-600 dark:text-amber-400">
            <FlaskConical className="size-3" />
            {badge}
          </span>
        )}
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function Switch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-7 w-12 shrink-0 items-center rounded-full border transition-colors focus-visible:outline-2 focus-visible:outline-ring",
        checked
          ? "border-(--mood-gold)/50 bg-(--mood-gold)"
          : "border-border bg-muted",
      )}
    >
      <span
        className={cn(
          "inline-block size-5 transform rounded-full bg-background shadow transition-transform",
          checked ? "translate-x-6" : "translate-x-1",
        )}
      />
    </button>
  );
}

export default function SettingsPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user as unknown as AiUser | null;

  const [theme, setTheme] = useState<string>(() => {
    if (typeof window === "undefined") return "system";
    return localStorage.getItem("theme") || "system";
  });
  const [aiEnabled, setAiEnabled] = useState(Boolean(user?.aiEnabled));
  const [aiModel, setAiModel] = useState(user?.aiModel || "gemini");
  const [isSaving, setIsSaving] = useState(false);
  const [saveState, setSaveState] = useState<"idle" | "saved" | "error">("idle");

  if (isPending) return null;
  if (!user) {
    router.replace("/sign-in");
    return null;
  }

  const applyTheme = (value: string) => {
    localStorage.setItem("theme", value);
    setTheme(value);
    const root = document.documentElement;
    const isDark =
      value === "dark" ||
      (value === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    root.classList.toggle("dark", isDark);
  };

  const handleSaveAi = async () => {
    setIsSaving(true);
    setSaveState("idle");
    try {
      await authClient.updateUser({
        aiEnabled,
        aiModel,
      } as unknown as Parameters<typeof authClient.updateUser>[0]);
      setSaveState("saved");
    } catch {
      setSaveState("error");
    } finally {
      setIsSaving(false);
    }
  };

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
                  onClick={() => applyTheme(opt.value)}
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
            <Switch
              checked={aiEnabled}
              onChange={(v) => {
                setAiEnabled(v);
                setSaveState("idle");
              }}
            />
          </div>

          <div className="mt-4 flex items-center justify-between gap-4 rounded-3xl border border-border bg-background px-4 py-3.5">
            <div>
              <p className="text-sm font-medium text-foreground">AI model</p>
              <p className="text-xs text-muted-foreground">
                Which model powers your insights.
              </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="outline"
                    className="justify-between gap-2 min-w-36"
                  />
                }
              >
                {LABELS[aiModel] || "Gemini"}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuRadioGroup
                  value={aiModel}
                  onValueChange={(v) => {
                    setAiModel(v);
                    setSaveState("idle");
                  }}
                >
                  {modelOptions.map((m) => (
                    <DropdownMenuRadioItem key={m.value} value={m.value}>
                      {m.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <p className="mt-4 flex items-start gap-2 rounded-2xl bg-amber-500/10 px-3.5 py-2.5 text-xs leading-relaxed text-amber-700 dark:text-amber-400">
            <FlaskConical className="mt-0.5 size-3.5 shrink-0" />
            This feature is experimental. AI-generated insights may be
            imprecise and should not replace professional advice.
          </p>

          <div className="mt-4 flex items-center justify-end gap-3">
            {saveState === "saved" && (
              <p className="flex items-center gap-1 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                <Check className="size-4" /> Saved
              </p>
            )}
            {saveState === "error" && (
              <p className="text-sm font-medium text-destructive">
                Couldn&apos;t save. Try again.
              </p>
            )}
            <Button onClick={handleSaveAi} disabled={isSaving}>
              {isSaving ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                "Save AI settings"
              )}
            </Button>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
