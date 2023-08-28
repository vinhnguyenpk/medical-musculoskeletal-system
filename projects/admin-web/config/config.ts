// https://umijs.org/config/
import { defineConfig } from "umi";
import defaultSettings from "./defaultSettings";
import proxy from "./proxy";

const { REACT_APP_ENV } = process.env;

export default defineConfig({
  mfsu: {},
  webpack5: {},
  esbuild: {},
  define: {
    ADMIN_API_URL: process.env.ADMIN_API_URL,
    ONBOARDING_FORM_URL: process.env.ONBOARDING_FORM_URL,
  },
  hash: true,
  antd: {
    dark: false,
    // compact: true,
  },
  dva: {
    hmr: true,
  },
  layout: {
    name: "Trust Platform Admin",
    locale: "en",
  },
  locale: {
    // default zh-CN
    default: "en-US",
    antd: true,
    baseSeparator: "-",
    baseNavigator: false,
  },
  dynamicImport: {
    loading: "@/components/PageLoading/index",
  },
  targets: {
    ie: 11,
  },
  routes: [
    {
      path: "/dashboard",
      name: "Dashboard",
      component: "@/pages/welcome",
    },
    {
      path: "/",
      exact: true,
      redirect: "/dashboard",
    },
    {
      component: "./404",
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // ...darkTheme,
    "font-size-base": "12px",
    "card-padding-base": "21px",
    "card-head-padding": "14px",
    "primary-color": defaultSettings.primaryColor,
    "layout-header-background": "#000000",
    "menu-dark-item-active-bg": defaultSettings.primaryColor,
    "menu-dark-selected-item-text-color": "#FFFFFF",
    "menu-dark-selected-item-icon-color": "#FFFFFF",
  },
  // @ts-ignore
  title: false,
  ignoreMomentLocale: false,
  proxy: proxy[REACT_APP_ENV || "dev"],
  manifest: {
    basePath: "/",
  },
});
