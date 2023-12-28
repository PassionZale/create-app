import { h } from "vue";
import DefaultTheme from "vitepress/theme";
import Logo from "./components/Logo.vue";

export default {
  ...DefaultTheme,

  Layout() {
    return h(DefaultTheme.Layout, null, {
      /**
       * 插槽参考
       *
       * @see layout-slots https://vitepress.dev/guide/extending-default-theme#layout-slots
       */
      "nav-bar-title-before": () =>
        h(Logo, { width: 40, height: 40, style: { marginRight: '10px', display: 'block' } }),
    });
  },
};
