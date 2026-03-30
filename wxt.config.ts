import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: "src",
  modules: ["@wxt-dev/module-svelte"],
  manifest: {
    name: "HTML.MD",
    description: "Convert any web page to Markdown instantly",
    version: "1.0.0",
    permissions: ["activeTab", "tabs"],
    action: {
      default_title: "Convert page to Markdown",
    },
    icons: {
      16: "/icon/16.png",
      32: "/icon/32.png",
      48: "/icon/48.png",
      128: "/icon/128.png",
    },
    browser_specific_settings: {
      gecko: {
        id: "html.md@gir8.it",
        data_collection_permissions: {
          required: ["none"],
        },
        strict_min_version: "142.0",
      },
    } as any,
  },
});
