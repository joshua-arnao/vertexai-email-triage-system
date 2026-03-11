function anonymizeText(text) {
  if (!text) return '';
  return text
    .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[EMAIL]')
    .replace(/\b\d{7,11}\b/g, '[ID_NUMBER]')
    .replace(/\s+/g, ' ')
    .trim();
}
