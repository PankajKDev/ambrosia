import { Globe } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function GoogleButton({
  label,
  onClick,
  disabled,
  className,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      onClick={onClick}
      disabled={disabled}
      className={cn("w-full", className)}
    >
      <Globe className="size-4 text-foreground/80" />
      {label}
    </Button>
  );
}

export default GoogleButton;