import React from "react";
import { PageContainer } from "@ant-design/pro-layout";
import { Card } from "antd";
import Icon from "@ant-design/icons";
export default (): React.ReactNode => (
  <PageContainer>
    <Card>
      welcome{" "}
      <Icon
        type="table"
        style={{
          fontSize: "16px",
          color: "#F0F",
        }}
      />
    </Card>
  </PageContainer>
);
