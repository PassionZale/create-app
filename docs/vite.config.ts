import type { UserConfig } from "vite";

export default (): UserConfig => {
  return {
    root: "./docs",
    optimizeDeps: {
      exclude: ["vitepress"],
    },
    server: {
      port: 9000,
    },
  };
};
