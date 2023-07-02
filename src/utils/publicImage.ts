/**
 * Generates a URL for a public image.
 *
 * @param {string} url - The path of the image relative to the public directory.
 * @returns {string} - A URL string which can be used to reference the image in the public directory.
 */
export const publicImage = (url: string) => `url(${process.env.PUBLIC_URL + url})`;