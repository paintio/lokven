const fs = require('fs');
const path = require('path');

console.log('🔍 Поиск и замена эмодзи...');

// Карта замены эмодзи → иконки Lucide
const emojiMap = {
  '📊': 'LayoutDashboard',
  '👥': 'Users',
  '📋': 'ClipboardList',
  '📦': 'Package',
  '⭐': 'Star',
  '⚙️': 'Settings',
  '🔑': 'Key',
  '🏠': 'Home',
  '🔍': 'Search',
  '👤': 'User',
  '🚪': 'LogOut',
  '➕': 'Plus',
  '❤️': 'Heart',
  '🔔': 'Bell',
  '✏️': 'Edit',
  '🗑️': 'Trash2',
  '💼': 'Briefcase',
  '💰': 'Wallet',
  '📈': 'TrendingUp',
  '🛍️': 'ShoppingBag',
  '🛒': 'ShoppingCart',
  '🚗': 'Car',
  '🔧': 'Wrench',
  '📱': 'Smartphone',
  '🏡': 'House',
  '⚽': 'SoccerBall',
  '👕': 'Shirt',
  '📄': 'FileText',
  '📝': 'Edit',
  '🏷️': 'Tag',
  '📂': 'Folder',
  '📁': 'FolderOpen',
  '📥': 'Download',
  '📤': 'Upload',
  '📞': 'Phone',
  '💬': 'MessageSquare',
  '💸': 'Coins',
  '🌟': 'Star',
  '⏳': 'Clock',
  '🔒': 'Lock',
  '🔓': 'Unlock',
  '📭': 'Inbox',
  '⚠️': 'AlertTriangle',
  '😕': 'Frown',
  '👍': 'ThumbsUp',
  '👎': 'ThumbsDown',
  '🎉': 'PartyPopper',
  '🌱': 'Sprout',
  '📨': 'Mail',
  '🏦': 'Building2',
  '🔗': 'Link',
  '🌐': 'Globe',
  '📸': 'Camera',
  '📹': 'Video',
  '🎯': 'Target',
  '📍': 'MapPin',
  '🔐': 'Lock',
  '📌': 'Pin',
};

// Директория для поиска
const rootDir = './src';

// Функция обхода директорий
function walkDir(dir) {
  if (!fs.existsSync(dir)) {
    console.log(`❌ Папка ${dir} не найдена`);
    return;
  }

  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    try {
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        walkDir(fullPath);
      } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
        let content = fs.readFileSync(fullPath, 'utf8');
        let changed = false;
        let newContent = content;
        
        for (const [emoji, iconName] of Object.entries(emojiMap)) {
          if (content.includes(emoji)) {
            // Заменяем эмодзи на JSX иконку
            newContent = newContent.replace(
              new RegExp(emoji, 'g'),
              `<${iconName} className="w-4 h-4" />`
            );
            changed = true;
          }
        }
        
        if (changed) {
          // Проверяем, есть ли импорт Lucide
          if (!newContent.includes("from 'lucide-react'")) {
            // Добавляем импорт в начало файла
            const iconNames = [];
            for (const [emoji, iconName] of Object.entries(emojiMap)) {
              if (content.includes(emoji)) {
                iconNames.push(iconName);
              }
            }
            const uniqueIcons = [...new Set(iconNames)];
            if (uniqueIcons.length > 0) {
              const importLine = `import { ${uniqueIcons.join(', ')} } from 'lucide-react';\n`;
              newContent = importLine + newContent;
            }
          }
          
          fs.writeFileSync(fullPath, newContent, 'utf8');
          console.log(`✅ Обновлён: ${fullPath}`);
        }
      }
    } catch (err) {
      console.error(`❌ Ошибка при обработке ${fullPath}:`, err.message);
    }
  }
}

// Запускаем
console.log('📁 Поиск в папке:', rootDir);
walkDir(rootDir);
console.log('🎉 Готово!');