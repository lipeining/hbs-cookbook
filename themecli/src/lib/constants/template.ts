const HOME = 'templates/index.html'; // 首页
const ABOUT = 'templates/about.html'; // 关于
const ABOUT_POLICY = 'templates/about_policy.html'; // 退换货政策
const ABOUT_TERMS = 'templates/about_terms.html'; // 条款与细则
const CONTACT_US = 'templates/contact_us.html'; // 联系我们
const PRIVACY_POLICY = 'templates/privacy_policy.html'; // 隐私政策
const SHIPPING_POLICY = 'templates/shipping_policy.html'; // 运输政策
const PAYMENT_METHOD = 'templates/payment_method.html'; // 付款方法
const FAQ = 'templates/faq.html'; // FAQ
const PRODUCTS_SEARCH = 'templates/products/search.html'; // 商品搜索
const CUSTOM = 'templates/custom.html'; // 自定义页面
const ONESHOP = 'templates/oneshop.html'; // 一页商店
const PAGE = 'templates/page.html'; // 自定义页面
const PRODUCT = 'templates/products/detail.html'; // 商品详情
const ACTIVITY = 'templates/activity.html'; // 活动详情
const COLLECTION = 'templates/collection.html'; // 商品分类集、商品分类详情
const COLLECTIONS_ALL = 'templates/collections_all.html'; // 全部商品分类页面
const PROOFING = 'templates/proofing.html'; // 打烊
const NOT_FOUND = 'templates/404.html'; // 404
const TRADE_CHECKOUT = 'templates/trade/checkout.html'; // 结算页
const USER = 'templates/user/index.html'; // 会员页
const CART = 'templates/cart.html'; // 购物车
const TRADE_ERROR = 'templates/trade/error.html'; // 再支付页
const TRADE_REPAY = 'templates/trade/repay.html'; // 再支付页
const TRADE_PROCESSING = 'templates/trade/processing.html'; // 处理页
const TRADE_ORDERS = 'templates/trade/orders.html'; // order 页
const TRADE_THANK_YOU = 'templates/trade/thankyou.html'; // 状态页
const TRADE_EXPRESS_CALLBACK = 'templates/trade/express_callback.html'; // 状态页
const PASSWORD = 'templates/password.html'; // 密码页
const BLOGDETAIL = 'templates/blogs/detail.html'; //BLOG详情页
const BlOGLIST = 'templates/blogs/list.html'; //BLOG列表页
const POLICY = 'templates/policy.html'; // 政策页

export const alias = {
  Home: 'Home',
  About: 'About',
  AboutPolicy: 'AboutPolicy',
  AboutTerms: 'AboutTerms',
  ContactUs: 'ContactUs',
  PrivacyPolicy: 'PrivacyPolicy',
  ShippingPolicy: 'ShippingPolicy',
  PaymentMethod: 'PaymentMethod',
  Faq: 'Faq',
  ProductsSearch: 'ProductsSearch',
  Custom: 'Custom',
  OneShop: 'OneShop',
  Page: 'Page',
  ProductsDetail: 'ProductsDetail',
  PreviewProductsDetail: 'PreviewProductsDetail',
  Activity: 'Activity',
  Products: 'Products',
  BlogsDetail: 'BlogsDetail',
  BlogsList: 'BlogsList',
  AllCollections: 'AllCollections',
  Proofing: 'Proofing',
  NotFound: '404',
  Checkout: 'Checkout',
  Center: 'Center',
  OrderList: 'OrderList',
  OrderDetail: 'OrderDetail',
  OrderComment: 'OrderComment',
  ReOrderList: 'ReOrderList',
  ReOrderDetail: 'ReOrderDetail',
  ReOrderConfirm: 'ReOrderConfirm',
  SignIn: 'SignIn',
  SignOut: 'SignOut',
  SignUp: 'SignUp',
  Bind: 'Bind',
  Cart: 'Cart',
  CheckoutError: 'CheckoutError',
  RePay: 'RePay',
  Processing: 'Processing',
  Orders: 'Orders',
  Thankyou: 'Thankyou',
  ExpressCallback: 'ExpressCallback',
  Password: 'Password',
  Policy: 'Policy',
};

export const extraInfo = {
  // 首页
  [HOME]: {
    alias: alias.Home,
    exact: true,
  },
  [ABOUT]: {
    // 关于
    alias: alias.About,
    exact: true,
  },
  [ABOUT_POLICY]: {
    // 退换货政策
    alias: alias.AboutPolicy,
    exact: true,
  },
  [ABOUT_TERMS]: {
    // 条款与细则
    alias: alias.AboutTerms,
    exact: true,
  },
  [CONTACT_US]: {
    // 联系我们
    alias: alias.ContactUs,
    exact: true,
  },
  [PRIVACY_POLICY]: {
    // 隐私政策
    alias: alias.PrivacyPolicy,
    exact: true,
  },
  [SHIPPING_POLICY]: {
    // 运输政策
    alias: alias.ShippingPolicy,
    exact: true,
  },
  [PAYMENT_METHOD]: {
    // 付款方法
    alias: alias.PaymentMethod,
    exact: true,
  },
  [FAQ]: {
    // FAQ
    alias: alias.Faq,
    exact: true,
  },
  [PRODUCTS_SEARCH]: {
    // 商品搜索
    alias: alias.ProductsSearch,
    exact: true,
  },
  [CUSTOM]: {
    // 自定义页面
    alias: alias.Custom,
    exact: true,
  },
  [ONESHOP]: {
    // 一页商店
    alias: alias.OneShop,
    exact: true,
  },
  [PAGE]: {
    // 新自定义页面
    alias: alias.Page,
    exact: true,
  },
  [PRODUCT]: {
    // 商品详情
    children: {
      '/products/:id': {
        alias: alias.ProductsDetail,
        exact: true,
      },
      '/preview/products/:id': {
        alias: alias.PreviewProductsDetail,
        exact: true,
      },
    },
  },
  [ACTIVITY]: {
    // 活动详情
    alias: alias.Activity,
    exact: true,
  },
  [COLLECTION]: {
    // 商品分类集、商品分类详情
    alias: alias.Products,
    exact: true,
  },
  [BLOGDETAIL]: {
    //博客详情页面
    alias: alias.BlogsDetail,
    exact: true,
  },
  [BlOGLIST]: {
    //博客列表页面
    alias: alias.BlogsList,
    exact: true,
  },
  [COLLECTIONS_ALL]: {
    // 全部商品分类页面
    alias: alias.AllCollections,
    exact: true,
  },
  [PROOFING]: {
    // 打烊
    alias: alias.Proofing,
    exact: true,
  },
  [NOT_FOUND]: {
    // 404
    alias: alias.NotFound,
    exact: true,
  },
  [TRADE_CHECKOUT]: {
    // 结算页
    alias: alias.Checkout,
    exact: true,
  },
  [USER]: {
    // 会员页
    children: {
      '/center': {
        alias: alias.Center,
      },
      '/message': {},
      '/orders': {
        alias: alias.OrderList,
        exact: true,
      },
      '/orders/:id': {
        alias: alias.OrderDetail,
        exact: true,
      },
      '/orders/:id/comment': {
        alias: alias.OrderComment,
      },
      '/refunds': {
        alias: alias.ReOrderList,
        exact: true,
      },
      '/refunds/:id': {
        alias: alias.ReOrderDetail,
        exact: true,
      },
      '/refunds/:id/confirm': {
        alias: alias.ReOrderConfirm,
      },
      '/signIn': {
        alias: alias.SignIn,
      },
      '/signOut': {
        alias: alias.SignOut,
      },
      '/signUp': {
        alias: alias.SignUp,
      },
      '/passwordNew': {},
      '/passwordReset': {},
      '/bind': {
        alias: alias.Bind,
      },
      '/address/new': {
        exact: true,
      },
      '/address/:addressSeq/edit': {},
      '/point/list': {},
    },
  },
  [CART]: {
    alias: alias.Cart,
    exact: true,
  },
  [TRADE_ERROR]: {
    alias: alias.CheckoutError,
    exact: true,
  },
  [TRADE_REPAY]: {
    alias: alias.RePay,
    exact: true,
  },
  [TRADE_PROCESSING]: {
    alias: alias.Processing,
    exact: true,
  },
  [TRADE_ORDERS]: {
    alias: alias.Orders,
    exact: true,
  },
  [TRADE_THANK_YOU]: {
    alias: alias.Thankyou,
    exact: true,
  },
  [TRADE_EXPRESS_CALLBACK]: {
    alias: alias.ExpressCallback,
    exact: true,
  },
  [PASSWORD]: {
    alias: alias.Password,
    exact: true,
  },
  [POLICY]: {
    alias: alias.Policy,
    exact: true,
  },
};

export default {
  HOME,
  ABOUT,
  ABOUT_POLICY,
  ABOUT_TERMS,
  CONTACT_US,
  PRIVACY_POLICY,
  SHIPPING_POLICY,
  PAYMENT_METHOD,
  FAQ,
  PRODUCTS_SEARCH,
  CUSTOM,
  ONESHOP,
  PAGE,
  PRODUCT,
  ACTIVITY,
  COLLECTION,
  COLLECTIONS_ALL,
  PROOFING,
  NOT_FOUND,
  TRADE_CHECKOUT,
  USER,
  CART,
  TRADE_ERROR,
  TRADE_REPAY,
  TRADE_PROCESSING,
  TRADE_ORDERS,
  TRADE_THANK_YOU,
  TRADE_EXPRESS_CALLBACK,
  PASSWORD,
  BLOGDETAIL,
  BlOGLIST,
  POLICY,
};
