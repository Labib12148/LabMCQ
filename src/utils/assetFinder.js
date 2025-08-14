// src/utils/assetFinder.js
import { getImageBasePath } from './imagePathStore';

// Use Vite's import.meta.glob to statically identify all possible assets.
// 'eager: true' imports the modules directly, giving us the final URL.
const assetModules = import.meta.glob('/src/data/**/*.{png,jpg,jpeg,gif,svg}', { eager: true });

// Create a cleaner map from a file path to its bundled URL.
// e.g., { "/src/data/physics-mcq/assets/image.png": "/assets/image.f1c54b.png" }
const assetUrls = Object.fromEntries(
  Object.entries(assetModules).map(([path, module]) => [path, module.default])
);

/**
 * Resolves the path for a static asset for Vite using a pre-built map.
 * This approach is compatible with Vite's static analysis.
 * @param {string} filename - The image filename from your JSON (e.g., "assets/image.png").
 * @returns {string} The fully resolved, working URL for the image.
 */
export const getAssetPath = (filename) => {
  if (!filename) return '';

  const basePath = getImageBasePath(); // Gets "data/physics-mcq/"
  if (!basePath) {
    console.error(`[AssetFinder] Image base path is not set. Cannot find asset: "${filename}"`);
    return '';
  }

  // Construct the absolute path from the project root to match the keys in the assetUrls map.
  // Example: /src/ + data/physics-mcq/ + assets/image.png
  const absolutePath = `/src/${basePath}${filename}`;

  const resolvedUrl = assetUrls[absolutePath];

  if (resolvedUrl) {
    return resolvedUrl;
  } else {
    // This warning is helpful for debugging missing assets during development.
    console.warn(`[AssetFinder] Asset not found at path: "${absolutePath}". Make sure the file exists and the path in your JSON data is correct.`);
    return '';
  }
};