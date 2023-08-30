import { CategorySelect } from '@/components/CategorySelect/CategorySelect';
import { Story, createStory, updateStory } from '@/services/story';
import { Form, Input, Modal } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import React from 'react';
import { useRequest } from 'umi';

type Props = {
  onFinish: () => any;
  onClose: () => any;
  mode: 'new' | 'edit';
  initialValues?: Story;
};

export const StoryForm = (props: Props) => {
  const { mode } = props;
  const { run: runCreate } = useRequest((data) => createStory(data), {
    manual: true,
  });
  const { run: runUpdate } = useRequest(
    (data) =>
      updateStory({
        ...data,
        id: props.initialValues!.id,
      }),
    {
      manual: true,
    },
  );

  const [form] = Form.useForm<Story>();

  const initialValues = props.initialValues;

  return (
    <Modal
      width={867}
      okButtonProps={{
        form: 'story-form',
        htmlType: 'submit',
      }}
      okText={'Save'}
      onCancel={() => props.onClose()}
      visible
      title={mode === 'new' ? 'Create Story' : 'Update Story'}
    >
      <Form
        form={form}
        initialValues={initialValues}
        id="story-form"
        layout="vertical"
        onFinish={async (values) => {
          delete values['clientDocumentSearch'];

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
        <Form.Item name="title" label="Title" required>
          <Input />
        </Form.Item>

        <Form.Item
          name="categoryId"
          label="Category"
          initialValue={initialValues?.category.id}
          required
        >
          <CategorySelect />
        </Form.Item>

        <Form.Item name="keywords" label="Keywords">
          <Input />
        </Form.Item>

        <Form.Item name="content" label="Content">
          <TextArea />
        </Form.Item>
      </Form>
    </Modal>
  );
};
