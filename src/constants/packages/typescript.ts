type _BackendFramework = 'Express.js' | 'Fastify' | 'NestJS';
type _FrontendFramework = 'Next.js' | 'Vue.js' | 'Svelte';

export const _typescriptDependencies: {
  backend: Record<_BackendFramework, string[]>;
  frontend: Record<_FrontendFramework, string[]>;
} = {
  backend: {
    'Express.js': ['typescript', '@types/express'],
    Fastify: ['typescript', '@types/node'],
    NestJS: ['typescript', '@types/node', '@types/express'],
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
  },
};
