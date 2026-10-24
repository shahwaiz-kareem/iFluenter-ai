export default function manifest() {
  return {
    name: "iFluenter",
    short_name: "iFluenter",
    description: "An app which promises to make you fluent.",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#030712",
    // theme_color: "#7c66f5",
    icons: [
      {
        src: "/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
