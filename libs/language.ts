/**
 * Language utility functions for handling language prefixes in URLs
 */

export type Language = 'en' | 'ar';

/**
 * Get the current language from the pathname
 */
export function getLanguageFromPath(pathname: string): Language {
  if (pathname.startsWith('/ar')) {
    return 'ar';
  }
  return 'en';
}

/**
 * Add language prefix to a path
 * @param path - The path to add language prefix to (e.g., '/about-us')
 * @param lang - The language code ('en' or 'ar')
 * @returns The path with language prefix (e.g., '/ar/about-us' or '/about-us' for English)
 */
export function addLanguagePrefix(path: string, lang: Language): string {
  // Remove leading slash for processing
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  // Remove existing language prefix if present
  const pathWithoutLang = cleanPath.replace(/^\/(ar|en)/, '');
  
  // Add language prefix for Arabic, keep as is for English
  if (lang === 'ar') {
    return `/ar${pathWithoutLang}`;
  }
  
  return pathWithoutLang;
}

/**
 * Remove language prefix from a path
 * @param path - The path to remove language prefix from
 * @returns The path without language prefix
 */
export function removeLanguagePrefix(path: string): string {
  return path.replace(/^\/(ar|en)/, '') || '/';
}

/**
 * Switch language in the current path
 * @param currentPath - The current pathname
 * @param targetLang - The target language
 * @returns The path with the target language prefix
 */
export function switchLanguage(currentPath: string, targetLang: Language): string {
  const pathWithoutLang = removeLanguagePrefix(currentPath);
  return addLanguagePrefix(pathWithoutLang, targetLang);
}
