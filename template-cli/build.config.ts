import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  entries: ["src/index"],

  clean: true,

  declaration: false,

  rollup: {
    inlineDependencies: true,

    esbuild: {
      minify: true,
    },
  },
});
