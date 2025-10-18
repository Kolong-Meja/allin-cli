import type { FrameworkConfig, FrameworkMeta } from '@/interfaces/global.js';
import type {
  __DefaultFrameworkProps,
  __DefaultLicenseProps,
} from '@/types/global.js';
import {
  EXPRESS_DEPENDENCIES,
  FASTIFY_DEPENDENCIES,
  FEATHER_DEPENDENCIES,
  KOA_DEPENDENCIES,
  NEST_DEPENDENCIES,
  NODE_DEPENDENCIES,
} from './backend.js';
import {
  ASTRO_DEPENDENCIES,
  NEXT_DEPENDENCIES,
  SOLID_DEPENDENCIES,
  SVELTE_DEPENDENCIES,
  VANILLA_DEPENDENCIES,
  VUE_DEPENDENCIES,
} from './frontend.js';

export const PROJECT_TYPES = ['backend', 'frontend'];

export const BACKEND_FRAMEWORKS: __DefaultFrameworkProps = {
  frameworks: [
    {
      name: 'express',
      actualName: 'Express.js',
      templateName: 'express-project',
      language: 'js',
      path: 'templates/backend/express-project',
    },
    {
      name: 'fastify',
      actualName: 'Fastify',
      templateName: 'fastify-project',
      language: 'js',
      path: 'templates/backend/fastify-project',
    },
    {
      name: 'feather',
      actualName: 'FeatherJS',
      templateName: 'feather-project',
      language: 'ts',
      path: 'templates/backend/feather-project',
    },
    {
      name: 'nest',
      actualName: 'NestJS',
      templateName: 'nest-project',
      language: 'ts',
      path: 'templates/backend/nest-project',
    },
    {
      name: 'node',
      actualName: 'Node.js',
      templateName: 'node-project',
      language: 'js',
      path: 'templates/backend/node-project',
    },
    {
      name: 'koa',
      actualName: 'Koa',
      templateName: 'koa-project',
      language: 'js',
      path: 'templates/backend/koa-project',
    },
  ],
};

export const FRONTEND_FRAMEWORKS: __DefaultFrameworkProps = {
  frameworks: [
    {
      name: 'next',
      actualName: 'Next.js',
      templateName: 'next-project',
      language: 'ts',
      path: 'templates/frontend/next-project',
    },
    {
      name: 'vue',
      actualName: 'Vue.js',
      templateName: 'vue-project',
      language: 'ts',
      path: 'templates/frontend/vue-project',
    },
    {
      name: 'svelte',
      actualName: 'Svelte',
      templateName: 'svelte-project',
      language: 'ts',
      path: 'templates/frontend/svelte-project',
    },
    {
      name: 'astro',
      actualName: 'Astro.js',
      templateName: 'astro-project',
      language: 'ts',
      path: 'templates/frontend/astro-project',
    },
    {
      name: 'solid',
      actualName: 'SolidJS',
      templateName: 'solid-project',
      language: 'ts',
      path: 'templates/frontend/solid-project',
    },
    {
      name: 'vanilla',
      actualName: 'VanillaJS',
      templateName: 'vanilla-project',
      language: 'js',
      path: 'templates/frontend/vanilla-project',
    },
  ],
};

export const LICENSES: __DefaultLicenseProps = {
  licenses: [
    {
      name: 'apache-2',
      actualName: 'Apache 2.0 License',
      templateName: 'apache-2.0',
      path: 'templates/licenses/apache-2.0',
    },
    {
      name: 'bsd-2',
      actualName: 'BSD 2-Clause License',
      templateName: 'bsd-2-clause',
      path: 'templates/licenses/bsd-2-clause',
    },
    {
      name: 'bsd-3',
      actualName: 'BSD 3-Clause License',
      templateName: 'bsd-3-clause',
      path: 'templates/licenses/bsd-3-clause',
    },
    {
      name: 'gpl-3',
      actualName: 'GNU General Public License v3.0',
      templateName: 'gpl-3.0',
      path: 'templates/licenses/gpl-3.0',
    },
    {
      name: 'isc',
      actualName: 'ISC License',
      templateName: 'isc',
      path: 'templates/licenses/isc',
    },
    {
      name: 'lgpl-3',
      actualName: 'GNU Lesser General Public License v3.0',
      templateName: 'lgpl-3.0',
      path: 'templates/licenses/lgpl-3.0',
    },
    {
      name: 'mit',
      actualName: 'MIT License',
      templateName: 'mit',
      path: 'templates/licenses/mit',
    },
    {
      name: 'unlicense',
      actualName: 'Unlicense',
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

export const TEMPLATES_META_MAP = new Map<string, FrameworkMeta>([
  [
    'astro',
    {
      name: 'astro',
      actualName: 'Astro.js',
      packages: ASTRO_DEPENDENCIES.packages,
      promptKey: 'astroDependencies',
      category: 'frontend',
    },
  ],
  [
    'next',
    {
      name: 'next',
      actualName: 'Next.js',
      packages: NEXT_DEPENDENCIES.packages,
      promptKey: 'nextDependencies',
      category: 'frontend',
    },
  ],
  [
    'solid',
    {
      name: 'solid',
      actualName: 'SolidJS',
      packages: SOLID_DEPENDENCIES.packages,
      promptKey: 'solidDependencies',
      category: 'frontend',
    },
  ],
  [
    'svelte',
    {
      name: 'svelte',
      actualName: 'Svelte',
      packages: SVELTE_DEPENDENCIES.packages,
      promptKey: 'svelteDependencies',
      category: 'frontend',
    },
  ],
  [
    'vue',
    {
      name: 'vue',
      actualName: 'Vue.js',
      packages: VUE_DEPENDENCIES.packages,
      promptKey: 'vueDependencies',
      category: 'frontend',
    },
  ],
  [
    'vanilla',
    {
      name: 'vanilla',
      actualName: 'VanillaJS',
      packages: VANILLA_DEPENDENCIES.packages,
      promptKey: 'vanillaDependencies',
      category: 'frontend',
    },
  ],
  [
    'express',
    {
      name: 'express',
      actualName: 'Express.js',
      packages: EXPRESS_DEPENDENCIES.packages,
      promptKey: 'expressDependencies',
      category: 'backend',
    },
  ],
  [
    'fastify',
    {
      name: 'fastify',
      actualName: 'Fastify',
      packages: FASTIFY_DEPENDENCIES.packages,
      promptKey: 'fastifyDependencies',
      category: 'backend',
    },
  ],
  [
    'feather',
    {
      name: 'feather',
      actualName: 'FeatherJS',
      packages: FEATHER_DEPENDENCIES.packages,
      promptKey: 'featherDependencies',
      category: 'backend',
    },
  ],
  [
    'nest',
    {
      name: 'nest',
      actualName: 'NestJS',
      packages: NEST_DEPENDENCIES.packages,
      promptKey: 'nestDependencies',
      category: 'backend',
    },
  ],
  [
    'node',
    {
      name: 'node',
      actualName: 'Node.js',
      packages: NODE_DEPENDENCIES.packages,
      promptKey: 'nodeDependencies',
      category: 'backend',
    },
  ],
  [
    'koa',
    {
      name: 'koa',
      actualName: 'Koa',
      packages: KOA_DEPENDENCIES.packages,
      promptKey: 'koaDependencies',
      category: 'backend',
    },
  ],
]);

export function templatesMap(srcPath: string, desPath: string) {
  const templateMap = new Map<string, FrameworkConfig>();

  for (const [key, meta] of TEMPLATES_META_MAP.entries()) {
    templateMap.set(key, {
      ...meta,
      templateSource: srcPath,
      templateDest: desPath,
    });
  }

  return templateMap;
}
