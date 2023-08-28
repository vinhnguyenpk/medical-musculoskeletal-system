import Icon from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { Card } from 'antd';
import React from 'react';

const Welcome: React.FC = () => {
  return (
    <PageContainer>
      <Card>
        welcome{' '}
        <Icon
          type="table"
          style={{
            fontSize: '16px',
            color: '#F0F',
          }}
        />
      </Card>
    </PageContainer>
  );
};

export default Welcome;
