/**
 * ESLint правило для проверки z-index слоёв
 * 
 * Использование:
 * 1. Добавьте в eslint.config.js:
 *    import zIndexRule from './.eslintrc.z-index.js';
 * 
 * 2. Добавьте в plugins:
 *    plugins: {
 *      'z-index': zIndexRule
 *    }
 * 
 * 3. Добавьте правило:
 *    'z-index/enforce-layers': 'error'
 */

const ALLOWED_Z_INDEX = {
  100: 'Toast/Toaster (системные уведомления)',
  90: 'Dialog/Sheet/AlertDialog (модальные окна)',
  80: 'Dropdown/Popover/Select (выпадающие меню)',
  70: 'Tour (интерактивный тур)',
  60: 'InstallPrompt/WelcomeNotification (уведомления)',
  50: 'Header/Navigation (навигация)',
};

const Z_INDEX_PATTERN = /z-(?:\[(\d+)\]|(\d+))/g;

export default {
  rules: {
    'enforce-layers': {
      meta: {
        type: 'problem',
        docs: {
          description: 'Проверяет использование разрешённых z-index слоёв',
          category: 'Best Practices',
        },
        messages: {
          invalidZIndex: 'Недопустимый z-index: {{value}}. Используйте только: {{allowed}}',
          useDocumented: 'z-index {{value}} не задокументирован. См. docs/z-index-layers.md',
        },
      },
      create(context) {
        return {
          JSXAttribute(node) {
            if (node.name.name !== 'className') return;

            const value = node.value?.value || '';
            const matches = value.matchAll(Z_INDEX_PATTERN);

            for (const match of matches) {
              const zValue = parseInt(match[1] || match[2]);
              
              if (!ALLOWED_Z_INDEX[zValue]) {
                const allowedValues = Object.keys(ALLOWED_Z_INDEX).join(', ');
                
                context.report({
                  node,
                  messageId: zValue > 100 || zValue < 50 ? 'invalidZIndex' : 'useDocumented',
                  data: {
                    value: zValue,
                    allowed: allowedValues,
                  },
                });
              }
            }
          },
        };
      },
    },
  },
};
