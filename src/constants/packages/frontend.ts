import type { __FrontendPackagesProps } from '@/types/general.js';

const FRONTEND_DEFAULT_DEPENDENCIES = {
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

export const NEXT_DEPENDENCIES: __FrontendPackagesProps = {
  packages: [
    ...FRONTEND_DEFAULT_DEPENDENCIES.packages,
    {
      name: '@tailwindcss/postcss',
      originName: '@tailwindcss/postcss',
    },
    {
      name: 'postcss',
      originName: 'postcss',
    },
    {
      name: '@next/eslint-plugin-next',
      originName: '@next/eslint-plugin-next',
    },
    {
      name: 'graphql',
      originName: 'graphql',
    },
    {
      name: '@apollo/client',
      originName: '@apollo/client',
    },
    {
      name: '@apollo/server',
      originName: '@apollo/server',
    },
    {
      name: 'next-auth',
      originName: 'next-auth',
    },
    {
      name: 'next-seo',
      originName: 'next-seo',
    },
    {
      name: 'next-i18next',
      originName: 'next-i18next',
    },
    {
      name: 'jest-environment-jsdom',
      originName: 'jest-environment-jsdom',
    },
    {
      name: '@testing-library/react',
      originName: '@testing-library/react',
    },
    {
      name: '@testing-library/dom',
      originName: '@testing-library/dom',
    },
    {
      name: '@testing-library/jest-dom',
      originName: '@testing-library/jest-dom',
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
      name: 'node-postgres',
      originName: 'pg',
    },
  ],
};

export const VUE_DEPENDENCIES: __FrontendPackagesProps = {
  packages: [
    ...FRONTEND_DEFAULT_DEPENDENCIES.packages,
    {
      name: '@tailwindcss/vite',
      originName: '@tailwindcss/vite',
    },
    {
      name: 'eslint-plugin-vue',
      originName: 'eslint-plugin-vue',
    },
    {
      name: 'pinia',
      originName: 'pinia',
    },
    {
      name: 'vue-router@4',
      originName: 'vue-router@4',
    },
    {
      name: 'vee-validate',
      originName: 'vee-validate',
    },
    {
      name: '@auth0/auth0-vue',
      originName: '@auth0/auth0-vue',
    },
    {
      name: 'vue-i18n@11',
      originName: 'vue-i18n@11',
    },
    {
      name: '@vueuse/core',
      originName: '@vueuse/core',
    },
    {
      name: 'vitest',
      originName: 'vitest',
    },
    {
      name: '@vue/test-utils',
      originName: '@vue/test-utils',
    },
    {
      name: '@apollo/client',
      originName: '@apollo/client',
    },
  ],
};

export const SVELTE_DEPENDENCIES: __FrontendPackagesProps = {
  packages: [
    ...FRONTEND_DEFAULT_DEPENDENCIES.packages,
    {
      name: '@tailwindcss/vite',
      originName: '@tailwindcss/vite',
    },
    {
      name: 'eslint-plugin-svelte',
      originName: 'eslint-plugin-svelte',
    },
    {
      name: 'graphql-request',
      originName: 'graphql-request',
    },
    {
      name: '@urql/svelte',
      originName: '@urql/svelte',
    },
    {
      name: '@sveltestack/svelte-query',
      originName: '@sveltestack/svelte-query',
    },
    {
      name: '@auth/sveltekit',
      originName: '@auth/sveltekit',
    },
    {
      name: 'svelte-i18n',
      originName: 'svelte-i18n',
    },
    {
      name: 'svelte-meta-tags',
      originName: 'svelte-meta-tags',
    },
    {
      name: '@testing-library/svelte',
      originName: '@testing-library/svelte',
    },
    {
      name: 'date-fns',
      originName: 'date-fns',
    },
    {
      name: 'vite-plugin-pwa',
      originName: 'vite-plugin-pwa',
    },
    {
      name: 'vitest',
      originName: 'vitest',
    },
  ],
};

export const ASTRO_DEPENDENCIES: __FrontendPackagesProps = {
  packages: [
    ...FRONTEND_DEFAULT_DEPENDENCIES.packages,
    {
      name: '@tailwindcss/vite',
      originName: '@tailwindcss/vite',
    },
    {
      name: 'eslint-plugin-astro',
      originName: 'eslint-plugin-astro',
    },
    {
      name: 'date-fns',
      originName: 'date-fns',
    },
    {
      name: 'auth-astro',
      originName: 'auth-astro',
    },
    {
      name: '@astrojs/react',
      originName: '@astrojs/react',
    },
    {
      name: '@astrojs/vue',
      originName: '@astrojs/vue',
    },
    {
      name: '@astrojs/svelte',
      originName: '@astrojs/svelte',
    },
    {
      name: '@astrojs/mdx',
      originName: '@astrojs/mdx',
    },
    {
      name: 'astro-icon',
      originName: 'astro-icon',
    },
    {
      name: '@astrojs/sitemap',
      originName: '@astrojs/sitemap',
    },
    {
      name: '@astrojs/rss',
      originName: '@astrojs/rss',
    },
    {
      name: 'astro-robots',
      originName: 'astro-robots',
    },
    {
      name: '@astrojs/vercel',
      originName: '@astrojs/vercel',
    },
    {
      name: '@astrojs/netlify',
      originName: '@astrojs/netlify',
    },
    {
      name: '@digi4care/astro-google-analytics',
      originName: '@digi4care/astro-google-analytics',
    },
    {
      name: '@astrojs/partytown',
      originName: '@astrojs/partytown',
    },
    {
      name: 'vitest',
      originName: 'vitest',
    },
  ],
};

export const SOLID_DEPENDENCIES: __FrontendPackagesProps = {
  packages: [
    ...FRONTEND_DEFAULT_DEPENDENCIES.packages,
    {
      name: '@tailwindcss/vite',
      originName: '@tailwindcss/vite',
    },
    {
      name: 'autoprefixer',
      originName: 'autoprefixer',
    },
    {
      name: 'eslint-plugin-solid',
      originName: 'eslint-plugin-solid',
    },
    {
      name: 'vite',
      originName: 'vite',
    },
    {
      name: 'vite-plugin-solid',
      originName: 'vite-plugin-solid',
    },
    {
      name: 'vitest',
      originName: 'vitest',
    },
    {
      name: '@solidjs/router',
      originName: '@solidjs/router',
    },
    {
      name: 'graphql-request',
      originName: 'graphql-request',
    },
    {
      name: '@felte/solid',
      originName: '@felte/solid',
    },
    {
      name: '@solid-primitives/i18n',
      originName: '@solid-primitives/i18n',
    },
    {
      name: '@testing-library/solid',
      originName: '@testing-library/solid',
    },
  ],
};

export const VANILLA_DEPENDENCIES: __FrontendPackagesProps = {
  packages: [
    ...FRONTEND_DEFAULT_DEPENDENCIES.packages,
    {
      name: '@tailwindcss/vite',
      originName: '@tailwindcss/vite',
    },
    {
      name: 'autoprefixer',
      originName: 'autoprefixer',
    },
    {
      name: 'vitest',
      originName: 'vitest',
    },
    {
      name: 'date-fns',
      originName: 'date-fns',
    },
  ],
};
