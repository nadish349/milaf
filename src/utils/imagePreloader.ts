/**
 * Image Preloader Utility
 * Preloads images and returns a promise that resolves when all images are loaded
 */

export interface PreloadResult {
  success: boolean;
  loadedImages: string[];
  failedImages: string[];
  totalTime: number;
}

export const preloadImages = (imageUrls: string[]): Promise<PreloadResult> => {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const loadedImages: string[] = [];
    const failedImages: string[] = [];
    let completedCount = 0;

    if (imageUrls.length === 0) {
      resolve({
        success: true,
        loadedImages: [],
        failedImages: [],
        totalTime: 0
      });
      return;
    }

    const handleImageLoad = (url: string) => {
      loadedImages.push(url);
      completedCount++;
      checkCompletion();
    };

    const handleImageError = (url: string) => {
      failedImages.push(url);
      completedCount++;
      checkCompletion();
    };

    const checkCompletion = () => {
      if (completedCount === imageUrls.length) {
        const totalTime = Date.now() - startTime;
        resolve({
          success: failedImages.length === 0,
          loadedImages,
          failedImages,
          totalTime
        });
      }
    };

    // Preload all images
    imageUrls.forEach(url => {
      const img = new Image();
      img.onload = () => handleImageLoad(url);
      img.onerror = () => handleImageError(url);
      img.src = url;
    });
  });
};

/**
 * Preload images with timeout
 */
export const preloadImagesWithTimeout = (
  imageUrls: string[], 
  timeoutMs: number = 10000
): Promise<PreloadResult> => {
  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      resolve({
        success: false,
        loadedImages: [],
        failedImages: imageUrls,
        totalTime: timeoutMs
      });
    }, timeoutMs);

    preloadImages(imageUrls).then((result) => {
      clearTimeout(timeout);
      resolve(result);
    });
  });
};

/**
 * Get all hero page images that need to be preloaded
 */
export const getHeroPageImages = (isMobile: boolean = false): string[] => {
  const baseImages = [
    // Core images used in both desktop and mobile
    '/src/assets/mfhq.png',
    '/src/assets/colapowderburst.png',
    '/src/assets/browndate4-2.png',
    '/src/assets/browndate2.png',
    '/src/assets/browndate4.png',
    '/src/assets/browndates5.png'
  ];

  if (isMobile) {
    return [
      '/src/assets/mobile/mobilepagehero.png',
      ...baseImages
    ];
  } else {
    return [
      '/src/assets/final4.png',
      ...baseImages
    ];
  }
};

// Image cache to store loaded images
const imageCache = new Map<string, HTMLImageElement>();

/**
 * Preload hero page images with progress callback and caching
 */
export const preloadHeroImages = (
  isMobile: boolean = false,
  onProgress?: (loaded: number, total: number) => void
): Promise<PreloadResult> => {
  const images = getHeroPageImages(isMobile);
  let loadedCount = 0;

  return new Promise((resolve) => {
    const startTime = Date.now();
    const loadedImages: string[] = [];
    const failedImages: string[] = [];

    if (images.length === 0) {
      resolve({
        success: true,
        loadedImages: [],
        failedImages: [],
        totalTime: 0
      });
      return;
    }

    const handleImageLoad = (url: string, img: HTMLImageElement) => {
      // Store in cache for future use
      imageCache.set(url, img);
      loadedImages.push(url);
      loadedCount++;
      onProgress?.(loadedCount, images.length);
      
      if (loadedCount === images.length) {
        const totalTime = Date.now() - startTime;
        resolve({
          success: failedImages.length === 0,
          loadedImages,
          failedImages,
          totalTime
        });
      }
    };

    const handleImageError = (url: string) => {
      failedImages.push(url);
      loadedCount++;
      onProgress?.(loadedCount, images.length);
      
      if (loadedCount === images.length) {
        const totalTime = Date.now() - startTime;
        resolve({
          success: failedImages.length === 0,
          loadedImages,
          failedImages,
          totalTime
        });
      }
    };

    // Preload all images with high priority and caching
    images.forEach(url => {
      // Check if image is already cached
      if (imageCache.has(url)) {
        handleImageLoad(url, imageCache.get(url)!);
        return;
      }

      const img = new Image();
      img.loading = 'eager'; // High priority loading
      img.fetchPriority = 'high'; // Browser hint for high priority
      img.crossOrigin = 'anonymous'; // Enable caching
      img.onload = () => handleImageLoad(url, img);
      img.onerror = () => handleImageError(url);
      img.src = url;
    });
  });
};

/**
 * Fast preload for critical hero images only with caching
 */
export const preloadCriticalHeroImages = (isMobile: boolean = false): void => {
  const criticalImages = isMobile 
    ? ['/src/assets/mobile/mobilepagehero.png', '/src/assets/mfhq.png']
    : ['/src/assets/final4.png', '/src/assets/mfhq.png'];
  
  // Preload critical images immediately with caching
  criticalImages.forEach(url => {
    // Check cache first
    if (imageCache.has(url)) {
      return; // Already cached
    }

    const img = new Image();
    img.loading = 'eager';
    img.fetchPriority = 'high';
    img.crossOrigin = 'anonymous';
    img.onload = () => imageCache.set(url, img);
    img.src = url;
  });
};

/**
 * Get cached image if available
 */
export const getCachedImage = (url: string): HTMLImageElement | null => {
  return imageCache.get(url) || null;
};

/**
 * Clear image cache (useful for memory management)
 */
export const clearImageCache = (): void => {
  imageCache.clear();
};

/**
 * Preload images with aggressive caching and optimization
 */
export const preloadHeroImagesOptimized = (
  isMobile: boolean = false,
  onProgress?: (loaded: number, total: number) => void
): Promise<PreloadResult> => {
  const images = getHeroPageImages(isMobile);
  let loadedCount = 0;

  return new Promise((resolve) => {
    const startTime = Date.now();
    const loadedImages: string[] = [];
    const failedImages: string[] = [];

    if (images.length === 0) {
      resolve({
        success: true,
        loadedImages: [],
        failedImages: [],
        totalTime: 0
      });
      return;
    }

    const handleImageLoad = (url: string, img: HTMLImageElement) => {
      // Store in cache for future use
      imageCache.set(url, img);
      loadedImages.push(url);
      loadedCount++;
      onProgress?.(loadedCount, images.length);
      
      if (loadedCount === images.length) {
        const totalTime = Date.now() - startTime;
        resolve({
          success: failedImages.length === 0,
          loadedImages,
          failedImages,
          totalTime
        });
      }
    };

    const handleImageError = (url: string) => {
      failedImages.push(url);
      loadedCount++;
      onProgress?.(loadedCount, images.length);
      
      if (loadedCount === images.length) {
        const totalTime = Date.now() - startTime;
        resolve({
          success: failedImages.length === 0,
          loadedImages,
          failedImages,
          totalTime
        });
      }
    };

    // Preload all images with aggressive optimization
    images.forEach(url => {
      // Check if image is already cached
      if (imageCache.has(url)) {
        handleImageLoad(url, imageCache.get(url)!);
        return;
      }

      const img = new Image();
      img.loading = 'eager';
      img.fetchPriority = 'high';
      img.crossOrigin = 'anonymous';
      img.decoding = 'async'; // Async decoding for better performance
      img.onload = () => handleImageLoad(url, img);
      img.onerror = () => handleImageError(url);
      img.src = url;
    });
  });
};
