import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_BASE_URL!;

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/pricing`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/explore`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];
}
