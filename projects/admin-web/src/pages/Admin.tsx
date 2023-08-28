import React from "react";
import { PageContainer } from "@ant-design/pro-layout";

export default (props: any): React.ReactNode => {
  return <PageContainer>{props.children}</PageContainer>;
};
