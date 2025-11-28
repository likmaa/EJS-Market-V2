/**
 * Gestionnaire d'erreurs centralisé
 */

export interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  timestamp?: string;
}

export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public context?: ErrorContext
  ) {
    super(message);
    this.name = 'AppError';
    this.context = {
      ...context,
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * Log une erreur de manière sécurisée
 */
export function logError(error: Error | AppError, context?: ErrorContext) {
  // En développement, afficher dans la console
  if (process.env.NODE_ENV === 'development') {
    console.error('Error logged:', {
      message: error.message,
      stack: error.stack,
      context: error instanceof AppError ? error.context : context,
    });
  }

  // En production, vous pourriez envoyer à un service de monitoring
  // Exemple avec Sentry :
  // if (process.env.NODE_ENV === 'production') {
  //   Sentry.captureException(error, { extra: context });
  // }
}

/**
 * Wrapper pour les fonctions async avec gestion d'erreur
 */
export function safeAsync<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  errorMessage?: string
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args);
    } catch (error) {
      logError(
        error instanceof Error ? error : new Error(String(error)),
        { action: fn.name }
      );
      throw error;
    }
  }) as T;
}

/**
 * Wrapper pour les fonctions synchrones avec gestion d'erreur
 */
export function safeSync<T extends (...args: any[]) => any>(
  fn: T,
  errorMessage?: string
): T {
  return ((...args: Parameters<T>) => {
    try {
      return fn(...args);
    } catch (error) {
      logError(
        error instanceof Error ? error : new Error(String(error)),
        { action: fn.name }
      );
      throw error;
    }
  }) as T;
}

/**
 * Vérifie si localStorage est disponible
 */
export function isLocalStorageAvailable(): boolean {
  try {
    if (typeof window === 'undefined') return false;
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

/**
 * Utilise localStorage de manière sécurisée
 */
export function safeLocalStorage() {
  return {
    getItem: (key: string): string | null => {
      if (!isLocalStorageAvailable()) return null;
      try {
        return localStorage.getItem(key);
      } catch {
        return null;
      }
    },
    setItem: (key: string, value: string): boolean => {
      if (!isLocalStorageAvailable()) return false;
      try {
        localStorage.setItem(key, value);
        return true;
      } catch {
        return false;
      }
    },
    removeItem: (key: string): boolean => {
      if (!isLocalStorageAvailable()) return false;
      try {
        localStorage.removeItem(key);
        return true;
      } catch {
        return false;
      }
    },
  };
}


