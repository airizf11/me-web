// src/app/sitemap.ts
import { MetadataRoute } from "next";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createServerSupabaseClient();
  const baseUrl = "https://menurutmu.vercel.app";

  const { data: menus } = await supabase
    .from("menus")
    .select("slug, updated_at");
  const menuUrls =
    menus?.map((menu) => ({
      url: `${baseUrl}/menu/${menu.slug}`,
      lastModified: new Date(menu.updated_at),
    })) ?? [];

  const staticUrls = [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/menu`, lastModified: new Date() },
    { url: `${baseUrl}/about`, lastModified: new Date() },
    { url: `${baseUrl}/contact`, lastModified: new Date() },
  ];

  return [...staticUrls, ...menuUrls];
}
