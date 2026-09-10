"use client";

import { useState } from "react";
import { Check, Download, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

export function DownloadAction() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const today = new Date().toISOString().slice(0, 10);

  const handleDownload = async () => {
    setIsDownloading(true);
    setError(null);
    setDone(false);
    try {
      const res = await fetch("/api/export", { cache: "no-store" });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(body?.error ?? "Failed to export");
      }

      const disposition = res.headers.get("Content-Disposition");
      const filenameMatch = disposition?.match(/filename="?([^"]+)"?/);
      const filename = filenameMatch?.[1] ?? `ambrosia-export-${today}.json`;

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setDone(true);
      setTimeout(() => setDone(false), 3000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to export");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      <div className="rounded-3xl border border-dashed border-border bg-muted/40 px-4 py-3">
        <p className="text-xs font-medium text-muted-foreground">File</p>
        <p className="mt-1 font-mono text-sm font-medium text-foreground">
          ambrosia-export-{today}.json
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          JSON · notes + insights + profile · exported {today}
        </p>
      </div>

      {error && (
        <p
          role="alert"
          className="mt-4 rounded-2xl border border-destructive/20 bg-destructive/10 px-3.5 py-2.5 text-sm font-medium text-destructive"
        >
          {error}
        </p>
      )}

      {done && !error && (
        <p className="mt-4 flex items-center gap-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-400">
          <Check className="size-4" /> Downloaded. Check your downloads folder.
        </p>
      )}

      <Button
        onClick={handleDownload}
        disabled={isDownloading}
        size="lg"
        className="mt-4 w-full"
      >
        {isDownloading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : done ? (
          <Check className="size-4" />
        ) : (
          <Download className="size-4" />
        )}
        {isDownloading ? "Preparing…" : done ? "Downloaded" : "Download JSON"}
      </Button>
    </>
  );
}
