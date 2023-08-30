import { CategorySelect } from '@/components/CategorySelect/CategorySelect';
import { Story, queryListStory } from '@/services/story';
import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, Card, Space } from 'antd';
import notification from 'antd/lib/notification';
import moment from 'moment';
import React, { useRef, useState } from 'react';
import { StoryForm } from './component/StoryForm';

const StoryList = () => {
  const actionRef = useRef<ActionType>();
  const [creating, setCreating] = useState<boolean>();
  const [editStory, setEditStory] = useState<Story | null>();
  const [searchCollapse, toggleSearchCollapse] = useState<boolean>(false);

  const columns: ProColumns<Story>[] = [
    {
      title: 'Title',
      dataIndex: 'title',
      hideInForm: true,
      search: false,
      render: (elm, row) => {
        return row.title ? row.title : ' – ';
      },
    },
    {
      title: 'Content',
      dataIndex: 'content',
      hideInForm: true,
      search: false,
      render: (elm, row) => {
        return row.content ? row.content : ' – ';
      },
    },
    {
      title: 'Keywords',
      dataIndex: 'keywords',
    },
    {
      title: 'Category',
      dataIndex: 'categoryId',
      render: (elm, record) => {
        return record.category?.name;
      },
      renderFormItem: () => {
        return <CategorySelect allowClear={true} />;
      },
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      search: false,
      render: (elm, record) => {
        return moment(record.createdAt).format('YYYY-MM-DD HH:MM');
      },
    },
    {
      title: 'Upated At',
      dataIndex: 'updatedAt',
      search: false,
      render: (elm, record) => {
        return moment(record.updatedAt).format('YYYY-MM-DD HH:MM');
      },
    },
    {
      title: 'Action',
      valueType: 'option',
      search: false,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            onClick={() => {
              setEditStory(record);
            }}
          >
            Edit
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <React.Fragment>
      <PageContainer
        extra={
          <Button type="primary" onClick={() => setCreating(true)} ghost>
            New Story
          </Button>
        }
        title="Story"
      >
        <Card size="small" actions={[<Button />]}>
          <ProTable<Story, Story>
            size="small"
            search={{
              collapsed: searchCollapse,
              onCollapse: (c) => toggleSearchCollapse(c),
            }}
            columns={columns}
            actionRef={actionRef}
            request={(params: any, sorter, filter) => {
              return queryListStory({
                ...params,
                sorter,
                filter,
              });
            }}
            rowKey="id"
          ></ProTable>
        </Card>
        {creating && (
          <StoryForm
            onClose={() => setCreating(false)}
            onFinish={async () => {
              setCreating(false);
              notification.success({
                message: 'Story created successfully',
                key: 'story-created',
              });
              actionRef.current?.reload();
              setCreating(false);
            }}
            mode={editStory ? 'edit' : 'new'}
          />
        )}
        {editStory && (
          <StoryForm
            onClose={() => setEditStory(null)}
            onFinish={async () => {
              setEditStory(null);
              notification.success({
                message: 'Story updated successfully',
                key: 'story-updated',
              });
              actionRef.current?.reload();
              setEditStory(null);
            }}
            mode={editStory ? 'edit' : 'new'}
            initialValues={editStory}
          />
        )}
      </PageContainer>
    </React.Fragment>
  );
};

export default () => StoryList();
