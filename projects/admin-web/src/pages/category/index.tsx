import { Category, queryListCategory } from '@/services/category';
import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, Card, Space } from 'antd';
import notification from 'antd/lib/notification';
import moment from 'moment';
import React, { useRef, useState } from 'react';
import { CategoryForm } from './component/CategoryForm';

const CategoryList = () => {
  const actionRef = useRef<ActionType>();
  const [creating, setCreating] = useState<boolean>();
  const [editCategory, setEditCategory] = useState<Category | null>();
  const [searchCollapse, toggleSearchCollapse] = useState<boolean>(false);

  const columns: ProColumns<Category>[] = [
    {
      title: 'Name',
      dataIndex: 'name',
      hideInForm: true,
      render: (elm, row) => {
        return row.name ? row.name : ' – ';
      },
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      search: false,
      render: (elm, record) => {
        return moment(record.updatedAt).format('YYYY-MM-DD HH:MM');
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
              setEditCategory(record);
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
        title="Category"
        extra={
          <Button type="primary" onClick={() => setCreating(true)} ghost>
            New Category
          </Button>
        }
      >
        <Card size="small" actions={[<Button />]}>
          <ProTable<Category, Category>
            size="small"
            search={{
              collapsed: searchCollapse,
              onCollapse: (c) => toggleSearchCollapse(c),
            }}
            columns={columns}
            actionRef={actionRef}
            request={(params: any, sorter, filter) => {
              return queryListCategory({
                ...params,
                sorter,
                filter,
              });
            }}
            rowKey="id"
          ></ProTable>
        </Card>
        {creating && (
          <CategoryForm
            onClose={() => setCreating(false)}
            onFinish={() => {
              setCreating(false);
              notification.success({
                message: 'Category created successfully',
                key: 'category-created',
              });
              actionRef.current?.reload();
              setCreating(false);
            }}
            mode={editCategory ? 'edit' : 'new'}
          />
        )}
        {editCategory && (
          <CategoryForm
            onClose={() => setEditCategory(null)}
            onFinish={() => {
              setEditCategory(null);
              notification.success({
                message: 'Category updated successfully',
                key: 'category-updated',
              });
              actionRef.current?.reload();
              setEditCategory(null);
            }}
            mode={editCategory ? 'edit' : 'new'}
            initialValues={editCategory}
          />
        )}
      </PageContainer>
    </React.Fragment>
  );
};

export default () => CategoryList();
