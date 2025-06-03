import { defineConfig } from "vite";
import path from "node:path";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import tailwindcss from "@tailwindcss/vite";
import { viteSingleFile } from "vite-plugin-singlefile";

export default defineConfig(({ mode }) => {
  if (process.env.DEV) {
    return {
      root: path.resolve(__dirname, "src"),
      plugins: [svelte(), tailwindcss()],
      resolve: {
        alias: {
          $lib: path.resolve("./src/lib"),
        },
      },
    };
  }
  return {
    root: path.resolve(__dirname, "src"),
    plugins: [svelte(), tailwindcss(), viteSingleFile()],
    resolve: {
      alias: {
        $lib: path.resolve("./src/lib"),
      },
    },
    build: {
      outDir: path.resolve(__dirname, "dist"),
      rollupOptions: {
        input:
          mode === "dock"
            ? path.resolve(__dirname, "./src/dock.html")
            : mode === "source"
            ? path.resolve(__dirname, "./src/source.html")
            : undefined,
      },
    },
  };
});
