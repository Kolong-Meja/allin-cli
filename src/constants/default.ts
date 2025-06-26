import type {
  __DefaultFrameworkProps,
  __DefaultLicenseProps,
} from '@/types/general.js';

export const PROJECT_TYPES: string[] = ['backend', 'frontend'];

export const BACKEND_FRAMEWORKS: __DefaultFrameworkProps = {
  frameworks: [
    {
      name: 'Express.js',
      templateName: 'express-project',
      language: 'js',
      path: 'templates/backend/express-project',
    },
    {
      name: 'Fastify',
      templateName: 'fastify-project',
      language: 'js',
      path: 'templates/backend/fastify-project',
    },
    {
      name: 'NestJS',
      templateName: 'nest-project',
      language: 'ts',
      path: 'templates/backend/nest-project',
    },
    {
      name: 'Node.js',
      templateName: 'node-project',
      language: 'js',
      path: 'templates/backend/node-project',
    },
  ],
};

export const FRONTEND_FRAMEWORKS: __DefaultFrameworkProps = {
  frameworks: [
    {
      name: 'Next.js',
      templateName: 'next-project',
      language: 'ts',
      path: 'templates/frontend/next-project',
    },
    {
      name: 'Vue.js',
      templateName: 'vue-project',
      language: 'ts',
      path: 'templates/frontend/vue-project',
    },
    {
      name: 'Svelte',
      templateName: 'svelte-project',
      language: 'ts',
      path: 'templates/frontend/svelte-project',
    },
    {
      name: 'Astro.js',
      templateName: 'astro-project',
      language: 'ts',
      path: 'templates/frontend/astro-project',
    },
    {
      name: 'SolidJS',
      templateName: 'solid-project',
      language: 'ts',
      path: 'templates/frontend/solid-project',
    },
    {
      name: 'VanillaJS',
      templateName: 'vanilla-project',
      language: 'js',
      path: 'templates/frontend/vanilla-project',
    },
  ],
};

export const LICENSES: __DefaultLicenseProps = {
  licenses: [
    {
      name: 'Apache 2.0 License',
      templateName: 'apache-2.0',
      path: 'templates/licenses/apache-2.0',
    },
    {
      name: 'BSD 2-Clause License',
      templateName: 'bsd-2-clause',
      path: 'templates/licenses/bsd-2-clause',
    },
    {
      name: 'BSD 3-Clause License',
      templateName: 'bsd-3-clause',
      path: 'templates/licenses/bsd-3-clause',
    },
    {
      name: 'GNU General Public License v3.0',
      templateName: 'gpl-3.0',
      path: 'templates/licenses/gpl-3.0',
    },
    {
      name: 'ISC License',
      templateName: 'isc',
      path: 'templates/licenses/isc',
    },
    {
      name: 'GNU Lesser General Public License v3.0',
      templateName: 'lgpl-3.0',
      path: 'templates/licenses/lgpl-3.0',
    },
    {
      name: 'MIT License',
      templateName: 'mit',
      path: 'templates/licenses/mit',
    },
    {
      name: 'Unlicense',
      templateName: 'unlicense',
      path: 'templates/licenses/unlicense',
    },
  ],
};

export const DIRTY_WORDS = [
  'fuck',
  'shit',
  'bitch',
  'asshole',
  'dick',
  'pussy',
  'crap',
  'motherfucker',
  'slut',
  'whore',
  'goddamn',
  'bollocks',
  'wanker',
  'twat',
  'bugger',
  'bloody',
  'sod off',
  'arsehole',
  'git',
  'minger',
  'knob',
  'knobhead',
  'tai',
  'pante',
  'memek',
  'kontol',
  'bego',
  'tolol',
  'bajingan',
  'goblok',
  'asu',
  'bangsat',
  'kampret',
];
