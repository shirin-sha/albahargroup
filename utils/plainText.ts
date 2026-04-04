/** Strip HTML and collapse whitespace for card previews. */
export function plainTextFromHtml(html: string | undefined, maxLen = 220): string {
  if (!html) return '';
  const decoded = decodeHtmlEntities(html);
  const stripped = decoded.replace(/<[^>]*>/g, ' ');
  // Normalize all whitespace including non-breaking spaces to regular spaces
  const plain = stripped.replace(/\u00A0/g, ' ').replace(/\s+/g, ' ').trim();
  if (plain.length <= maxLen) return plain;
  return `${plain.slice(0, maxLen).trimEnd()}…`;
}

function decodeHtmlEntities(input: string): string {
  // Prefer a DOM-based decode when running in the browser
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = input;
    const value = textarea.value;
    return value;
  }

  // Fallback decoding for common entities during SSR or non-DOM contexts
  return input
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}
