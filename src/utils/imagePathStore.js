// src/utils/imagePathStore.js
let currentImagePath = '';

/**
 * Sets the base path for the current subject's assets.
 * This is called by the main BoardQuestions component when the subject changes.
 * @param {string} path - e.g., "data/physics-mcq/"
 */
export const setImageBasePath = (path) => {
  currentImagePath = path;
};

/**
 * Gets the currently stored asset base path.
 * This is used by the AssetFinder to build the full image URL.
 * @returns {string} The stored path.
 */
export const getImageBasePath = () => {
  return currentImagePath;
};