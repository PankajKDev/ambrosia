import { ExternalLink } from "lucide-react";

function ResourceLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-(--mood-gold)"
    >
      {children}
      <ExternalLink className="size-4" aria-hidden="true" />
    </a>
  );
}

export default ResourceLink;
