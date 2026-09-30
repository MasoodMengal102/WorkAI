import { MetadataRoute } from "next";
import { BRAND } from "@/config/brand";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/dashboard",
          "/api/",
          "/go/",
          "/login",
          "/register",
        ],
      },
    ],
    sitemap: `${BRAND.domain}/sitemap.xml`,
  };
}
