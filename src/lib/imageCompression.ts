/**
 * Сжимает изображение до указанных параметров
 * @param file - Исходный файл изображения
 * @param maxWidth - Максимальная ширина (по умолчанию 800px)
 * @param maxHeight - Максимальная высота (по умолчанию 800px)
 * @param quality - Качество JPEG (0-1, по умолчанию 0.85)
 * @returns Promise с base64 строкой сжатого изображения
 */
export const compressImage = (
  file: File,
  maxWidth: number = 800,
  maxHeight: number = 800,
  quality: number = 0.85
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Вычисляем новые размеры с сохранением пропорций
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Не удалось создать canvas context'));
          return;
        }
        
        // Рисуем изображение с новыми размерами
        ctx.drawImage(img, 0, 0, width, height);
        
        // Конвертируем в base64 с компрессией
        const base64 = canvas.toDataURL('image/jpeg', quality).split(',')[1];
        resolve(base64);
      };
      
      img.onerror = () => {
        reject(new Error('Не удалось загрузить изображение'));
      };
      
      img.src = e.target?.result as string;
    };
    
    reader.onerror = () => {
      reject(new Error('Не удалось прочитать файл'));
    };
    
    reader.readAsDataURL(file);
  });
};
