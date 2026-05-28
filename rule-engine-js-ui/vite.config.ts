import { resolve } from "path";
import { defineConfig, esmExternalRequirePlugin } from "vite";
import react from "@vitejs/plugin-react";
import dts from "unplugin-dts/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
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
      fileName: "rule-engine-js-ui",
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
