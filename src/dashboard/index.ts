// @ts-nocheck
import db, { models } from "../../models";
import markApproved from "./customActions/bulkMarkApprove";
import BulkPay from "./customActions/bulkPay";
import users from "./customResources/users";
const initDashboard = async (app: any) => {
  const { default: AdminJS, ComponentLoader } = await import("adminjs");
  const bundle = await import("@adminjs/bundler");
  const { default: AdminJSExpress } = await import("@adminjs/express");
  const { default: AdminJSSequelize } = await import("@adminjs/sequelize");
  //init component loader
  const componentLoader = new ComponentLoader();

  // const DEFAULT_ADMIN = {
  //   email: process.env.admin_email,
  //   password: process.env.admin_password,
  // };
  // const authenticate = async (email: string, password: string) => {
  //   if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
  //     return Promise.resolve(DEFAULT_ADMIN);
  //   }
  //   return null;
  // };

  AdminJS.registerAdapter(AdminJSSequelize);

  // const components = {
  //   Dashboard: componentLoader.add("Dashboard", "./components/Dashboard"),
  // };

  const Bundle = bundle.bundle as any;
  // await Bundle({
  //   destinationDir: "../../.adminjs/",
  //   customComponentsInitializationFilePath: "./components",
  // });
  const Components = {
    couponBtn: componentLoader.add("couponBtn", "./components/couponCode.jsx"),
    approveModal: componentLoader.add(
      "approveModal",
      "./components/BulkApproveModal.jsx"
    ),
    bulkPay: componentLoader.add("bulkPay", "./components/BulkPay.jsx"),
  };

  const admin = new AdminJS({
    rootPath: "/admin",
    resources: [
      users,
      models.packages,
      {
        resource: models.coupons,
        options: {
          properties: {
            code: {
              isVisible: { list: true, show: true, edit: false },
              components: { show: Components.couponBtn },
            },
            isRedeemed: {
              isVisible: { list: true, show: true, edit: false },
            },
            updatedAt: { isVisible: false },
          },
          actions: {
            show: {
              // isVisible: false,
            },
          },
        },
      },
      models.userPackages,
      models.transactions,
      {
        resource: models.withdrawalRequests,
        options: {
          actions: {
            bulkApprove: {
              ...markApproved,
              component: Components.approveModal,
            },
            bulkPay: {
              ...BulkPay,
              component: Components.bulkPay,
            },
          },
        },
      },
      models.vendors,
    ],
    componentLoader,
    locale: {
      translations: {
        en: {
          components: {
            Login: {
              welcomeHeader: "Welcome",
              welcomeMessage: "Proceed with your email and Password",
            },
          },
        },
      },
    } as any,
    branding: {
      companyName: "Investments",

      //   logo:
      //     process.env.app_url +
      //     "/static/logo.770e4c4ac171fb416d3346755d8cd086.svg",
      theme: {
        colors: {
          primary100: "orange",
        },
      },
    },

    // dashboard: {
    //   handler: async () => {},
    //   component: components.Dashboard,
    //   componentLoader,
    // },
    // componentLoader,
  });
  //   const store = new MySQLStore({
  //     host: process.env.db_host,
  //     password: process.env.db_password,
  //     database: process.env.database ?? process.env.db_name,
  //     user: process.env.db_username,
  //     port: process.env.db_port,
  //   });
  const adminRouter = AdminJSExpress.buildRouter(
    admin
    // {
    //   authenticate,
    //   cookieName: "nftytribeAdmin",
    //   cookiePassword: process.env.admin_cookie_password,
    // },
    // null,
    // {
    //   saveUninitialized: true,
    //   resave: true,
    //   store,
    // }
  );

  app.use(admin.options.rootPath, adminRouter);
};

export default initDashboard;
