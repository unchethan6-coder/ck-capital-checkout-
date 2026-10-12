export interface DataLayerEcommerceItem {
  item_id: string;
  item_name: string;
  price: number;
  quantity: number;
  currency?: string;
}

export interface DataLayerEcommerce {
  transaction_id?: string;
  value?: number;
  currency?: string;
  items?: DataLayerEcommerceItem[];
}

export interface BeginCheckoutParams {
  planId: string;
  planName: string;
  value: number;
  currency: string;
  quantity?: number;
}

export interface PurchaseItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface PurchaseOrder {
  id: string;
  isPaid: boolean;
  value: number;
  currency: string;
  items: Array<{
    item_id: string;
    item_name: string;
    price: number;
    quantity: number;
  }>;
  email?: string;
  phone?: string;
}

export interface FbqFunction {
  (command: "init", pixelId: string, options?: Record<string, unknown>): void;
  (command: "track", event: string, params?: Record<string, unknown>, extra?: { eventID?: string }): void;
  (command: "trackCustom", event: string, params?: Record<string, unknown>, extra?: { eventID?: string }): void;
  (command: "consent", action: "grant" | "revoke"): void;
  queue?: unknown[];
  loaded?: boolean;
  version?: string;
  callMethod?: (...args: unknown[]) => void;
}

export interface TtqInstance {
  page: () => void;
  track: (
    event: string,
    params?: Record<string, unknown>,
    extra?: { event_id?: string }
  ) => void;
  identify: (params: Record<string, unknown>) => void;
  grantConsent?: () => void;
  revokeConsent?: () => void;
  load: (pixelId: string, options?: Record<string, unknown>) => void;
}

export interface TwqFunction {
  (command: "config", pixelId: string): void;
  (command: "track", event: string, params?: Record<string, unknown>): void;
  (command: "event", eventKey: string, params?: Record<string, unknown>): void;
  exe?: (...args: unknown[]) => void;
  queue?: unknown[];
  version?: string;
}

export interface RdtFunction {
  (command: "init", pixelId: string, options?: Record<string, unknown>): void;
  (command: "track", event: string, params?: Record<string, unknown>): void;
  sendEvent?: (...args: unknown[]) => void;
  callQueue?: unknown[];
}

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
    fbq?: FbqFunction;
    _fbq?: FbqFunction;
    ttq?: TtqInstance;
    TiktokAnalyticsObject?: string;
    twq?: TwqFunction;
    rdt?: RdtFunction;
  }
}
