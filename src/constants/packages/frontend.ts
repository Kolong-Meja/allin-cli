import type { __FrontendPackagesProps } from '@/types/general.js';

export const NEXT_DEPENDENCIES: __FrontendPackagesProps = {
  packages: [
    {
      name: 'Tailwind CSS',
      originName: 'tailwindcss',
      summary:
        'Utility-first CSS framework for rapidly building custom user interfaces using predefined classes.',
    },
    {
      name: 'Tailwind CSS PostCSS',
      originName: '@tailwindcss/postcss',
      summary:
        'Official PostCSS plugin for Tailwind CSS that processes your CSS files to generate utility classes, enabling JIT compilation and seamless integration into your build pipeline.',
    },
    {
      name: 'PostCSS',
      originName: 'postcss',
      summary:
        'PostCSS runner required by Tailwind CSS and other CSS transformations.',
    },
    {
      name: 'ESLint',
      originName: 'eslint',
      summary:
        'Pluggable linting utility for JavaScript/TypeScript, helping maintain code consistency.',
    },
    {
      name: 'ESLint Plugin Next',
      originName: '@next/eslint-plugin-next',
      summary:
        'Adds ESLint rules and JSX support tailored for Next.js projects to ensure best practices and prevent common mistakes.',
    },
    {
      name: 'Prettier',
      originName: 'prettier',
      summary:
        'Opinionated code formatter supporting multiple languages, ensuring consistent style.',
    },
    {
      name: 'Dotenv',
      originName: 'dotenv',
      summary: 'Loads environment variables from a .env file into process.env.',
    },
    {
      name: 'Axios',
      originName: 'axios',
      summary:
        'Promise-based HTTP client for browsers and Node.js, with support for interceptors and transformations.',
    },
    {
      name: 'Zod',
      originName: 'zod',
      summary:
        'Type-safe schema validation library for TypeScript and JavaScript, enabling robust data parsing and type inference.',
    },
    {
      name: 'GraphQL.js',
      originName: 'graphql',
      summary:
        'Reference implementation of the GraphQL specification in JavaScript, providing utilities to build schemas and execute queries.',
    },
    {
      name: 'Apollo Client',
      originName: '@apollo/client',
      summary:
        'Comprehensive state management library for managing GraphQL data fetching, caching, and UI integration in React applications.',
    },
    {
      name: 'Apollo Server',
      originName: '@apollo/server',
      summary:
        'Standalone GraphQL server framework with support for schema federation and caching.',
    },
    {
      name: 'NextAuth.js',
      originName: 'next-auth',
      summary:
        'Authentication library for Next.js providing secure and flexible strategies with OAuth, JWT, and credentials support.',
    },
    {
      name: 'Next SEO',
      originName: 'next-seo',
      summary:
        'Plugin for managing SEO-related meta tags such as Open Graph, Twitter Cards, and JSON-LD in Next.js applications.',
    },
    {
      name: 'Next i18n',
      originName: 'next-i18next',
      summary:
        'Internationalization framework integrating i18next with Next.js for server-side rendered and static multilingual sites.',
    },
    {
      name: 'Jest',
      originName: 'jest',
      summary:
        'JavaScript testing framework with a focus on simplicity, performance, and zero-configuration setup for unit and integration testing.',
    },
    {
      name: 'Jest Environment JSDom',
      originName: 'jest-environment-jsdom',
      summary:
        'Jest environment using jsdom to simulate browser APIs for testing React components and DOM interactions.',
    },
    {
      name: 'Testing Library React',
      originName: '@testing-library/react',
      summary:
        'Simple and complete React testing utilities that encourage writing tests focused on user interactions.',
    },
    {
      name: 'Testing Library DOM',
      originName: '@testing-library/dom',
      summary:
        'Lightweight DOM testing library with utilities to query and interact with elements for pure JavaScript testing.',
    },
    {
      name: 'Testing Library Jest DOM',
      originName: '@testing-library/jest-dom',
      summary:
        'Custom Jest matchers that extend Testing Library with DOM-specific assertions for more expressive tests.',
    },
    {
      name: 'Playwright',
      originName: 'playwright',
      summary:
        'End-to-end testing library for automating browser interactions across Chromium, Firefox, and WebKit with reliable cross-browser support.',
    },
    {
      name: 'Drizzle ORM',
      originName: 'drizzle-orm',
      summary:
        'Lightweight TypeScript-first ORM for SQL, focusing on type-safety and migrations.',
    },
    {
      name: 'Drizzle Kit',
      originName: 'drizzle-kit',
      summary:
        'CLI toolkit for Drizzle ORM to generate and manage migrations and type-safe queries.',
    },
    {
      name: 'node-postgres',
      originName: 'pg',
      summary:
        'Pure JavaScript PostgreSQL client for Node.js, offering promises and connection pooling.',
    },
    {
      name: 'Chart.js',
      originName: 'chart.js',
      summary:
        'Simple yet flexible JavaScript charting library for creating interactive, responsive charts using HTML5 canvas.',
    },
    {
      name: 'GSAP',
      originName: 'gsap',
      summary:
        'High-performance animation library for timelines, tweens, and complex sequences on DOM, SVG, and canvas elements.',
    },
    {
      name: 'animejs',
      originName: 'animejs',
      summary:
        'Lightweight JavaScript animation engine for CSS properties, SVG, DOM attributes, and JavaScript Objects.',
    },
  ],
};

export const VUE_DEPENDENCIES: __FrontendPackagesProps = {
  packages: [
    {
      name: 'Tailwind CSS',
      originName: 'tailwindcss',
      summary:
        'Utility-first CSS framework for rapidly building custom user interfaces using predefined classes.',
    },
    {
      name: 'Tailwind CSS Vite',
      originName: '@tailwindcss/vite',
      summary:
        'Official Vite plugin to integrate Tailwind CSS into your build process, enabling JIT compilation and automatic class scanning.',
    },
    {
      name: 'ESLint',
      originName: 'eslint',
      summary:
        'Pluggable linting utility for JavaScript/TypeScript, helping maintain code consistency.',
    },
    {
      name: 'ESLint Plugin Vue',
      originName: 'eslint-plugin-vue',
      summary:
        'Adds ESLint rules and JSX support tailored for Vue.js projects to ensure best practices and prevent common mistakes.',
    },
    {
      name: 'Prettier',
      originName: 'prettier',
      summary:
        'Opinionated code formatter supporting multiple languages, ensuring consistent style.',
    },
    {
      name: 'Dotenv',
      originName: 'dotenv',
      summary: 'Loads environment variables from a .env file into process.env.',
    },
    {
      name: 'Axios',
      originName: 'axios',
      summary:
        'Promise-based HTTP client for browsers and Node.js, with support for interceptors and transformations.',
    },
    {
      name: 'Pinia',
      originName: 'pinia',
      summary:
        'State management library for Vue.js with a simple API, fully typed support, and modular store architecture.',
    },
    {
      name: 'Vue Router',
      originName: 'vue-router@4',
      summary:
        'Official routing library for Vue.js, supporting nested routes, dynamic routing, and navigation guards.',
    },
    {
      name: 'VeeValidate',
      originName: 'vee-validate',
      summary:
        'Flexible form validation library for Vue.js, offering both schema-based and field-level validation via the Composition API.',
    },
    {
      name: 'Auth Vue SDK',
      originName: '@auth0/auth0-vue',
      summary:
        'Auth0 official SDK for Vue.js, providing easy integration of authentication flows and secure token management.',
    },
    {
      name: 'Vue i18n',
      originName: 'vue-i18n@11',
      summary:
        'Internationalization plugin for Vue.js, enabling translations, pluralization, and date/number formatting with lazy-loading support.',
    },
    {
      name: 'Vue Use',
      originName: '@vueuse/core',
      summary:
        'Collection of utility Composition API functions for Vue.js, offering reactive abstractions like useFetch, useLocalStorage, and more.',
    },
    {
      name: 'Vitest',
      originName: 'vitest',
      summary:
        'Blazing fast unit test framework built on Vite, offering a Jest-compatible API optimized for Vue.js projects.',
    },
    {
      name: 'Vue Test Utils',
      originName: '@vue/test-utils',
      summary:
        'Official testing utilities for Vue.js, providing methods to mount components and assert rendered output and behavior.',
    },
    {
      name: 'Zod',
      originName: 'zod',
      summary:
        'Type-safe schema validation library for TypeScript and JavaScript, enabling robust data parsing and type inference.',
    },
    {
      name: 'Apollo Client',
      originName: '@apollo/client',
      summary:
        'Comprehensive state management library for managing GraphQL data fetching, caching, and UI integration in React applications.',
    },
    {
      name: 'Playwright',
      originName: 'playwright',
      summary:
        'End-to-end testing library for automating browser interactions across Chromium, Firefox, and WebKit with reliable cross-browser support.',
    },
    {
      name: 'Chart.js',
      originName: 'chart.js',
      summary:
        'Simple yet flexible JavaScript charting library for creating interactive, responsive charts using HTML5 canvas.',
    },
    {
      name: 'GSAP',
      originName: 'gsap',
      summary:
        'High-performance animation library for timelines, tweens, and complex sequences on DOM, SVG, and canvas elements.',
    },
    {
      name: 'animejs',
      originName: 'animejs',
      summary:
        'Lightweight JavaScript animation engine for CSS properties, SVG, DOM attributes, and JavaScript Objects.',
    },
  ],
};

export const SVELTE_DEPENDENCIES: __FrontendPackagesProps = {
  packages: [
    {
      name: 'Tailwind CSS',
      originName: 'tailwindcss',
      summary:
        'Utility-first CSS framework for rapidly building custom user interfaces using predefined classes.',
    },
    {
      name: 'Tailwind CSS Vite',
      originName: '@tailwindcss/vite',
      summary:
        'Official Vite plugin to integrate Tailwind CSS into your build process, enabling JIT compilation and automatic class scanning.',
    },
    {
      name: 'ESLint',
      originName: 'eslint',
      summary:
        'Pluggable linting utility for JavaScript/TypeScript, helping maintain code consistency.',
    },
    {
      name: 'ESLint Plugin Svelte',
      originName: 'eslint-plugin-svelte',
      summary:
        'Adds ESLint rules and JSX support tailored for Svelte projects to ensure best practices and prevent common mistakes.',
    },
    {
      name: 'Prettier',
      originName: 'prettier',
      summary:
        'Opinionated code formatter supporting multiple languages, ensuring consistent style.',
    },
    {
      name: 'Dotenv',
      originName: 'dotenv',
      summary: 'Loads environment variables from a .env file into process.env.',
    },
    {
      name: 'Axios',
      originName: 'axios',
      summary:
        'Promise-based HTTP client for browsers and Node.js, with support for interceptors and transformations.',
    },
    {
      name: 'graphql-request',
      originName: 'graphql-request',
      summary: 'Minimal GraphQL client.',
    },
    {
      name: '@urql/svelte',
      originName: '@urql/svelte',
      summary: 'A highly customizable and versatile GraphQL client.',
    },
    {
      name: 'Svelte Query',
      originName: '@sveltestack/svelte-query',
      summary:
        'Adaptation of TanStack Query for Svelte, providing powerful data fetching, caching, and synchronization hooks.',
    },
    {
      name: 'Sveltekit Auth',
      originName: '@auth/sveltekit',
      summary:
        'Authentication library for SvelteKit with built-in support for OAuth, JWT, and secure session management.',
    },
    {
      name: 'svelte-i18n',
      originName: 'svelte-i18n',
      summary:
        'Internationalization library for Svelte, supporting reactive translations, lazy-loading, pluralization, and locale management.',
    },
    {
      name: 'Svelte Meta Tags',
      originName: 'svelte-meta-tags',
      summary:
        'Utility for managing document head elements in Svelte, enabling declarative control over title, meta, and Open Graph tags.',
    },
    {
      name: 'Svelte Testing Library',
      originName: '@testing-library/svelte',
      summary:
        'User-centric testing utilities for Svelte components, focusing on interactions and accessibility queries.',
    },
    {
      name: 'date-fns',
      originName: 'date-fns',
      summary:
        'Modern JavaScript date utility library for parsing, formatting, and manipulating dates with tree-shaking support.',
    },
    {
      name: 'Zod',
      originName: 'zod',
      summary:
        'Type-safe schema validation library for TypeScript and JavaScript, enabling robust data parsing and type inference.',
    },
    {
      name: 'Vite Plugin PWA',
      originName: 'vite-plugin-pwa',
      summary:
        'Vite plugin to add PWA features to SvelteKit including service worker registration, manifest generation, and offline caching strategies.',
    },
    {
      name: 'Vitest',
      originName: 'vitest',
      summary:
        'Blazing fast unit test framework built on Vite, offering a Jest-compatible API optimized for Vue.js projects.',
    },
    {
      name: 'Playwright',
      originName: 'playwright',
      summary:
        'End-to-end testing library for automating browser interactions across Chromium, Firefox, and WebKit with reliable cross-browser support.',
    },
    {
      name: 'Chart.js',
      originName: 'chart.js',
      summary:
        'Simple yet flexible JavaScript charting library for creating interactive, responsive charts using HTML5 canvas.',
    },
    {
      name: 'GSAP',
      originName: 'gsap',
      summary:
        'High-performance animation library for timelines, tweens, and complex sequences on DOM, SVG, and canvas elements.',
    },
    {
      name: 'animejs',
      originName: 'animejs',
      summary:
        'Lightweight JavaScript animation engine for CSS properties, SVG, DOM attributes, and JavaScript Objects.',
    },
  ],
};

export const ASTRO_DEPENDENCIES: __FrontendPackagesProps = {
  packages: [
    {
      name: 'Tailwind CSS',
      originName: 'tailwindcss',
      summary:
        'Utility-first CSS framework for rapidly building custom user interfaces using predefined classes.',
    },
    {
      name: 'Tailwind CSS Vite',
      originName: '@tailwindcss/vite',
      summary:
        'Official Vite plugin to integrate Tailwind CSS into your build process, enabling JIT compilation and automatic class scanning.',
    },
    {
      name: 'ESLint',
      originName: 'eslint',
      summary:
        'Pluggable linting utility for JavaScript/TypeScript, helping maintain code consistency.',
    },
    {
      name: 'ESLint Plugin Astro',
      originName: 'eslint-plugin-astro',
      summary:
        'Adds ESLint rules and JSX support tailored for Astro projects to ensure best practices and prevent common mistakes.',
    },
    {
      name: 'Prettier',
      originName: 'prettier',
      summary:
        'Opinionated code formatter supporting multiple languages, ensuring consistent style.',
    },
    {
      name: 'Dotenv',
      originName: 'dotenv',
      summary: 'Loads environment variables from a .env file into process.env.',
    },
    {
      name: 'Axios',
      originName: 'axios',
      summary:
        'Promise-based HTTP client for browsers and Node.js, with support for interceptors and transformations.',
    },
    {
      name: 'date-fns',
      originName: 'date-fns',
      summary:
        'Modern JavaScript date utility library for parsing, formatting, and manipulating dates with tree-shaking support.',
    },
    {
      name: 'Auth Astro',
      originName: 'auth-astro',
      summary:
        'Authentication integration for Astro, providing server-side and client-side auth flows and secure session management.',
    },
    {
      name: 'AstroJS React',
      originName: '@astrojs/react',
      summary:
        'Official Astro integration that enables rendering React components in Astro projects with optimized bundling.',
    },
    {
      name: 'AstroJS Vue',
      originName: '@astrojs/vue',
      summary:
        'Official Astro integration for Vue, allowing seamless inclusion of Vue components with server-side rendering support.',
    },
    {
      name: 'AstroJS Svelte',
      originName: '@astrojs/svelte',
      summary:
        'Official Astro integration for Svelte, enabling Svelte components and reactive syntax within Astro pages.',
    },
    {
      name: 'AstroJS MDX',
      originName: '@astrojs/mdx',
      summary:
        'MDX integration for Astro, allowing JSX/TSX components in markdown files for interactive documentation and content.',
    },
    {
      name: 'Astro Icon',
      originName: 'astro-icon',
      summary:
        'Icon component for Astro that simplifies importing and optimizing SVG icons from popular icon sets.',
    },
    {
      name: 'AstroJS Sitemap',
      originName: '@astrojs/sitemap',
      summary:
        'Automated sitemap generator for Astro projects, creating sitemap.xml based on your site’s routes.',
    },
    {
      name: 'AstroJS RSS',
      originName: '@astrojs/rss',
      summary:
        'RSS feed generator for Astro, producing RSS/Atom feeds from content collections or markdown files.',
    },
    {
      name: 'Astro Robots',
      originName: 'astro-robots',
      summary:
        'Robots.txt generator for Astro, automatically creating robots.txt based on your configuration.',
    },
    {
      name: 'AstroJS Vercel',
      originName: '@astrojs/vercel',
      summary:
        'Astro adapter for Vercel, facilitating deployment and edge functions integration for Astro sites.',
    },
    {
      name: 'AstroJS Netlify',
      originName: '@astrojs/netlify',
      summary:
        'Astro adapter for Netlify, providing build and deployment configuration for Netlify hosting.',
    },
    {
      name: 'AstroJS Google Analytics',
      originName: '@digi4care/astro-google-analytics',
      summary:
        'Google Analytics integration for Astro, enabling automatic insertion of GA4 tracking scripts.',
    },
    {
      name: 'AstroJS Partytown',
      originName: '@astrojs/partytown',
      summary:
        'Partytown integration for Astro, offloading third-party scripts to web workers for improved performance.',
    },
    {
      name: 'Vitest',
      originName: 'vitest',
      summary:
        'Blazing fast unit test framework built on Vite, offering a Jest-compatible API optimized for Vue.js projects.',
    },
    {
      name: 'Playwright',
      originName: 'playwright',
      summary:
        'End-to-end testing library for automating browser interactions across Chromium, Firefox, and WebKit with reliable cross-browser support.',
    },
    {
      name: 'Chart.js',
      originName: 'chart.js',
      summary:
        'Simple yet flexible JavaScript charting library for creating interactive, responsive charts using HTML5 canvas.',
    },
    {
      name: 'GSAP',
      originName: 'gsap',
      summary:
        'High-performance animation library for timelines, tweens, and complex sequences on DOM, SVG, and canvas elements.',
    },
    {
      name: 'animejs',
      originName: 'animejs',
      summary:
        'Lightweight JavaScript animation engine for CSS properties, SVG, DOM attributes, and JavaScript Objects.',
    },
  ],
};

export const SOLID_DEPENDENCIES: __FrontendPackagesProps = {
  packages: [
    {
      name: 'Tailwind CSS',
      originName: 'tailwindcss',
      summary:
        'Utility-first CSS framework for rapidly building custom user interfaces using predefined classes.',
    },
    {
      name: 'Tailwind CSS Vite',
      originName: '@tailwindcss/vite',
      summary:
        'Official Vite plugin to integrate Tailwind CSS into your build process, enabling JIT compilation and automatic class scanning.',
    },
    {
      name: 'Autoprefixer',
      originName: 'autoprefixer',
      summary:
        'PostCSS plugin to parse CSS and add vendor prefixes automatically, ensuring cross-browser compatibility.',
    },
    {
      name: 'ESLint',
      originName: 'eslint',
      summary:
        'Pluggable linting utility for JavaScript/TypeScript, helping maintain code consistency.',
    },
    {
      name: 'ESLint Plugin Solid',
      originName: 'eslint-plugin-solid',
      summary:
        'Adds ESLint rules and JSX support tailored for SolidJS projects to ensure best practices and prevent common mistakes.',
    },
    {
      name: 'Prettier',
      originName: 'prettier',
      summary:
        'Opinionated code formatter supporting multiple languages, ensuring consistent style.',
    },
    {
      name: 'Dotenv',
      originName: 'dotenv',
      summary: 'Loads environment variables from a .env file into process.env.',
    },
    {
      name: 'Axios',
      originName: 'axios',
      summary:
        'Promise-based HTTP client for browsers and Node.js, with support for interceptors and transformations.',
    },
    {
      name: 'Vite',
      originName: 'vite',
      summary:
        'Next-generation frontend build tool with lightning-fast HMR, pre-bundling, and optimized production builds.',
    },
    {
      name: 'Vite Plugin Solid',
      originName: 'vite-plugin-solid',
      summary:
        'Official plugin to compile SolidJS components in Vite, enabling fast refresh and JSX/TSX support.',
    },
    {
      name: 'Vitest',
      originName: 'vitest',
      summary:
        'Blazing fast unit test framework built on Vite, offering a Jest-compatible API optimized for Vue.js projects.',
    },
    {
      name: 'SolidJS Router',
      originName: '@solidjs/router',
      summary:
        'Lightweight, client-side router for SolidJS with nested routes, route parameters, and lazy loading support.',
    },
    {
      name: 'graphql-request',
      originName: 'graphql-request',
      summary: 'Minimal GraphQL client.',
    },
    {
      name: 'Zod',
      originName: 'zod',
      summary:
        'Type-safe schema validation library for TypeScript and JavaScript, enabling robust data parsing and type inference.',
    },
    {
      name: 'Felte Solid',
      originName: '@felte/solid',
      summary:
        'Form state management library for SolidJS, providing validation, field arrays, and submission helpers.',
    },
    {
      name: 'Solid Primitives i18n',
      originName: '@solid-primitives/i18n',
      summary:
        'Collection of reactive internationalization primitives for SolidJS, handling translations, pluralization, and locale changes.',
    },
    {
      name: 'Solid Testing Library',
      originName: '@testing-library/solid',
      summary:
        'Testing utilities for SolidJS components following the Testing Library philosophy of user-centric tests.',
    },
    {
      name: 'Playwright',
      originName: 'playwright',
      summary:
        'End-to-end testing library for automating browser interactions across Chromium, Firefox, and WebKit with reliable cross-browser support.',
    },
    {
      name: 'Chart.js',
      originName: 'chart.js',
      summary:
        'Simple yet flexible JavaScript charting library for creating interactive, responsive charts using HTML5 canvas.',
    },
    {
      name: 'GSAP',
      originName: 'gsap',
      summary:
        'High-performance animation library for timelines, tweens, and complex sequences on DOM, SVG, and canvas elements.',
    },
    {
      name: 'animejs',
      originName: 'animejs',
      summary:
        'Lightweight JavaScript animation engine for CSS properties, SVG, DOM attributes, and JavaScript Objects.',
    },
  ],
};

export const VANILLA_DEPENDENCIES: __FrontendPackagesProps = {
  packages: [
    {
      name: 'Tailwind CSS',
      originName: 'tailwindcss',
      summary:
        'Utility-first CSS framework for rapidly building custom user interfaces using predefined classes.',
    },
    {
      name: 'Tailwind CSS Vite',
      originName: '@tailwindcss/vite',
      summary:
        'Official Vite plugin to integrate Tailwind CSS into your build process, enabling JIT compilation and automatic class scanning.',
    },
    {
      name: 'Autoprefixer',
      originName: 'autoprefixer',
      summary:
        'PostCSS plugin to parse CSS and add vendor prefixes automatically, ensuring cross-browser compatibility.',
    },
    {
      name: 'ESLint',
      originName: 'eslint',
      summary:
        'Pluggable linting utility for JavaScript/TypeScript, helping maintain code consistency.',
    },
    {
      name: 'Zod',
      originName: 'zod',
      summary:
        'Type-safe schema validation library for TypeScript and JavaScript, enabling robust data parsing and type inference.',
    },
    {
      name: 'Prettier',
      originName: 'prettier',
      summary:
        'Opinionated code formatter supporting multiple languages, ensuring consistent style.',
    },
    {
      name: 'Dotenv',
      originName: 'dotenv',
      summary: 'Loads environment variables from a .env file into process.env.',
    },
    {
      name: 'ky',
      originName: 'ky',
      summary:
        'Lightweight wrapper around the Fetch API with built-in retry, timeout, and JSON parsing for browser and Node environments.',
    },
    {
      name: 'Vitest',
      originName: 'vitest',
      summary:
        'Blazing fast unit test framework built on Vite, offering a Jest-compatible API optimized for Vue.js projects.',
    },
    {
      name: 'Chart.js',
      originName: 'chart.js',
      summary:
        'Simple yet flexible JavaScript charting library for creating interactive, responsive charts using HTML5 canvas.',
    },
    {
      name: 'GSAP',
      originName: 'gsap',
      summary:
        'High-performance animation library for timelines, tweens, and complex sequences on DOM, SVG, and canvas elements.',
    },
    {
      name: 'animejs',
      originName: 'animejs',
      summary:
        'Lightweight JavaScript animation engine for CSS properties, SVG, DOM attributes, and JavaScript Objects.',
    },
    {
      name: 'date-fns',
      originName: 'date-fns',
      summary:
        'Modern JavaScript date utility library with immutable, pure functions and tree-shakable modules for minimal bundle size.',
    },
    {
      name: 'Playwright',
      originName: 'playwright',
      summary:
        'End-to-end testing library for automating browser interactions across Chromium, Firefox, and WebKit with reliable cross-browser support.',
    },
  ],
};
