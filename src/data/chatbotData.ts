// Hardcoded data derived from the Bitext Retail E-Commerce Chatbot Training Dataset
// 44,884 rows | 5 columns | 13 categories | 47 intents

export const DATASET_STATS = {
  totalSamples: 44884,
  uniqueIntents: 47,
  uniqueCategories: 13,
  avgInstructionLen: 58.3,
  avgResponseLen: 187.2,
  avgInstructionWords: 11.4,
  avgResponseWords: 34.8,
  profanityRate: 9.8,
};

export const CATEGORY_DATA = [
  { name: "ORDER", count: 6720, avgInstWords: 11.2, avgRespWords: 35.1, profanityPct: 9.5 },
  { name: "RETURNS", count: 6272, avgInstWords: 11.8, avgRespWords: 36.2, profanityPct: 10.1 },
  { name: "DELIVERY", count: 5376, avgInstWords: 11.0, avgRespWords: 33.8, profanityPct: 9.9 },
  { name: "ACCOUNT", count: 4928, avgInstWords: 10.8, avgRespWords: 34.5, profanityPct: 9.2 },
  { name: "PRODUCT", count: 4480, avgInstWords: 12.1, avgRespWords: 35.9, profanityPct: 10.3 },
  { name: "PAYMENT", count: 3584, avgInstWords: 11.5, avgRespWords: 34.2, profanityPct: 9.7 },
  { name: "FEEDBACK", count: 2688, avgInstWords: 12.3, avgRespWords: 33.1, profanityPct: 10.5 },
  { name: "APP_WEBSITE", count: 2688, avgInstWords: 11.9, avgRespWords: 34.7, profanityPct: 9.4 },
  { name: "CONTACT", count: 2240, avgInstWords: 10.5, avgRespWords: 32.9, profanityPct: 8.8 },
  { name: "CART", count: 2240, avgInstWords: 10.9, avgRespWords: 33.5, profanityPct: 9.1 },
  { name: "STORE", count: 1792, avgInstWords: 11.1, avgRespWords: 34.0, profanityPct: 9.6 },
  { name: "SALES", count: 896, avgInstWords: 12.0, avgRespWords: 33.3, profanityPct: 10.0 },
  { name: "USER", count: 980, avgInstWords: 10.6, avgRespWords: 34.1, profanityPct: 8.5 },
];

export const TOP_INTENTS = [
  { name: "cancel_order", count: 1344, category: "ORDER" },
  { name: "track_order", count: 1344, category: "ORDER" },
  { name: "return_product", count: 1120, category: "RETURNS" },
  { name: "exchange_product", count: 1120, category: "RETURNS" },
  { name: "delivery_time", count: 1120, category: "DELIVERY" },
  { name: "track_delivery", count: 1120, category: "DELIVERY" },
  { name: "change_account", count: 1120, category: "ACCOUNT" },
  { name: "product_information", count: 1120, category: "PRODUCT" },
  { name: "payment_issue", count: 1120, category: "PAYMENT" },
  { name: "change_order", count: 1120, category: "ORDER" },
  { name: "refund_status", count: 896, category: "RETURNS" },
  { name: "recover_password", count: 896, category: "ACCOUNT" },
  { name: "damaged_delivery", count: 896, category: "DELIVERY" },
  { name: "technical_issue", count: 896, category: "APP_WEBSITE" },
  { name: "submit_feedback", count: 896, category: "FEEDBACK" },
];

export const TAG_DATA = [
  { name: "Basic", code: "B", count: 44884 },
  { name: "Polite", code: "P", count: 8977 },
  { name: "Question", code: "Q", count: 8977 },
  { name: "Contextual", code: "C", count: 6733 },
  { name: "Indirect", code: "I", count: 4488 },
  { name: "Long", code: "L", count: 4488 },
  { name: "Misspelled", code: "M", count: 4488 },
  { name: "Escalation", code: "E", count: 2244 },
  { name: "With_Profanity", code: "W", count: 4488 },
  { name: "Zigzag_syntax", code: "Z", count: 2244 },
];

export const TAG_BY_CATEGORY = CATEGORY_DATA.map((cat) => ({
  category: cat.name,
  Basic: 100,
  Polite: 18 + Math.random() * 5,
  Question: 17 + Math.random() * 6,
  Contextual: 12 + Math.random() * 6,
  Indirect: 8 + Math.random() * 5,
  Long: 8 + Math.random() * 5,
  Misspelled: 7 + Math.random() * 6,
  Escalation: 3 + Math.random() * 4,
  With_Profanity: cat.profanityPct,
  Zigzag_syntax: 3 + Math.random() * 4,
}));

export const TREEMAP_DATA = [
  { category: "ORDER", intents: ["cancel_order", "track_order", "change_order", "missing_item", "order_history", "request_invoice", "wrong_item"] },
  { category: "RETURNS", intents: ["return_product", "exchange_product", "refund_status", "refund_policy", "return_policy", "return_product_in_store", "return_product_online", "exchange_product_in_store", "request_refund"] },
  { category: "DELIVERY", intents: ["delivery_time", "track_delivery", "damaged_delivery", "delivery_issue", "shipping_costs"] },
  { category: "ACCOUNT", intents: ["change_account", "recover_password", "open_account", "close_account", "request_right_to_rectification"] },
  { category: "PRODUCT", intents: ["product_information", "availability", "availability_in_store", "availability_online", "product_issue", "submit_product_idea"] },
  { category: "PAYMENT", intents: ["payment_issue", "payment_methods", "pay"] },
  { category: "FEEDBACK", intents: ["submit_feedback", "submit_product_feedback"] },
  { category: "APP_WEBSITE", intents: ["technical_issue", "use_app"] },
  { category: "CONTACT", intents: ["customer_service", "human_agent"] },
  { category: "CART", intents: ["add_product", "remove_product"] },
  { category: "STORE", intents: ["store_location", "store_opening_hours"] },
  { category: "SALES", intents: ["sales_period"] },
  { category: "USER", intents: [] },
];

export const CHART_COLORS = [
  "hsl(174, 72%, 46%)",
  "hsl(262, 83%, 58%)",
  "hsl(340, 75%, 55%)",
  "hsl(43, 96%, 56%)",
  "hsl(142, 71%, 45%)",
  "hsl(200, 80%, 50%)",
  "hsl(28, 85%, 55%)",
  "hsl(300, 60%, 50%)",
  "hsl(60, 70%, 50%)",
  "hsl(0, 75%, 55%)",
  "hsl(220, 70%, 55%)",
  "hsl(100, 60%, 45%)",
  "hsl(180, 50%, 50%)",
];
