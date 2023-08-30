import { currentUser as queryCurrentUser } from '@/services/ant-design-pro/api';
import {
  CreditCardOutlined,
  CrownOutlined,
  DashboardOutlined,
  DollarOutlined,
  MoneyCollectOutlined,
  PictureOutlined,
  TableOutlined,
  TeamOutlined,
  UserOutlined,
  VerticalAlignMiddleOutlined,
  VerticalAlignTopOutlined,
} from '@ant-design/icons';
import type { Settings as LayoutSettings, MenuDataItem } from '@ant-design/pro-components';
import type { RunTimeLayoutConfig } from '@umijs/max';
import { Link, history } from '@umijs/max';
import { notification } from 'antd/lib';
import React, { useEffect } from 'react';
import { RequestConfig, useModel } from 'umi';
import { ResponseError } from 'umi-request';
import defaultSettings from '../config/defaultSettings';
const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/login';

const menuIcons = {
  dashboard: <DashboardOutlined />,
  table: <TableOutlined />,
  user: <UserOutlined />,
  VerticalAlignMiddleOutlined: <VerticalAlignMiddleOutlined />,
  VerticalAlignTopOutlined: <VerticalAlignTopOutlined />,
  MoneyCollectOutlined: <MoneyCollectOutlined />,
  DollarOutlined: <DollarOutlined />,
  CrownOutlined: <CrownOutlined />,
  CreditCardOutlined: <CreditCardOutlined />,
  TeamOutlined: <TeamOutlined />,
  PictureOutlined: <PictureOutlined />,
};

export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  loading?: boolean;
  menuData?: MenuDataItem[];
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
  fetchRuntimeConfig: () => Promise<void>;
}> {
  const fetchUserInfo = async () => {
    try {
      const msg = await queryCurrentUser({
        skipErrorHandler: true,
      });
      return msg.data;
    } catch (error) {
      history.push(loginPath);
    }
    return undefined;
  };

  const fetchRuntimeConfig = async () => {
    return fetch(`/env.json`, {
      method: 'GET',
    })
      .then((res) => {
        if (res.ok) {
          return res.json().catch((r) => null);
        } else {
          return null;
        }
      })
      .then((env) => {
        let e = null;

        if (env) {
          e = env;
        } else {
          e = {
            ADMIN_API_URL: ADMIN_API_URL,
          };
        }
        window['env'] = e;
        return e;
      });
  };

  const menuData = [
    {
      path: '/category',
      name: 'Category',
      icon: 'smile',
    },
    {
      path: '/story',
      name: 'Story',
      icon: 'smile',
    },
  ];

  await fetchRuntimeConfig();
  // 如果不是登录页面，执行
  const { location } = history;

  // if (location.pathname !== loginPath) {
  //   // const currentUser = await fetchUserInfo();
  //   return {
  //     // fetchUserInfo,
  //     // currentUser,
  //     menuData,
  //     settings: defaultSettings as Partial<LayoutSettings>,
  //   };
  // }
  return {
    fetchUserInfo,
    menuData,
    settings: defaultSettings as Partial<LayoutSettings>,
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout = ({
  initialState,
}: {
  initialState: any;
  children: any;
}): RunTimeLayoutConfig => {
  notification.config({
    getContainer: () => document.getElementById('notification')!,
  });

  return {
    key: initialState?.menuData?.length,
    menuDataRender: (m) => {
      if (initialState?.menuData) {
        const md = initialState.menuData.map((d) => ({
          ...d,
          icon: menuIcons[d.icon as string],
        }));
        return md;
      }
      return [];
    },
    siderWidth: 200,
    disableContentMargin: false,
    onPageChange: () => {
      const currentUser = initialState?.currentUser;
      const { location } = history;
      // 如果没有登录，重定向到 login
      // if (!currentUser?.userid && location.pathname !== loginPath) {
      history.push(location.pathname);
      // }
    },
    logo: null,
    menuHeaderRender: () => {
      const { setInitialState, initialState } = useModel('@@initialState');
      const refreshData = async () => {
        if (initialState?.currentUser) {
          const currentUser = initialState.currentUser;

          setInitialState({
            ...(initialState as any),
          });
        }
      };
      useEffect(() => {
        const i = setInterval(refreshData, 1000 * 60 * 10);
        refreshData();
        return () => clearInterval(i);
      }, []);

      return <></>;
    },
    postMenuData: (menus) => {
      menus?.map((menu) => {});
      return menus;
    },
    menuItemRender: (menuItemProps, defaultDom) => {
      if (menuItemProps.isUrl || menuItemProps.children) {
        return defaultDom;
      }

      if (menuItemProps.path) {
        return <Link to={menuItemProps.path}>{defaultDom}</Link>;
      }

      return defaultDom;
    },
    navTheme: 'light',
    ...initialState?.settings,
  };
};

const ERROR_MESSAGES = {};

const errorHandler = async (error: ResponseError) => {
  const { response, data } = error;
  console.log('data: ', data);

  if (response && response.status) {
    const { status } = response;
    const key = `open-${Date.now()}`;

    if (status === 400) {
      const body = await response.json();
      notification.error({
        key,
        message:
          body.code === 'VALIDATION_ERROR'
            ? `Validatioon Error`
            : body.code || `Unexpected Error Occurred`,
        description: body.message || 'Please try again later.',
      });
    } else if (status === 422 || status === 406) {
      const body = await response.json();
      notification.error({
        key,
        message: `Input Validation Failed`,
        description: body.message,
      });
    } else if (status === 500) {
      if (data.name) {
        let message = ERROR_MESSAGES[data.name] ? ERROR_MESSAGES[data.name][data.code] : undefined;
        notification.error({
          key,
          message: message?.title ?? data.message,
          description: message?.description ?? '',
        });
      } else {
        notification.error({
          key,
          message: `Unexpected Error Occurred`,
          description: 'Please try again later.',
        });
      }
    }
  }

  if (!response) {
    notification.error({
      description: 'Unable to connect to admin server',
      message: 'Network Error',
    });
  }
  throw error;
};

export const request: RequestConfig = {
  errorHandler,
  responseInterceptors: [
    (response, options) => {
      if (response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = `/`;
      }
      return response;
    },
  ],
  requestInterceptors: [
    (url, options) => {
      let headers = {};
      const token = localStorage.getItem('token');

      if (token) {
        headers = {
          ...headers,
          Authorization: `Bearer ${token}`,
        };
      }

      return {
        url: `${window.env.ADMIN_API_URL}${url}`,
        options: {
          ...options,
          headers,
        },
      };
    },
  ],
};
