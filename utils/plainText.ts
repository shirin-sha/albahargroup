/** Strip HTML and collapse whitespace for card previews. */
export function plainTextFromHtml(html: string | undefined, maxLen = 220): string {
  if (!html) return '';
  const plain = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  if (plain.length <= maxLen) return plain;
  return `${plain.slice(0, maxLen).trimEnd()}…`;
}
