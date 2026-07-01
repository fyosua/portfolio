// Cache clearing utility for admin operations
export class CacheService {
  private static async clearCache(path: string = '/'): Promise<boolean> {
    try {
      const response = await fetch('/api/revalidate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          secret: process.env.NEXT_PUBLIC_REVALIDATION_SECRET,
          path: path
        }),
      });

      const result = await response.json();
      
      if (result.revalidated) {
        if (process.env.NODE_ENV !== 'production') console.log(`✅ Cache cleared for: ${path}`);
        return true;
      } else {
        if (process.env.NODE_ENV !== 'production') console.error('❌ Failed to clear cache:', result.error);
        return false;
      }
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') console.error('❌ Cache clearing error:', error);
      return false;
    }
  }

  // Clear cache after any portfolio data changes
  static async clearPortfolioCache(): Promise<boolean> {
    return await this.clearCache('/');
  }

  // Show success/error notification
  static showCacheNotification(success: boolean, operation: string) {
    if (success) {
      if (process.env.NODE_ENV !== 'production') console.log(`✅ ${operation} completed and cache cleared`);
    } else {
      if (process.env.NODE_ENV !== 'production') console.warn(`⚠️ ${operation} completed but cache clearing failed`);
    }
  }

  // Wrapper for admin operations with automatic cache clearing
  static async withCacheClearing<T>(
    operation: () => Promise<T>, 
    operationName: string
  ): Promise<T> {
    try {
      // Execute the operation first
      const result = await operation();
      
      // Then clear cache
      const cacheCleared = await this.clearPortfolioCache();
      this.showCacheNotification(cacheCleared, operationName);
      
      return result;
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') console.error(`❌ ${operationName} failed:`, error);
      throw error;
    }
  }
}

// Export individual functions for convenience
export const clearPortfolioCache = () => CacheService.clearPortfolioCache();
export const withCacheClearing = CacheService.withCacheClearing.bind(CacheService);