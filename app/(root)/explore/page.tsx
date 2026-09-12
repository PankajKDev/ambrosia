import { BookOpen, MessageCircle } from "lucide-react";

import { adhdArticleResources, adhdCommunities } from "@/constants";
import ResourceLink from "@/components/ui/resourceLink";

function page() {
  return (
    <main className="min-h-screen bg-background">
      <section className="border-b border-border bg-(--mood-soft)/30 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Explore
          </p>
          <h1 className="mt-3 max-w-3xl font-heading text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            ADHD-friendly resources for real-life support
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Peer spaces and trusted reading for learning, reflection, and better
            daily systems. These links are educational and are not a replacement
            for professional care.
          </p>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-2">
          <div>
            <div className="flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-2xl bg-(--mood-soft) text-(--mood-gold)">
                <MessageCircle className="size-5" aria-hidden="true" />
              </span>
              <div>
                <h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
                  Communities
                </h2>
                <p className="text-sm text-muted-foreground">
                  Reddit and X spaces for peer discussion.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4">
              {adhdCommunities.map((community) => (
                <article
                  key={`${community.platform}-${community.name}`}
                  className="rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-sm shadow-primary/5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        {community.platform}
                      </p>
                      <h3 className="mt-1 font-heading text-lg font-semibold tracking-tight">
                        {community.name}
                      </h3>
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {community.description}
                  </p>
                  <ResourceLink href={community.href}>
                    Visit community
                  </ResourceLink>
                </article>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-2xl bg-(--mood-soft) text-(--mood-gold)">
                <BookOpen className="size-5" aria-hidden="true" />
              </span>
              <div>
                <h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
                  ADHD Articles
                </h2>
                <p className="text-sm text-muted-foreground">
                  Credible guides and explainers.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4">
              {adhdArticleResources.map((resource) => (
                <article
                  key={`${resource.source}-${resource.title}`}
                  className="rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-sm shadow-primary/5"
                >
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {resource.source}
                  </p>
                  <h3 className="mt-1 font-heading text-lg font-semibold tracking-tight">
                    {resource.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {resource.description}
                  </p>
                  <ResourceLink href={resource.href}>Read article</ResourceLink>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default page;
