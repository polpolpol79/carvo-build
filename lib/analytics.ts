
/**
 * CARVO Analytics Engine
 * Helps track user behavior for conversion optimization.
 */

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export const trackEvent = (eventName: string, params: Record<string, any> = {}) => {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', eventName, params);
  } else {
    console.debug(`[Analytics] Event: ${eventName}`, params);
  }
};

export const trackAddToCart = (product: { id: string, name: string, price: number }) => {
  trackEvent('add_to_cart', {
    currency: 'ILS',
    value: product.price,
    items: [
      {
        item_id: product.id,
        item_name: product.name,
        price: product.price,
        quantity: 1
      }
    ]
  });
};

export const trackProductView = (product: { id: string, name: string, price: number }) => {
  trackEvent('view_item', {
    currency: 'ILS',
    value: product.price,
    items: [
      {
        item_id: product.id,
        item_name: product.name,
        price: product.price
      }
    ]
  });
};

export const trackBeginCheckout = (items: any[], total: number) => {
  trackEvent('begin_checkout', {
    currency: 'ILS',
    value: total,
    items: items.map(i => ({
      item_id: i.productId,
      item_name: i.product.name,
      price: i.product.price,
      quantity: i.quantity
    }))
  });
};
