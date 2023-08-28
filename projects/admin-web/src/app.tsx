import { useModel } from "@@/plugin-model/useModel";
import { RequestConfig } from "@@/plugin-request/request";
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
} from "@ant-design/icons";

import {
  BasicLayoutProps,
  MenuDataItem,
  Settings as ProSettings,
} from "@ant-design/pro-layout";
import { RequestData } from "@ant-design/pro-table";
import { notification } from "antd";
import { useEffect } from "react";
import "react-image-lightbox/style.css";
import { Link, history } from "umi";
import { ResponseError } from "umi-request";
import defaultSettings from "../config/defaultSettings";
import {
  ModuleName,
  PermissionVerbAction,
  isPermitted,
} from "./components/Guard";
import { loginOut } from "./components/RightContent/AvatarDropdown";
import {
  CardApplicationItem,
  getCardApplicationList,
} from "./services/card-application";
import { CardsIssuingListItem, getIssuingList } from "./services/card-issuing";
import {
  CardPendingEmbossedListItem,
  getCardPendingEmbossedList,
} from "./services/card-pending-embossed";
import { ClientDocumentStatus } from "./services/client-documents";
import { PendingKycType } from "./services/kyc-documents";
import { useStreamEvent } from "./services/stream";
import styles from "./styles/instructions.css";

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

// const [refreshKey, setRefreshKey] = useState<Date>(new Date());

export type InitialState = {
  fetchRuntimeConfig: () => Promise<void>;
  fetchUserInfo: () => Promise<API.CurrentUser | undefined>;
  fetchCraFormInstructions: () => Promise<
    RequestData<UsersCraFormListItem> | undefined
  >;
  fetchInstructions: () => Promise<
    RequestData<PaymentInstructionsListItem> | undefined
  >;
  fetchKycDDInstructions: () => Promise<
    RequestData<PaymentKYInstructionsListItem> | undefined
  >;
  fetchAccountActivationInstructions: () => Promise<
    RequestData<UsersListItem> | undefined
  >;
  fetchBeneficiariesInstructions: () => Promise<
    RequestData<UsersBeneficiariesListItem> | undefined
  >;
  fetchSolutionApplications: () => Promise<
    RequestData<SolutionApplicationItem> | undefined
  >;
  fetchMyRoutes: () => Promise<MenuDataItem[] | undefined>;
  fetchCardApplications: () => Promise<
    RequestData<CardApplicationItem> | undefined
  >;
  fetchCardIssuings: () => Promise<
    RequestData<CardsIssuingListItem> | undefined
  >;
  fetchCardPendingEmbosses: () => Promise<
    RequestData<CardPendingEmbossedListItem> | undefined
  >;

  settings?: ProSettings;
  currentUser?: API.CurrentUser;
  craFormInstructions?: number;
  instructions?: number;
  kycDDInstructions?: number;
  accountActivationInstructions?: number;
  menuData?: MenuDataItem[];
  beneficiariesInstructions?: number;
  solutionApplications?: number;
  cardApplicationCount?: number;
  cardIssuingCount?: number;
  cardPendingEmbossedCount?: number;
};

export async function getInitialState(): Promise<InitialState> {
  const fetchRuntimeConfig = async () => {
    return fetch(`/env.json`, {
      method: "GET",
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
            ONBOARDING_FORM_URL: ONBOARDING_FORM_URL,
          };
        }
        window["env"] = e;
        return e;
      });
  };

  const fetchUserInfo = async () => {
    try {
      const currentUser = await queryCurrent();
      return currentUser;
    } catch (error) {
      history.push("/login");
    }
    return undefined;
  };

  const fetchCraFormInstructions = async () => {
    try {
      const craFormInstructions = await queryUsersCraForm({});
      return craFormInstructions;
    } catch (error) {}
    return undefined;
  };

  const fetchInstructions = async () => {
    try {
      const instructions = await queryPendingPaymentInstructions({});
      return instructions;
    } catch (error) {}
    return undefined;
  };

  const fetchKycDDInstructions = async () => {
    try {
      const kycDDInstructions = await queryPendingKYCInstructions({
        pendingType: PendingKycType.PendingKycDocument,
        status: ClientDocumentStatus.PENDING,
      });
      return kycDDInstructions;
    } catch (error) {}
    return undefined;
  };

  const fetchAccountActivationInstructions = async () => {
    try {
      const accountActivationInstructions = await queryAccountActivation({});
      return accountActivationInstructions;
    } catch (error) {}
    return undefined;
  };

  const fetchBeneficiariesInstructions = async () => {
    try {
      const beneficiariesInstructions = await queryUsersBeneficiaries({});
      return beneficiariesInstructions;
    } catch (error) {}
    return undefined;
  };

  const fetchSolutionApplications = async () => {
    try {
      const solutionApplications = await querySolutionApplications({
        current: 1,
        pageSize: 20,
        status: "PENDING_APPROVAL",
      });
      return solutionApplications;
    } catch (error) {}
    return undefined;
  };

  const fetchCardApplications = async () => {
    try {
      const cardApplications = await getCardApplicationList({
        current: 1,
        pageSize: 20,
        status: "NEW",
      });
      return cardApplications;
    } catch (error) {}
    return undefined;
  };

  const fetchCardIssuings = async () => {
    try {
      const issuingCards = await getIssuingList({ current: 1, pageSize: 20 });
      return issuingCards;
    } catch (error) {}
    return undefined;
  };

  const fetchCardPendingEmbosses = async () => {
    try {
      const pendingEmbossedCards = await getCardPendingEmbossedList({
        current: 1,
        pageSize: 50,
      });
      return pendingEmbossedCards;
    } catch (error) {}
    return undefined;
  };

  const fetchMyRoutes = async () => {
    try {
      const routes = await queryMyRoutes();
      return routes;
    } catch (error) {}
    return [];
  };

  const parseJwt = (token: string): JwtToken => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
      return {
        id: "",
        iat: 0,
        exp: 0,
      };
    }
  };

  const isJwtTokenExpired = (token: string): boolean => {
    const decodedJwt = parseJwt(token);
    return decodedJwt.exp * 1000 < Date.now();
  };

  await fetchRuntimeConfig();
  const token = localStorage.getItem("token");

  // 如果是登录页面，不执行
  if (token) {
    const interval = window.setInterval(async () => {
      if (isJwtTokenExpired(token)) {
        await loginOut();
        clearInterval(interval);
      }
    }, 1000);

    const currentUser = await fetchUserInfo();
    const menuData = await fetchMyRoutes();
    // window.setInterval(() => {setCount()},1000 * 60)

    return {
      fetchKycDDInstructions,
      fetchInstructions,
      fetchUserInfo,
      fetchCraFormInstructions,
      fetchAccountActivationInstructions,
      fetchMyRoutes,
      fetchBeneficiariesInstructions,
      fetchSolutionApplications,
      fetchCardApplications,
      fetchCardIssuings,
      fetchCardPendingEmbosses,
      settings: defaultSettings,
      currentUser,
      craFormInstructions: 0,
      instructions: 0,
      kycDDInstructions: 0,
      accountActivationInstructions: 0,
      menuData,
      beneficiariesInstructions: 0,
      solutionApplications: 0,
      cardApplicationCount: 0,
      cardIssuingCount: 0,
      cardPendingEmbossedCount: 0,
    };
  }

  return {
    fetchUserInfo,
    settings: defaultSettings,
    fetchCraFormInstructions,
    fetchAccountActivationInstructions,
    fetchKycDDInstructions,
    fetchInstructions,
    fetchBeneficiariesInstructions,
    fetchSolutionApplications,
    fetchCardApplications,
    fetchCardIssuings,
    fetchCardPendingEmbosses,
    fetchMyRoutes,
  };
}

export const layout = ({
  initialState,
}: {
  initialState: InitialState;
  children: any;
}): BasicLayoutProps => {
  notification.config({
    getContainer: () => document.getElementById("notification")!,
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
    rightContentRender: () => <RightContent />,
    siderWidth: 200,
    disableContentMargin: false,
    onPageChange: () => {
      const currentUser = initialState?.currentUser;
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!currentUser?.id && location.pathname !== "/login") {
        history.push("/login");
      }
    },
    logo: null,
    menuHeaderRender: () => {
      const { setInitialState, initialState } = useModel("@@initialState");
      const refreshData = async () => {
        if (initialState?.currentUser) {
          const currentUser = initialState.currentUser;
          const kycDDInstructions = isPermitted(
            ModuleName.KYC,
            PermissionVerbAction["VIEW:KYC"],
            initialState.currentUser.acl
          )
            ? (
                await queryPendingKYCInstructions({
                  pendingType: PendingKycType.PendingKycDocument,
                  status: ClientDocumentStatus.PENDING,
                })
              )?.total
            : undefined;
          const craFormInstructions = isPermitted(
            ModuleName.USER,
            PermissionVerbAction["VIEW:USER"],
            currentUser.acl
          )
            ? (await initialState?.fetchCraFormInstructions())?.total
            : undefined;
          const instructions = isPermitted(
            ModuleName.PENDING_PAYMENT,
            PermissionVerbAction["VIEW:PENDING_PAYMENT"],
            currentUser.acl
          )
            ? (await initialState?.fetchInstructions())?.total
            : undefined;
          const accountActivationInstructions = isPermitted(
            ModuleName.USER,
            PermissionVerbAction["ACTION:EDIT_ACCOUNT_ACTIVATION"],
            currentUser.acl
          )
            ? (await initialState?.fetchAccountActivationInstructions())?.total
            : undefined;
          const beneficiariesInstructions = isPermitted(
            ModuleName.USER,
            PermissionVerbAction["VIEW:USER"],
            currentUser.acl
          )
            ? (await initialState?.fetchBeneficiariesInstructions())?.total
            : undefined;
          const solutionApplications = isPermitted(
            ModuleName.SOLUTION,
            PermissionVerbAction["VIEW:SOLUTION_APPLICATION"],
            currentUser.acl
          )
            ? (await initialState?.fetchSolutionApplications())?.total
            : undefined;
          const cardApplicationCount = isPermitted(
            ModuleName.CMS,
            PermissionVerbAction["VIEW:CMS_CARD_APPLICATION"],
            currentUser.acl
          )
            ? (await initialState?.fetchCardApplications())?.total
            : undefined;
          const cardIssuingCount = isPermitted(
            ModuleName.CMS,
            PermissionVerbAction["VIEW:CMS_CARD_ISSUE"],
            currentUser.acl
          )
            ? (await initialState?.fetchCardIssuings())?.total
            : undefined;
          const cardPendingEmbossedCount = isPermitted(
            ModuleName.CMS,
            PermissionVerbAction["VIEW:CMS_PENDING_EMBOSSED"],
            currentUser.acl
          )
            ? (await initialState?.fetchCardPendingEmbosses())?.total
            : undefined;

          setInitialState({
            ...(initialState as any),
            craFormInstructions,
            instructions,
            kycDDInstructions,
            accountActivationInstructions,
            beneficiariesInstructions,
            solutionApplications,
            cardApplicationCount,
            cardIssuingCount,
            cardPendingEmbossedCount,
          });
        }
      };
      useEffect(() => {
        const i = setInterval(refreshData, 1000 * 60 * 10);
        refreshData();
        return () => clearInterval(i);
      }, []);

      useStreamEvent("marketdata.event.updated", (message, event) =>
        console.log(event, message)
      );

      // return (
      //   <img style={{ width: 180, height: 48 }} src={(initialState?.settings as any).logo} />
      // );
      return <></>;
    },
    postMenuData: (menus) => {
      const cardCountSum =
        (initialState?.cardApplicationCount || 0) +
        (initialState?.cardIssuingCount || 0) +
        (initialState?.cardPendingEmbossedCount || 0);
      const pendingInstructionsCountSum =
        (initialState?.craFormInstructions || 0) +
        (initialState?.instructions || 0) +
        (initialState?.kycDDInstructions || 0) +
        (initialState?.accountActivationInstructions || 0) +
        (initialState?.beneficiariesInstructions || 0);
      menus?.map((menu) => {
        if (menu.name === "Card & Credit" && cardCountSum) {
          menu.name = (
            <>
              {menu.name}
              <span className={styles.messageContainer}>{cardCountSum}</span>
            </>
          );
        } else if (
          menu.name === "Pending Instructions" &&
          pendingInstructionsCountSum
        ) {
          menu.name = (
            <>
              {menu.name}
              <span className={styles.messageContainer}>
                {pendingInstructionsCountSum}
              </span>
            </>
          );
        }
      });
      return menus;
    },
    menuItemRender: (menuItemProps, defaultDom) => {
      if (menuItemProps.isUrl || menuItemProps.children) {
        return defaultDom;
      }

      if (
        menuItemProps.path === "/pending-instructions/cra-form" &&
        initialState?.craFormInstructions != 0
      ) {
        const craFormInstructions = initialState?.craFormInstructions;
        return (
          <Link to={menuItemProps.path}>
            {defaultDom}{" "}
            <span className={styles.messageContainer}>
              {craFormInstructions}
            </span>
          </Link>
        );
      }

      if (menuItemProps.path === "/pending-instructions/payment") {
        const instructions = initialState?.instructions;
        return (
          <Link to={menuItemProps.path}>
            {defaultDom}{" "}
            <span className={styles.messageContainer}>{instructions}</span>
          </Link>
        );
      }

      if (
        menuItemProps.path === "/pending-instructions/dd-kyc" &&
        initialState?.kycDDInstructions != 0
      ) {
        const kycDDInstructions = initialState?.kycDDInstructions;
        return (
          <Link to={menuItemProps.path}>
            {defaultDom}{" "}
            <span className={styles.messageContainer}>{kycDDInstructions}</span>
          </Link>
        );
      }

      if (
        menuItemProps.path === "/pending-instructions/account-activation" &&
        initialState?.kycDDInstructions != 0
      ) {
        const accountActivationInstructions =
          initialState?.accountActivationInstructions;
        return (
          <Link to={menuItemProps.path}>
            {defaultDom}{" "}
            <span className={styles.messageContainer}>
              {accountActivationInstructions}
            </span>
          </Link>
        );
      }

      if (
        menuItemProps.path === "/pending-instructions/beneficiaries" &&
        initialState?.beneficiariesInstructions != 0
      ) {
        const beneficiariesInstructions =
          initialState?.beneficiariesInstructions;
        return (
          <Link to={menuItemProps.path}>
            {defaultDom}{" "}
            <span className={styles.messageContainer}>
              {beneficiariesInstructions}
            </span>
          </Link>
        );
      }

      if (
        menuItemProps.path === "/solution-application" &&
        initialState?.solutionApplications != 0
      ) {
        const solutionApplications = initialState?.solutionApplications;
        return (
          <Link to={menuItemProps.path}>
            {defaultDom}{" "}
            <span className={styles.messageContainer}>
              {solutionApplications}
            </span>
          </Link>
        );
      }

      if (
        menuItemProps.path === "/cms/card-application" &&
        initialState?.cardApplicationCount != 0
      ) {
        const cardApplicationCount = initialState?.cardApplicationCount;
        return (
          <Link to={menuItemProps.path}>
            {defaultDom}{" "}
            <span className={styles.messageContainer}>
              {cardApplicationCount}
            </span>
          </Link>
        );
      }

      if (
        menuItemProps.path === "/cms/card-issuing" &&
        initialState?.cardIssuingCount != 0
      ) {
        const cardIssuingCount = initialState?.cardIssuingCount;
        return (
          <Link to={menuItemProps.path}>
            {defaultDom}{" "}
            <span className={styles.messageContainer}>{cardIssuingCount}</span>
          </Link>
        );
      }

      if (
        menuItemProps.path === "/cms/card-pending-embossed" &&
        initialState?.cardPendingEmbossedCount != 0
      ) {
        const cardPendingEmbossedCount = initialState?.cardPendingEmbossedCount;
        return (
          <Link to={menuItemProps.path}>
            {defaultDom}{" "}
            <span className={styles.messageContainer}>
              {cardPendingEmbossedCount}
            </span>
          </Link>
        );
      }

      if (menuItemProps.path) {
        return <Link to={menuItemProps.path}>{defaultDom}</Link>;
      }
      return defaultDom;
    },
    navTheme: "realDark",
    ...initialState?.settings,
  };
};

const ERROR_MESSAGES = {
  INVOICE: {
    INVALID_USER: { title: "User is invalid", description: "" },
    INVALID_INVOICE: { title: "Invoice is invalid", description: "" },
    INVALID_PDF_GENERATION: { title: "Pdf not found", description: "" },
    FAILED_PDF_GENERATION: {
      title: "Failed to generate client document",
      description: "",
    },
    INVALID_WALLET: { title: "Wallet is invalid", description: "" },
  },
};

/**
 * 异常处理程序
 */
const errorHandler = async (error: ResponseError) => {
  const { response, data } = error;
  console.log("data: ", data);
  if (response && response.status) {
    const { status } = response;
    const key = `open-${Date.now()}`;

    if (history.location.pathname === "/account/settings") {
      notification.error({
        key,
        message: "Update failed",
        description: data.message,
      });
    } else if (status === 400) {
      const body = await response.json();
      notification.error({
        key,
        message:
          body.code === "VALIDATION_ERROR"
            ? `Validatioon Error`
            : body.code || `Unexpected Error Occurred`,
        description: body.message || "Please try again later.",
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
        let message = ERROR_MESSAGES[data.name]
          ? ERROR_MESSAGES[data.name][data.code]
          : undefined;
        notification.error({
          key,
          message: message?.title ?? data.message,
          description: message?.description ?? "",
        });
      } else if (
        data.message === "Insufficient balance to execute transaction"
      ) {
        notification.error({
          key,
          message: "Insufficient Balance",
          description: "Insufficient balance to execute transaction",
        });
      } else {
        notification.error({
          key,
          message: `Unexpected Error Occurred`,
          description: "Please try again later.",
        });
      }
    } else if (data.message === "INVALID_MFA_OTP_TOKEN") {
      notification.error({
        key,
        message: `Input Validation Failed`,
        description: "INVALID_MFA_OTP_TOKEN",
      });
    }
  }

  if (!response) {
    notification.error({
      description: "Unable to connect to admin server",
      message: "Network Error",
    });
  }
  throw error;
};

export const request: RequestConfig = {
  errorHandler,
  responseInterceptors: [
    (response, options) => {
      if (response.status === 401) {
        localStorage.removeItem("token");
        window.location.href = `/`;
      }
      return response;
    },
  ],
  requestInterceptors: [
    (url, options) => {
      let headers = {};
      const token = localStorage.getItem("token");

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
