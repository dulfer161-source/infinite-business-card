export const formatPhone = (value: string): string => {
  const cleaned = value.replace(/\D/g, '');
  
  if (cleaned.length === 0) return '';
  
  let formatted = '+7';
  if (cleaned.length > 1) {
    formatted += ' (' + cleaned.substring(1, 4);
  }
  if (cleaned.length >= 5) {
    formatted += ') ' + cleaned.substring(4, 7);
  }
  if (cleaned.length >= 8) {
    formatted += '-' + cleaned.substring(7, 9);
  }
  if (cleaned.length >= 10) {
    formatted += '-' + cleaned.substring(9, 11);
  }
  
  return formatted;
};

export const fetchWithRetry = async (
  url: string,
  options: RequestInit,
  maxRetries = 3
): Promise<Response> => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.status === 503 && i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        continue;
      }
      return response;
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
  throw new Error('Max retries reached');
};
