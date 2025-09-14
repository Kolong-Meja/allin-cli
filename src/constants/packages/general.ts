import type { Mixed } from '@/types/general.js';

export const TYPESCRIPT_DEPENDENCIES: {
  [key: string]: Mixed;
} = {
  backend: {
    express: ['typescript', '@types/node', '@types/express'],
    fastify: ['typescript', '@types/node'],
    feather: ['typescript', '@types/node', 'ts-node'],
    nest: ['typescript', '@types/node', '@types/express'],
    node: ['typescript', '@types/node'],
    koa: ['typescript', '@types/node', '@types/koa'],
  } as const,
  frontend: {
    next: ['typescript', '@types/node', '@types/react', '@types/react-dom'],
    vue: [
      'typescript',
      '@types/node',
      '@vue/tsconfig',
      'vue-tsc',
      'npm-run-all2',
    ],
    svelte: ['typescript', '@types/node', 'svelte-check'],
    solid: ['typescript', '@types/node'],
    vanilla: ['typescript', '@types/node'],
  } as const,
};
