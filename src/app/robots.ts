// src/app/robots.ts
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/mudir/",
    },
    sitemap: "https://menurutmu.vercel.app/sitemap.xml",
  };
}
