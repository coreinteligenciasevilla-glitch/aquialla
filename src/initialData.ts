import { CurationItem, Category, Subcategory } from './types';

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat_inspiracion_visual', name: 'Inspiración Visual', type: 'aqui' },
  { id: 'cat_codigo_limpio', name: 'Código y Patrones', type: 'aqui' },
  { id: 'cat_ux_fails', name: 'Errores de Usabilidad', type: 'alla' },
  { id: 'cat_codigo_fails', name: 'Malas Prácticas Código', type: 'alla' }
];

export const INITIAL_SUBCATEGORIES: Subcategory[] = [
  { id: 'sub_glassmorphism', category_id: 'cat_inspiracion_visual', name: 'Glassmorphism' },
  { id: 'sub_animaciones', category_id: 'cat_inspiracion_visual', name: 'Animaciones y Framer' },
  { id: 'sub_react_19', category_id: 'cat_codigo_limpio', name: 'React 19 / State' },
  { id: 'sub_touch_targets', category_id: 'cat_ux_fails', name: 'Tamaño de Botón' },
  { id: 'sub_infinite_loops', category_id: 'cat_codigo_fails', name: 'Loops de useEffect' },
  { id: 'sub_tree_shaking', category_id: 'cat_codigo_fails', name: 'Imports Gigantes' }
];

export const INITIAL_ITEMS: CurationItem[] = [
  {
    id: '1',
    title: 'React 19 Clean Forms con useActionState',
    url: 'https://www.youtube.com/watch?v=y_Y6u49vYTo',
    description: 'Increíble patrón para simplificar la gestión de estados de carga, errores y éxito en formularios interactivos sin boilerplate adicional.',
    category: 'aqui',
    contentType: 'youtube',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(), // 1 day ago
    category_id: 'cat_codigo_limpio',
    subcategory_id: 'sub_react_19'
  },
  {
    id: '2',
    title: 'El Peligroso Antipantrón del useEffect Infinito',
    url: 'https://www.linkedin.com/posts/react-hooks-pitfalls',
    description: 'Un desglose técnico de cómo mutar estados dentro de un useEffect sin dependencias primitivas estables causa loops de re-render destructivos.',
    category: 'alla',
    contentType: 'linkedin',
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(), // 18h ago
    category_id: 'cat_codigo_fails',
    subcategory_id: 'sub_infinite_loops'
  },
  {
    id: '3',
    title: 'Visuales Neon Glassmorphism Modernos',
    url: 'https://www.instagram.com/p/C-design-trends',
    description: 'Guía paso a paso para lograr el desenfoque de fondo perfecto (backdrop-blur) combinado con bordes translúcidos de alto impacto táctil.',
    category: 'aqui',
    contentType: 'instagram',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(), // 12h ago
    category_id: 'cat_inspiracion_visual',
    subcategory_id: 'sub_glassmorphism'
  },
  {
    id: '4',
    title: 'Librerías Gigantes Sin Tree-shaking en Producción',
    url: 'https://example.com/bad-performance-case',
    description: 'Caso de estudio de cómo importar lodash completo en lugar de sub-módulos específicos infló el bundle de producción en 2.3MB innecesarios.',
    category: 'alla',
    contentType: 'web',
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString(), // 6h ago
    category_id: 'cat_codigo_fails',
    subcategory_id: 'sub_tree_shaking'
  },
  {
    id: '5',
    title: 'Micro-interacciones Fluidas con Framer Motion',
    url: 'https://tiktok.com/@creative.dev/video/89127391',
    description: 'Aprende a animar listas dinámicas con layouts compartidos de forma fluida y con sólo un par de líneas de código declarativo.',
    category: 'aqui',
    contentType: 'tiktok',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(), // 2h ago
    category_id: 'cat_inspiracion_visual',
    subcategory_id: 'sub_animaciones'
  },
  {
    id: '6',
    title: 'Botones de Acción Sin Target Táctil Mínimo',
    url: 'https://tiktok.com/@ux.fails/video/77218391',
    description: 'Ejemplo de por qué diseñar botones menores a 44px de tamaño táctil rompe la usabilidad móvil y frustra a los usuarios finales.',
    category: 'alla',
    contentType: 'tiktok',
    createdAt: new Date(Date.now() - 3600000 * 1).toISOString(), // 1h ago
    category_id: 'cat_ux_fails',
    subcategory_id: 'sub_touch_targets'
  }
];
