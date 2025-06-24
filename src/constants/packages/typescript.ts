type _BackendFramework = 'Express.js' | 'Fastify' | 'NestJS' | 'Node.js';
type _FrontendFramework =
  | 'Next.js'
  | 'Vue.js'
  | 'Svelte'
  | 'SolidJS'
  | 'VanillaJS';

export const TYPESCRIPT_DEPENDENCIES: {
  backend: Record<_BackendFramework, string[]>;
  frontend: Record<_FrontendFramework, string[]>;
} = {
  backend: {
    'Express.js': ['typescript', '@types/express'],
    Fastify: ['typescript', '@types/node'],
    NestJS: ['typescript', '@types/node', '@types/express'],
    'Node.js': ['typescript', '@types/node'],
  },
  frontend: {
    'Next.js': [
      'typescript',
      '@types/node',
      '@types/react',
      '@types/react-dom',
    ],
    'Vue.js': [
      'typescript',
      '@types/node',
      '@vue/tsconfig',
      'vue-tsc',
      'npm-run-all2',
    ],
    Svelte: ['typescript', 'svelte-check'],
    SolidJS: ['typescript'],
    VanillaJS: ['typescript', '@types/node'],
  },
};
