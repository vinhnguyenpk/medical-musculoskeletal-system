import { Category, createCategory, updateCategory } from '@/services/category';
import { Form, Input, Modal } from 'antd';
import React from 'react';
import { useRequest } from 'umi';

type Props = {
  onFinish: () => void;
  onClose: () => void;
  mode: 'new' | 'edit';
  initialValues?: Category;
};

export const CategoryForm = (props: Props) => {
  const { mode } = props;
  const { run: runCreate } = useRequest((data) => createCategory(data), {
    manual: true,
  });
  const { run: runUpdate } = useRequest(
    (data) =>
      updateCategory({
        ...data,
        id: props.initialValues!.id,
      }),
    {
      manual: true,
    },
  );

  const [form] = Form.useForm<Category>();

  const initialValues = props.initialValues;

  return (
    <Modal
      width={867}
      okButtonProps={{
        form: 'category-form',
        htmlType: 'submit',
      }}
      okText={'Save'}
      onCancel={() => props.onClose()}
      visible
      title={mode === 'new' ? 'Create Category' : 'Update Category'}
    >
      <Form
        form={form}
        initialValues={initialValues}
        id="category-form"
        layout="vertical"
        onFinish={async (values) => {
          switch (mode) {
            case 'new':
              await runCreate(values);
              props.onFinish();
              break;

            case 'edit':
              await runUpdate(values);
              props.onFinish();
              break;
          }
        }}
      >
        <Form.Item name="name" label="Name" required>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};
