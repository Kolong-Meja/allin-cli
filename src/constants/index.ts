import type {
  __BackendPackagesProps,
  __DefaultFrameworkProps,
  __DefaultLicenseProps,
  __FrontendPackagesProps,
} from '../types/default.js';

export const _projectTypes: string[] = ['backend', 'frontend'];

export const _backendFrameworks: __DefaultFrameworkProps = {
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
  ],
};

export const _frontendFrameworks: __DefaultFrameworkProps = {
  frameworks: [
    {
      name: 'Next.js',
      templateName: 'next-project',
      language: 'ts',
      path: 'templates/backend/next-project',
    },
    {
      name: 'Vue.js',
      templateName: 'vue-project',
      language: 'ts',
      path: 'templates/backend/vue-project',
    },
    {
      name: 'Svelte',
      templateName: 'svelte-project',
      language: 'js',
      path: 'templates/backend/svelte-project',
    },
    {
      name: 'Astro.js',
      templateName: 'astro-project',
      language: 'js',
      path: 'templates/backend/astro-project',
    },
  ],
};

export const _licenses: __DefaultLicenseProps = {
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

export const _dirtyWords = [
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
