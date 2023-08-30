import { Select, Spin } from 'antd';
import { debounce } from 'lodash';
import React, { useState } from 'react';
import { request, useRequest } from 'umi';
const Option = Select.Option;

export type Props = {
  value?: string | string[];
  multiple?: boolean;
  onChange?: (
    value: string,
  ) => any | ((value: string, option?: { current: string[] }) => Promise<void>);
  allowClear?: boolean;
  disabled?: boolean;
  debounceInterval?: number;
  customData?: Array<{ value: string; label: string }>;
  status?: string;
  onSelect?: Function;
  onDeselect?: Function;
};

export const CategorySelect = (props: Props) => {
  const { multiple, onChange, allowClear, disabled, debounceInterval = 300 } = props;

  const [searchText, setSearchText] = useState<string>('');

  const { data, loading } = useRequest(
    () => {
      return request(`/category`, {
        params: {
          name: searchText,
          pageSize: 1000,
        },
      });
    },
    {
      refreshDeps: [props.value, searchText],
      initialData: [],
    },
  );

  return (
    <Select
      showSearch
      mode={multiple ? 'multiple' : undefined}
      placeholder="Select Category"
      notFoundContent={loading ? <Spin size="small" /> : null}
      value={props.value as any}
      filterOption={false}
      onSearch={debounce(setSearchText, debounceInterval)}
      onChange={onChange}
      style={{ width: '100%' }}
      allowClear={allowClear}
      disabled={disabled}
      getPopupContainer={(triggerNode) => triggerNode.parentNode}
    >
      {props?.customData &&
        props.customData.map((item, i) => (
          <Option value={item.value} key={`customCategorySelect-${i}`}>
            {item.label}
          </Option>
        ))}
      {data?.map((d: { id: string; name: string }) => {
        return (
          <Option value={d.id} key={d.id}>
            {d.name}
          </Option>
        );
      })}
    </Select>
  );
};
