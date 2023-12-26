import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  entries: ["src"],

  clean: true,

  declaration: false,

  rollup: {
    inlineDependencies: true,

    esbuild: {
      target: "node16",
      minify: true,
    },
  },
});
