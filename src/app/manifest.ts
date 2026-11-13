import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return { name: "Lumen", short_name: "Lumen", start_url: "/", display: "standalone", background_color: "#0f0d0b", theme_color: "#0f0d0b", icons: [{ src: "/favicon.ico", sizes: "any", type: "image/x-icon" }] };
}
