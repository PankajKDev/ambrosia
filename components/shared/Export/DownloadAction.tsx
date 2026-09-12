import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";

export function DownloadAction() {
  const today = new Date().toISOString().slice(0, 10);

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

      <Button
        render={<a href="/api/export" download={`ambrosia-export-${today}.json`} />}
        size="lg"
        className="mt-4 w-full"
      >
        <Download className="size-4" />
        Download JSON
      </Button>

      <p className="mt-3 text-center text-xs text-muted-foreground">
        Format is JSON. Need CSV? Let us know.
      </p>
    </>
  );
}
