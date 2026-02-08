
/**
 * CARVO SHOPIFY ENGINE 2026 - STABLE VERSION
 * -------------------------
 * Optimized for Storefront API access with robust error handling.
 */

// שימוש בסאב-דומיין ייעודי (shop.carvo.co.il) במקום ה-myshopify הישן.
// מומלץ לוודא שהדומיין מוגדר כ-Primary בשופיפי תחת Settings > Domains.
const SHOPIFY_STORE_DOMAIN = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN || 'shop.carvo.co.il';
const STOREFRONT_ACCESS_TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN || '2db8822e9e37450609fba3b4ccd73a74';
const API_VERSION = '2024-10';
const CHECKOUT_DOMAIN = 'shop.carvo.co.il';

export async function shopifyFetch({ query, variables = {} }: { query: string, variables?: any }) {
  if (!SHOPIFY_STORE_DOMAIN || !STOREFRONT_ACCESS_TOKEN) {
    console.error('[Shopify] Configuration Error: Missing domain or token.');
    return { error: 'CONFIG_MISSING' };
  }

  try {
    const url = `https://${SHOPIFY_STORE_DOMAIN}/api/${API_VERSION}/graphql.json`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': STOREFRONT_ACCESS_TOKEN,
      },
      body: JSON.stringify({
        query,
        variables: variables || {}
      }),
      // הוספת הגדרות אלו עוזרת במניעת חלק משגיאות ה-Network בדפדפנים מסוימים
      credentials: 'omit',
      cache: 'no-store'
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`[Shopify] HTTP Error ${response.status}:`, errorBody);
      return { error: `HTTP_${response.status}`, details: errorBody };
    }

    const json = await response.json();

    if (json.errors) {
      console.error('[Shopify] GraphQL Errors:', json.errors);
      return { error: 'GRAPHQL_ERROR', details: json.errors };
    }

    return { data: json.data };
  } catch (error) {
    // שגיאה זו בדרך כלל מעידה על בעיית רשת, DNS או חסימת CORS מצד השרת
    console.error('[Shopify] Connection Failed:', error);
    return {
      error: 'NETWORK_ERROR',
      details: error instanceof Error ? error.message : String(error)
    };
  }
}

export const GET_COLLECTIONS_QUERY = `
  query getCollections($first: Int!) {
    collections(first: $first) {
      edges {
        node {
          id
          title
          handle
        }
      }
    }
  }
`;

export const GET_COLLECTION_PRODUCTS_QUERY = `
  query getCollectionProducts($handle: String!, $first: Int!) {
    collection(handle: $handle) {
      title
      products(first: $first) {
        edges {
          node {
            id
            title
            handle
            description
            availableForSale
            priceRange {
              minVariantPrice {
                amount
              }
            }
            images(first: 10) {
              edges {
                node {
                  url
                }
              }
            }
            variants(first: 1) {
              edges {
                node {
                  id
                }
              }
            }
          }
        }
      }
    }
  }
`;

export function getCheckoutUrl(variantId: string) {
  const cleanId = variantId.split('/').pop();
  return `https://${CHECKOUT_DOMAIN}/cart/${cleanId}:1`;
}
