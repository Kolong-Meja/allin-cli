import type { Mixed } from '@/types/global.js';

export const FRONTEND_DEFAULT_DEPENDENCIES = {
  packages: [
    {
      name: 'eslint',
      originName: 'eslint',
    },
    {
      name: 'prettier',
      originName: 'prettier',
    },
    {
      name: 'dotenv',
      originName: 'dotenv',
    },
    {
      name: 'axios',
      originName: 'axios',
    },
    {
      name: 'ky',
      originName: 'ky',
    },
    {
      name: 'zod',
      originName: 'zod',
    },
    {
      name: 'jest',
      originName: 'jest',
    },
    {
      name: 'playwright',
      originName: 'playwright',
    },
    {
      name: 'chart.js',
      originName: 'chart.js',
    },
    {
      name: 'gsap',
      originName: 'gsap',
    },
    {
      name: 'animejs',
      originName: 'animejs',
    },
    {
      name: 'tailwindcss',
      originName: 'tailwindcss',
    },
  ],
};

export const BACKEND_DEFAULT_DEPENDENCIES = {
  packages: [
    {
      name: 'node-postgres',
      originName: 'pg',
    },
    {
      name: 'drizzle-orm',
      originName: 'drizzle-orm',
    },
    {
      name: 'drizzle-kit',
      originName: 'drizzle-kit',
    },
    {
      name: 'eslint',
      originName: 'eslint',
    },
    {
      name: 'prettier',
      originName: 'prettier',
    },
    {
      name: 'axios',
      originName: 'axios',
    },
    {
      name: 'dotenv',
      originName: 'dotenv',
    },
    {
      name: 'zod',
      originName: 'zod',
    },
    {
      name: 'graphql',
      originName: 'graphql',
    },
    {
      name: 'socket.io',
      originName: 'socket.io',
    },
    {
      name: 'redis',
      originName: 'redis',
    },
    {
      name: 'jsonwebtoken',
      originName: 'jsonwebtoken',
    },
    {
      name: 'swagger-jsdoc',
      originName: 'swagger-jsdoc',
    },
    {
      name: 'ky',
      originName: 'ky',
    },
    {
      name: '@paralleldrive/cuid2',
      originName: '@paralleldrive/cuid2',
    },
    {
      name: 'uuid',
      originName: 'uuid',
    },
    {
      name: 'jest',
      originName: 'jest',
    },
    {
      name: 'bcrypt',
      originName: 'bcrypt',
    },
  ],
};

export const TYPESCRIPT_DEFAULT_DEPENDENCIES: {
  [key: string]: Mixed;
} = {
  backend: {
    express: ['typescript', '@types/node', '@types/express'],
    fastify: ['typescript', '@types/node'],
    feather: ['typescript', '@types/node', 'ts-node'],
    nest: ['typescript', '@types/node', '@types/express'],
    node: ['typescript', '@types/node'],
    koa: ['typescript', '@types/node', '@types/koa'],
  },
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
  },
};
