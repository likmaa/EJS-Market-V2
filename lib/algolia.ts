import algoliasearch, { SearchClient, SearchIndex } from 'algoliasearch';
import { env } from './env';

// Nom d'index par défaut pour les produits
export const ALGOLIA_PRODUCTS_INDEX = 'products';

type AlgoliaClients = {
  client: SearchClient | null;
  productsIndex: SearchIndex | null;
};

let cached: AlgoliaClients | null = null;

export function getAlgoliaClients(): AlgoliaClients {
  if (cached) return cached;

  const appId = env.NEXT_PUBLIC_ALGOLIA_APP_ID;
  const adminKey = env.ALGOLIA_ADMIN_API_KEY;

  if (!appId || !adminKey) {
    if (env.NODE_ENV !== 'production') {
      console.warn(
        '[Algolia] Variables NEXT_PUBLIC_ALGOLIA_APP_ID ou ALGOLIA_ADMIN_API_KEY manquantes. Algolia est désactivé.'
      );
    }

    cached = {
      client: null,
      productsIndex: null,
    };

    return cached;
  }

  const client = algoliasearch(appId, adminKey);
  const productsIndex = client.initIndex(ALGOLIA_PRODUCTS_INDEX);

  cached = { client, productsIndex };
  return cached;
}

export function isAlgoliaEnabled(): boolean {
  const { client } = getAlgoliaClients();
  return !!client;
}


