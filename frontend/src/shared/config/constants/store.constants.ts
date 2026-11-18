export const NAV_TEXT = {
  shop: "Shop",
  orders: "Orders",
  account: "Account",
  signIn: "Sign in",
  cart: "Cart",
  mainNav: "Main",
  footer: "A portfolio storefront. No real orders are shipped and no payment is taken.",
} as const;

export const SHOP_TEXT = {
  eyebrow: "The collection",
  title: "Fewer things, chosen well.",
  lead: "Considered electronics for the desk, the home and the road.",
  searchLabel: "Search products",
  searchPlaceholder: "Search the collection",
  categoryLabel: "Category",
  sortLabel: "Sort by",
  allCategories: "All",
  count: (n: number) => `${n} ${n === 1 ? "piece" : "pieces"}`,
  emptyTitle: "Nothing matches that search.",
  emptyBody: "Try a different word, or browse every category.",
  clear: "Clear filters",
  loadFailed: "The collection could not be loaded.",
  retry: "Try again",
  sort: { featured: "Featured", priceLow: "Price, low to high", priceHigh: "Price, high to low" },
} as const;

export const PRODUCT_TEXT = {
  back: "Shop",
  addToCart: "Add to cart",
  added: (name: string) => `${name} added to your cart.`,
  quantity: "Quantity",
  soldOut: "Sold out",
  lowStock: (n: number) => `Only ${n} left`,
  inStock: "In stock",
  notFound: "This product is no longer available.",
  reviews: "Reviews",
  noReviews: "No reviews yet. Owners can leave one from their order page.",
  verifiedBuyer: "Verified buyer",
  rating: (value: string) => `Rated ${value} out of 5`,
  reviewCount: (n: number) => `${n} ${n === 1 ? "review" : "reviews"}`,
  increase: "Increase quantity",
  decrease: "Decrease quantity",
} as const;

export const CART_TEXT = {
  title: "Your cart",
  emptyTitle: "Your cart is empty.",
  emptyBody: "Everything you add will wait for you here.",
  browse: "Browse the collection",
  remove: (name: string) => `Remove ${name}`,
  subtotal: "Subtotal",
  shipping: "Shipping",
  shippingValue: "Complimentary",
  total: "Total",
  checkout: "Continue to checkout",
  unavailable: "No longer available",
  stockLimit: (n: number) => `Only ${n} available`,
} as const;

export const CHECKOUT_TEXT = {
  title: "Checkout",
  account: "Ordering as",
  paymentTitle: "Payment",
  paymentNote: "Payment is a placeholder in this demo. You will not be charged.",
  summary: "Order summary",
  place: "Place order",
  placed: "Your order has been placed.",
  failed: "Your order could not be placed. Please try again.",
} as const;

export const AUTH_TEXT = {
  signInTitle: "Welcome back",
  signUpTitle: "Create your account",
  name: "Full name",
  email: "Email",
  username: "Username",
  password: "Password",
  passwordHelp: "At least 10 characters.",
  usernameTooShort: "Use at least 4 characters.",
  passwordTooShort: "Use at least 10 characters.",
  signIn: "Sign in",
  signUp: "Create account",
  noAccount: "New here?",
  haveAccount: "Already have an account?",
  created: "Your account is ready.",
  signedOut: "You have been signed out.",
  expired: "Your session has ended. Please sign in again.",
  signInFailed: "That username or password is not right.",
  tooMany: "Too many attempts. Please wait a moment.",
  signUpFailed: "Your account could not be created. That email or username may be taken.",
} as const;

export const ORDER_TEXT = {
  title: "Orders",
  emptyTitle: "No orders yet.",
  emptyBody: "When you place an order it will appear here.",
  number: (id: number) => `Order ${id}`,
  items: (n: number) => `${n} ${n === 1 ? "item" : "items"}`,
  placedOn: (date: string) => `Placed ${date}`,
  view: "View order",
  notFound: "We could not find this order.",
  each: (price: string) => `${price} each`,
  qty: (n: number) => `Qty ${n}`,
  total: "Total",
  writeReview: "Write a review",
  reviewed: "Reviewed",
  loadFailed: "Your orders could not be loaded.",
  removedProduct: (id: number) => `Product ${id}`,
} as const;

export const REVIEW_TEXT = {
  title: (name: string) => `Review ${name}`,
  rating: "Your rating",
  star: (n: number) => `${n} out of 5`,
  body: "Your review",
  placeholder: "What should the next owner know?",
  submit: "Publish review",
  cancel: "Cancel",
  saved: "Thank you. Your review is live.",
  failed: "Your review could not be published.",
} as const;

export const ACCOUNT_TEXT = {
  title: "Account",
  name: "Name",
  email: "Email",
  username: "Username",
  orders: "View your orders",
  signOut: "Sign out",
  loadFailed: "Your account could not be loaded.",
} as const;

export const NOT_FOUND_TEXT = {
  title: "This page does not exist.",
  back: "Return to the shop",
} as const;

export const CATEGORY_TEXT = {
  audio: "Audio",
  computing: "Computing",
  mobile: "Mobile",
  wearables: "Wearables",
  photography: "Photography",
  accessories: "Accessories",
} as const;

export const BREADCRUMB_TEXT = {
  navLabel: "Breadcrumb",
  showMore: (count: number) => `Show ${count} more`,
} as const;
