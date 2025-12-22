/**
 * Utilitaires pour les requêtes à l'API Strapi
 * Fonctions typées pour faciliter les appels API
 */

import type {
  StrapiEntity,
  StrapiResponse,
  StrapiCollectionResponse,
  StrapiErrorResponse,
} from '@/types/strapi';

/**
 * Options de requête Strapi
 */
export interface StrapiQueryOptions {
  populate?: string | string[] | Record<string, unknown>;
  filters?: Record<string, unknown>;
  sort?: string | string[];
  pagination?: {
    page?: number;
    pageSize?: number;
    start?: number;
    limit?: number;
  };
  fields?: string[];
  locale?: string;
  publicationState?: 'live' | 'preview';
}

/**
 * Configuration du client Strapi
 */
export interface StrapiConfig {
  apiUrl: string;
  apiToken?: string;
}

/**
 * Classe utilitaire pour les requêtes Strapi typées
 */
export class StrapiClient {
  private config: StrapiConfig;

  constructor(config: StrapiConfig) {
    // Valider l'URL
    if (!config.apiUrl || config.apiUrl === 'URLduFuturSite') {
      throw new Error('STRAPI_URL invalide ou manquante. Configurez NEXT_PUBLIC_STRAPI_URL dans .env.local');
    }
    
    this.config = config;
  }

  /**
   * Construit les headers de la requête
   */
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.config.apiToken) {
      headers['Authorization'] = `Bearer ${this.config.apiToken}`;
    }

    return headers;
  }

  /**
   * Construit l'URL avec les paramètres de requête
   */
  private buildUrl(path: string, options?: StrapiQueryOptions): string {
    const url = new URL(path, this.config.apiUrl);

    if (!options) return url.toString();

    const params = new URLSearchParams();

    // Populate
    if (options.populate) {
      if (typeof options.populate === 'string') {
        params.append('populate', options.populate);
      } else if (Array.isArray(options.populate)) {
        options.populate.forEach(p => params.append('populate', p));
      } else {
        params.append('populate', JSON.stringify(options.populate));
      }
    }

    // Filters
    if (options.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        params.append(`filters[${key}]`, String(value));
      });
    }

    // Sort
    if (options.sort) {
      const sortArray = Array.isArray(options.sort) ? options.sort : [options.sort];
      sortArray.forEach(s => params.append('sort', s));
    }

    // Pagination
    if (options.pagination) {
      Object.entries(options.pagination).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(`pagination[${key}]`, String(value));
        }
      });
    }

    // Fields
    if (options.fields) {
      options.fields.forEach(f => params.append('fields', f));
    }

    // Locale
    if (options.locale) {
      params.append('locale', options.locale);
    }

    // Publication state
    if (options.publicationState) {
      params.append('publicationState', options.publicationState);
    }

    const queryString = params.toString();
    if (queryString) {
      url.search = queryString;
    }

    return url.toString();
  }

  /**
   * Récupère une collection
   */
  async findMany<T>(
    contentType: string,
    options?: StrapiQueryOptions
  ): Promise<StrapiCollectionResponse<T>> {
    const url = this.buildUrl(`/api/${contentType}`, options);

    const response = await fetch(url, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const error: StrapiErrorResponse = await response.json();
      throw new Error(error.error.message);
    }

    return response.json();
  }

  /**
   * Récupère une entrée par ID
   */
  async findOne<T>(
    contentType: string,
    id: number | string,
    options?: StrapiQueryOptions
  ): Promise<StrapiResponse<T>> {
    const url = this.buildUrl(`/api/${contentType}/${id}`, options);

    const response = await fetch(url, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const error: StrapiErrorResponse = await response.json();
      throw new Error(error.error.message);
    }

    return response.json();
  }

  /**
   * Crée une nouvelle entrée
   */
  async create<T>(
    contentType: string,
    data: Partial<T>
  ): Promise<StrapiResponse<T>> {
    const url = this.buildUrl(`/api/${contentType}`);

    const response = await fetch(url, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ data }),
    });

    if (!response.ok) {
      const error: StrapiErrorResponse = await response.json();
      throw new Error(error.error.message);
    }

    return response.json();
  }

  /**
   * Met à jour une entrée
   */
  async update<T>(
    contentType: string,
    id: number | string,
    data: Partial<T>
  ): Promise<StrapiResponse<T>> {
    const url = this.buildUrl(`/api/${contentType}/${id}`);

    const response = await fetch(url, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify({ data }),
    });

    if (!response.ok) {
      const error: StrapiErrorResponse = await response.json();
      throw new Error(error.error.message);
    }

    return response.json();
  }

  /**
   * Supprime une entrée
   */
  async delete<T>(
    contentType: string,
    id: number | string
  ): Promise<StrapiResponse<T>> {
    const url = this.buildUrl(`/api/${contentType}/${id}`);

    const response = await fetch(url, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const error: StrapiErrorResponse = await response.json();
      throw new Error(error.error.message);
    }

    return response.json();
  }
}

/**
 * Helper pour créer une instance du client Strapi
 */
export function createStrapiClient(config: StrapiConfig): StrapiClient {
  return new StrapiClient(config);
}
