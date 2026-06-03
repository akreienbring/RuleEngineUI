import { resolve } from "path";
import { defineConfig, esmExternalRequirePlugin } from "vite";
import react from "@vitejs/plugin-react";
import dts from "unplugin-dts/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    dts({
      tsconfigPath: "./tsconfig.json",
    }),
  ],
  resolve: {
    alias: [
      {
        find: /^@src(.+)/,
        replacement: resolve(process.cwd(), "./src/$1"),
      },
    ],
  },
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "RuleEngineJSUI",
      fileName: (format) => {
        if (format === "es") return "index.mjs";
        return `index.js`;
      },
      formats: ["es"],
    },
    rollupOptions: {
      //external: ["react"],
      plugins: [
        esmExternalRequirePlugin({
          external: [/^react(-dom)?(\/.+)?$/],
        }),
      ],
      output: {
        globals: {
          react: "React",
        },
      },
    },
  },
});
