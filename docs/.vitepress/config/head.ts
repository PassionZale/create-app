import type { HeadConfig } from "vitepress";

const defaultHead: HeadConfig[] = [
  /** 标签栏略缩图 */
  [
    "link",
    {
      rel: "icon",
      href: "/favicon.ico",
    },
  ],

  [
    "link",
    {
      rel: "apple-touch-icon",
      href: "/apple-touch-icon.png",
    },
  ],

  /** viewport */
  [
    "meta",
    {
      name: "viewport",
      content:
        "initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no, viewport-fit=cover",
    },
  ],
  /** Keywords */
  [
    "meta",
    {
      name: "Keywords",
      content: "cli, templates, create-app, unbuild, miniprogram, vue, react",
    },
  ],
  /** author */
  [
    "meta",
    {
      name: "author",
      content: "Lei Zhang",
    },
  ],
  /** og title */
  [
    "meta",
    {
      property: "og:title",
      content: "@whouu/create-app",
    },
  ],
  /** og type */
  [
    "meta",
    {
      property: "og:type",
      content: "website",
    },
  ],
  /** og image */
  [
    "meta",
    {
      property: "og:image",
      content: "/favicon.ico",
    },
  ],
  /** og description */
  [
    "meta",
    {
      property: "og:description",
      content: "使用 @whouu/create-app 创建应用",
    },
  ],
  /** OG site_name */
  [
    "meta",
    {
      property: "og:site_name",
      content: "@whouu/create-app",
    },
  ],
] as HeadConfig[];

const vercelAnalytics: HeadConfig[] = [
  [
    "script",
    {},
    `window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };`,
  ],
  [
    "script",
    {
      src: "/_vercel/insights/script.js",
      defer: "",
    },
  ],
] as HeadConfig[];

export const head =
  process.env.NODE_ENV === "production"
    ? defaultHead.concat(vercelAnalytics)
    : defaultHead;
