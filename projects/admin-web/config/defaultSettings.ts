import { Settings as LayoutSettings } from "@ant-design/pro-layout";

export default {
  antd: {
    componentSize: "small",
  },
  navTheme: "dark",
  logo: "",
  primaryColor: "#096dd9",
  layout: "side",
  headerHeight: 54,
  contentWidth: "Fluid",
  fixedHeader: true,
  fixSiderbar: true,
  // colorWeak: false,
  splitMenus: false,
  siderWidth: 240,
  menu: {
    locale: false,
  },
  title: "",
  pwa: true,
  iconfontUrl: "",
} as LayoutSettings & {
  pwa: boolean;
};
