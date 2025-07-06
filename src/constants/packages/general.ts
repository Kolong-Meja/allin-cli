import type { Mixed } from '@/types/general.js';

export const TYPESCRIPT_DEPENDENCIES: {
  [key: string]: Mixed;
} = {
  backend: {
    'Express.js': ['typescript', '@types/node', '@types/express'],
    Fastify: ['typescript', '@types/node'],
    NestJS: ['typescript', '@types/node', '@types/express'],
    'Node.js': ['typescript', '@types/node'],
    Koa: ['typescript', '@types/node', '@types/koa'],
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
    Svelte: ['typescript', '@types/node', 'svelte-check'],
    SolidJS: ['typescript', '@types/node'],
    VanillaJS: ['typescript', '@types/node'],
  },
};
