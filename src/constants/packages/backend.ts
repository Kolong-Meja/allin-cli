import type { __BackendPackagesProps } from '@/types/general.js';

export const EXPRESS_DEPENDENCIES: __BackendPackagesProps = {
  packages: [
    {
      name: 'drizzle-orm',
      originName: 'drizzle-orm',
      summary:
        'Lightweight TypeScript-first ORM for SQL, focusing on type-safety and migrations.',
    },
    {
      name: 'drizzle-kit',
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
      name: 'eslint',
      originName: 'eslint',
      summary:
        'Pluggable linting utility for JavaScript/TypeScript, helping maintain code consistency.',
    },
    {
      name: 'prettier',
      originName: 'prettier',
      summary:
        'Opinionated code formatter supporting multiple languages, ensuring consistent style.',
    },
    {
      name: 'winston',
      originName: 'winston',
      summary:
        'Versatile logging library with support for multiple transports and configurable log levels.',
    },
    {
      name: 'axios',
      originName: 'axios',
      summary:
        'Promise-based HTTP client for browsers and Node.js, with support for interceptors and transformations.',
    },
    {
      name: 'bcrypt',
      originName: 'bcrypt',
      summary:
        'Library for hashing passwords using the Blowfish algorithm, secure for storing credentials.',
    },
    {
      name: 'cookie-parser',
      originName: 'cookie-parser',
      summary:
        'Express middleware for parsing Cookie headers and populating req.cookies.',
    },
    {
      name: 'socket.io',
      originName: 'socket.io',
      summary:
        'Library for real-time bidirectional event-based communication between client and server.',
    },
    {
      name: 'dotenv',
      originName: 'dotenv',
      summary: 'Loads environment variables from a .env file into process.env.',
    },
    {
      name: 'nodemon',
      originName: 'nodemon',
      summary:
        'Development utility that monitors file changes and automatically restarts your Node.js application.',
    },
    {
      name: 'helmet',
      originName: 'helmet',
      summary:
        'Sets various HTTP headers to secure Express apps against common vulnerabilities.',
    },
    {
      name: 'swagger-ui-express',
      originName: 'swagger-ui-express',
      summary:
        'Serves an interactive Swagger/OpenAPI UI in Express apps for API documentation.',
    },
    {
      name: 'swagger-jsdoc',
      originName: 'swagger-jsdoc',
      summary:
        'Generates an OpenAPI (Swagger) specification JSON or YAML by scanning your JSDoc comments, which you can then serve with koa2-swagger-ui.',
    },
    {
      name: '@apollo/server',
      originName: '@apollo/server',
      summary:
        'Standalone GraphQL server framework with support for schema federation and caching.',
    },
    {
      name: 'graphql',
      originName: 'graphql',
      summary:
        'The JavaScript reference implementation for GraphQL, a query language for APIs created by Facebook.',
    },
    {
      name: 'redis',
      originName: 'redis',
      summary:
        'Official Node.js client for Redis, a fast in-memory data store, providing promise-based APIs.',
    },
    {
      name: 'connect-redis',
      originName: 'connect-redis',
      summary:
        'Redis-based session store for express-session, improving session handling performance.',
    },
    {
      name: 'express-session',
      originName: 'express-session',
      summary:
        'Middleware for managing session state in Express applications, supporting various storage adapters.',
    },
    {
      name: 'express-validator',
      originName: 'express-validator',
      summary:
        'Collection of middlewares for input validation and sanitization in Express.',
    },
    {
      name: 'cors',
      originName: 'cors',
      summary: 'Middleware to enable Cross-Origin Resource Sharing in Express.',
    },
    {
      name: 'express-jwt',
      originName: 'express-jwt',
      summary:
        'JWT authentication middleware that verifies tokens and attaches req.user.',
    },
    {
      name: 'jsonwebtoken',
      originName: 'jsonwebtoken',
      summary:
        'Library to sign, verify, and decode JSON Web Tokens (JWT) for secure authentication and authorization.',
    },
    {
      name: 'express-rate-limit',
      originName: 'express-rate-limit',
      summary:
        'Simple rate-limiting middleware to protect APIs from abuse and light DDoS attacks.',
    },
    {
      name: 'jest',
      originName: 'jest',
      summary:
        'JavaScript testing framework with a focus on simplicity, performance, and zero-configuration setup for unit and integration testing.',
    },
    {
      name: 'ky',
      originName: 'ky',
      summary:
        'A tiny, elegant HTTP client built on the Fetch API, offering a simpler API, built-in retries, hooks, and a smaller bundle size compared to Axios (mostly for browser usage).',
    },
    {
      name: 'uuid',
      originName: 'uuid',
      summary:
        'A library for generating RFC-4122 UUIDs (v1, v3, v4, v5), commonly used to create unique identifiers for resources.',
    },
    {
      name: '@paralleldrive/cuid2',
      originName: '@paralleldrive/cuid2',
      summary:
        'Generates collision-resistant, human-readable IDs (CUIDs) that are shorter than UUIDs and optimized for horizontal scalability and uniqueness.',
    },
    {
      name: 'zod',
      originName: 'zod',
      summary:
        'Type-safe schema validation library for TypeScript and JavaScript, enabling robust data parsing and type inference.',
    },
  ],
};

export const FASTIFY_DEPENDENCIES: __BackendPackagesProps = {
  packages: [
    {
      name: 'drizzle-orm',
      originName: 'drizzle-orm',
      summary:
        'Lightweight TypeScript-first ORM for SQL, focusing on type-safety and migrations.',
    },
    {
      name: 'drizzle-kit',
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
      name: '@fastify/postgres',
      originName: '@fastify/postgres',
      summary: 'Fastify PostgreSQL connection plugin.',
    },
    {
      name: 'eslint',
      originName: 'eslint',
      summary:
        'Pluggable linting utility for JavaScript/TypeScript, helping maintain code consistency.',
    },
    {
      name: 'prettier',
      originName: 'prettier',
      summary:
        'Opinionated code formatter supporting multiple languages, ensuring consistent style.',
    },
    {
      name: 'winston',
      originName: 'winston',
      summary:
        'Versatile logging library with support for multiple transports and configurable log levels.',
    },
    {
      name: 'axios',
      originName: 'axios',
      summary:
        'Promise-based HTTP client for browsers and Node.js, with support for interceptors and transformations.',
    },
    {
      name: 'bcrypt',
      originName: 'bcrypt',
      summary:
        'Library for hashing passwords using the Blowfish algorithm, secure for storing credentials.',
    },
    {
      name: 'socket.io',
      originName: 'socket.io',
      summary:
        'Library for real-time bidirectional event-based communication between client and server.',
    },
    {
      name: 'dotenv',
      originName: 'dotenv',
      summary: 'Loads environment variables from a .env file into process.env.',
    },
    {
      name: 'nodemon',
      originName: 'nodemon',
      summary:
        'Development utility that monitors file changes and automatically restarts your Node.js application.',
    },
    {
      name: '@apollo/server',
      originName: '@apollo/server',
      summary:
        'Standalone GraphQL server framework with support for schema federation and caching.',
    },
    {
      name: 'graphql',
      originName: 'graphql',
      summary:
        'The JavaScript reference implementation for GraphQL, a query language for APIs created by Facebook.',
    },
    {
      name: '@fastify/helmet',
      originName: '@fastify/helmet',
      summary:
        'Fastify plugin to secure applications by setting various HTTP headers.',
    },
    {
      name: '@fastify/redis',
      originName: '@fastify/redis',
      summary:
        'Fastify plugin for Redis client integration, enabling caching and session storage.',
    },
    {
      name: '@fastify/jwt',
      originName: '@fastify/jwt',
      summary:
        'Fastify plugin for JSON Web Token authentication and authorization support.',
    },
    {
      name: 'jsonwebtoken',
      originName: 'jsonwebtoken',
      summary:
        'Library to sign, verify, and decode JSON Web Tokens (JWT) for secure authentication and authorization.',
    },
    {
      name: '@fastify/cookie',
      originName: '@fastify/cookie',
      summary:
        'Fastify plugin for parsing, signing, and setting cookies securely.',
    },
    {
      name: '@fastify/cors',
      originName: '@fastify/cors',
      summary:
        'Fastify plugin to enable Cross-Origin Resource Sharing support.',
    },
    {
      name: '@fastify/rate-limit',
      originName: '@fastify/rate-limit',
      summary:
        'Fastify plugin for rate limiting requests to protect against abuse and DDoS.',
    },
    {
      name: '@fastify/swagger-ui',
      originName: '@fastify/swagger-ui',
      summary:
        'Fastify plugin to serve Swagger UI for interactive API documentation.',
    },
    {
      name: 'swagger-jsdoc',
      originName: 'swagger-jsdoc',
      summary:
        'Generates an OpenAPI (Swagger) specification JSON or YAML by scanning your JSDoc comments, which you can then serve with koa2-swagger-ui.',
    },
    {
      name: 'jest',
      originName: 'jest',
      summary:
        'JavaScript testing framework with a focus on simplicity, performance, and zero-configuration setup for unit and integration testing.',
    },
    {
      name: 'ky',
      originName: 'ky',
      summary:
        'A tiny, elegant HTTP client built on the Fetch API, offering a simpler API, built-in retries, hooks, and a smaller bundle size compared to Axios (mostly for browser usage).',
    },
    {
      name: 'uuid',
      originName: 'uuid',
      summary:
        'A library for generating RFC-4122 UUIDs (v1, v3, v4, v5), commonly used to create unique identifiers for resources.',
    },
    {
      name: '@paralleldrive/cuid2',
      originName: '@paralleldrive/cuid2',
      summary:
        'Generates collision-resistant, human-readable IDs (CUIDs) that are shorter than UUIDs and optimized for horizontal scalability and uniqueness.',
    },
    {
      name: 'zod',
      originName: 'zod',
      summary:
        'Type-safe schema validation library for TypeScript and JavaScript, enabling robust data parsing and type inference.',
    },
  ],
};

export const NEST_DEPENDENCIES: __BackendPackagesProps = {
  packages: [
    {
      name: 'drizzle-orm',
      originName: 'drizzle-orm',
      summary:
        'Lightweight TypeScript-first ORM for SQL, focusing on type-safety and migrations.',
    },
    {
      name: 'drizzle-kit',
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
      name: 'eslint',
      originName: 'eslint',
      summary:
        'Pluggable linting utility for JavaScript/TypeScript, helping maintain code consistency.',
    },
    {
      name: 'prettier',
      originName: 'prettier',
      summary:
        'Opinionated code formatter supporting multiple languages, ensuring consistent style.',
    },
    {
      name: 'winston',
      originName: 'winston',
      summary:
        'Versatile logging library with support for multiple transports and configurable log levels.',
    },
    {
      name: 'axios',
      originName: 'axios',
      summary:
        'Promise-based HTTP client for browsers and Node.js, with support for interceptors and transformations.',
    },
    {
      name: 'bcrypt',
      originName: 'bcrypt',
      summary:
        'Library for hashing passwords using the Blowfish algorithm, secure for storing credentials.',
    },
    {
      name: 'dotenv',
      originName: 'dotenv',
      summary: 'Loads environment variables from a .env file into process.env.',
    },
    {
      name: 'cookie-parser',
      originName: 'cookie-parser',
      summary:
        'Express middleware for parsing Cookie headers and populating req.cookies.',
    },
    {
      name: 'socket.io',
      originName: 'socket.io',
      summary:
        'Library for real-time bidirectional event-based communication between client and server.',
    },
    {
      name: 'helmet',
      originName: 'helmet',
      summary:
        'Sets various HTTP headers to secure Express apps against common vulnerabilities.',
    },
    {
      name: '@nestjs/config',
      originName: '@nestjs/config',
      summary:
        'Official NestJS module for managing application configuration and environment variables.',
    },
    {
      name: 'class-validator',
      originName: 'class-validator',
      summary:
        'Decorator-based validation library to enforce rules on class properties in TypeScript.',
    },
    {
      name: 'class-transformer',
      originName: 'class-transformer',
      summary:
        'Library to transform and serialize class instances to and from plain objects.',
    },
    {
      name: '@nestjs/graphql',
      originName: '@nestjs/graphql',
      summary:
        'NestJS integration module for building GraphQL APIs with decorators and schema-first approach.',
    },
    {
      name: '@nestjs/apollo',
      originName: '@nestjs/apollo',
      summary:
        'Module to integrate Apollo GraphQL server into NestJS applications.',
    },
    {
      name: 'ioredis',
      originName: 'ioredis',
      summary:
        'High-performance Redis client with support for clusters, sentinels, and pipelines.',
    },
    {
      name: '@nestjs/jwt',
      originName: '@nestjs/jwt',
      summary:
        'NestJS wrapper around jsonwebtoken for implementing JWT authentication strategies.',
    },
    {
      name: 'jsonwebtoken',
      originName: 'jsonwebtoken',
      summary:
        'Library to sign, verify, and decode JSON Web Tokens (JWT) for secure authentication and authorization.',
    },
    {
      name: '@nestjs/throttler',
      originName: '@nestjs/throttler',
      summary:
        'NestJS module to rate-limit requests and prevent abuse or denial-of-service attacks.',
    },
    {
      name: '@nestjs/swagger',
      originName: '@nestjs/swagger',
      summary:
        'Module to generate OpenAPI (Swagger) documentation from NestJS route decorators.',
    },
    {
      name: 'swagger-jsdoc',
      originName: 'swagger-jsdoc',
      summary:
        'Generates an OpenAPI (Swagger) specification JSON or YAML by scanning your JSDoc comments, which you can then serve with koa2-swagger-ui.',
    },
    {
      name: 'jest',
      originName: 'jest',
      summary:
        'JavaScript testing framework with a focus on simplicity, performance, and zero-configuration setup for unit and integration testing.',
    },
    {
      name: 'ky',
      originName: 'ky',
      summary:
        'A tiny, elegant HTTP client built on the Fetch API, offering a simpler API, built-in retries, hooks, and a smaller bundle size compared to Axios (mostly for browser usage).',
    },
    {
      name: 'uuid',
      originName: 'uuid',
      summary:
        'A library for generating RFC-4122 UUIDs (v1, v3, v4, v5), commonly used to create unique identifiers for resources.',
    },
    {
      name: '@paralleldrive/cuid2',
      originName: '@paralleldrive/cuid2',
      summary:
        'Generates collision-resistant, human-readable IDs (CUIDs) that are shorter than UUIDs and optimized for horizontal scalability and uniqueness.',
    },
    {
      name: 'zod',
      originName: 'zod',
      summary:
        'Type-safe schema validation library for TypeScript and JavaScript, enabling robust data parsing and type inference.',
    },
  ],
};

export const NODE_DEPENDENCIES: __BackendPackagesProps = {
  packages: [
    {
      name: 'drizzle-orm',
      originName: 'drizzle-orm',
      summary:
        'Lightweight TypeScript-first ORM for SQL, focusing on type-safety and migrations.',
    },
    {
      name: 'drizzle-kit',
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
      name: 'eslint',
      originName: 'eslint',
      summary:
        'Pluggable linting utility for JavaScript/TypeScript, helping maintain code consistency.',
    },
    {
      name: 'prettier',
      originName: 'prettier',
      summary:
        'Opinionated code formatter supporting multiple languages, ensuring consistent style.',
    },
    {
      name: 'winston',
      originName: 'winston',
      summary:
        'Versatile logging library with support for multiple transports and configurable log levels.',
    },
    {
      name: 'axios',
      originName: 'axios',
      summary:
        'Promise-based HTTP client for browsers and Node.js, with support for interceptors and transformations.',
    },
    {
      name: 'bcrypt',
      originName: 'bcrypt',
      summary:
        'Library for hashing passwords using the Blowfish algorithm, secure for storing credentials.',
    },
    {
      name: 'socket.io',
      originName: 'socket.io',
      summary:
        'Library for real-time bidirectional event-based communication between client and server.',
    },
    {
      name: '@apollo/server',
      originName: '@apollo/server',
      summary:
        'Standalone GraphQL server framework with support for schema federation and caching.',
    },
    {
      name: 'graphql',
      originName: 'graphql',
      summary:
        'The JavaScript reference implementation for GraphQL, a query language for APIs created by Facebook.',
    },
    {
      name: 'dotenv',
      originName: 'dotenv',
      summary: 'Loads environment variables from a .env file into process.env.',
    },
    {
      name: 'ioredis',
      originName: 'ioredis',
      summary:
        'High-performance Redis client for Node.js with support for clusters, sentinels, and advanced features.',
    },
    {
      name: 'redis',
      originName: 'redis',
      summary:
        'Official Node.js client for Redis, a fast in-memory data store, providing promise-based APIs.',
    },
    {
      name: 'connect-redis',
      originName: 'connect-redis',
      summary:
        'Redis-based session store for express-session, improving session handling performance.',
    },
    {
      name: 'express-session',
      originName: 'express-session',
      summary:
        'Middleware for managing session state in Express applications, supporting various storage adapters.',
    },
    {
      name: 'jest',
      originName: 'jest',
      summary:
        'JavaScript testing framework with a focus on simplicity, performance, and zero-configuration setup for unit and integration testing.',
    },
    {
      name: 'nodemon',
      originName: 'nodemon',
      summary:
        'Development utility that monitors file changes and automatically restarts your Node.js application.',
    },
    {
      name: 'jsonwebtoken',
      originName: 'jsonwebtoken',
      summary:
        'Library to sign, verify, and decode JSON Web Tokens (JWT) for secure authentication and authorization.',
    },
    {
      name: 'passport',
      originName: 'passport',
      summary:
        'Flexible authentication middleware for Node.js, supporting a wide range of strategies (OAuth, JWT, etc.).',
    },
    {
      name: 'node-cron',
      originName: 'node-cron',
      summary:
        'Scheduler library for Node.js that enables running tasks at specified intervals using cron syntax.',
    },
    {
      name: 'cors',
      originName: 'cors',
      summary: 'Middleware to enable Cross-Origin Resource Sharing in Express.',
    },
    {
      name: 'swagger-ui-express',
      originName: 'swagger-ui-express',
      summary:
        'Serves an interactive Swagger/OpenAPI UI in Express apps for API documentation.',
    },
    {
      name: 'swagger-jsdoc',
      originName: 'swagger-jsdoc',
      summary:
        'Generates an OpenAPI (Swagger) specification JSON or YAML by scanning your JSDoc comments, which you can then serve with koa2-swagger-ui.',
    },
    {
      name: 'zod',
      originName: 'zod',
      summary:
        'Type-safe schema validation library for TypeScript and JavaScript, enabling robust data parsing and type inference.',
    },
    {
      name: 'ky',
      originName: 'ky',
      summary:
        'A tiny, elegant HTTP client built on the Fetch API, offering a simpler API, built-in retries, hooks, and a smaller bundle size compared to Axios (mostly for browser usage).',
    },
    {
      name: 'uuid',
      originName: 'uuid',
      summary:
        'A library for generating RFC-4122 UUIDs (v1, v3, v4, v5), commonly used to create unique identifiers for resources.',
    },
    {
      name: '@paralleldrive/cuid2',
      originName: '@paralleldrive/cuid2',
      summary:
        'Generates collision-resistant, human-readable IDs (CUIDs) that are shorter than UUIDs and optimized for horizontal scalability and uniqueness.',
    },
  ],
};

export const KOA_DEPENDENCIES: __BackendPackagesProps = {
  packages: [
    {
      name: 'drizzle-orm',
      originName: 'drizzle-orm',
      summary:
        'Lightweight TypeScript-first ORM for SQL, focusing on type-safety and migrations.',
    },
    {
      name: 'drizzle-kit',
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
      name: 'koa-router',
      originName: 'koa-router',
      summary:
        'A middleware layer for Koa that provides expressive route definitions (GET, POST, PUT, DELETE, etc.) and nesting support, making it easy to organize your endpoints.',
    },
    {
      name: 'koa-bodyparser',
      originName: 'koa-bodyparser',
      summary:
        'Parses incoming request bodies (JSON, form-urlencoded) and populates ctx.request.body, so you can access payload data directly in your route handlers.',
    },
    {
      name: 'koa-onerror',
      originName: 'koa-onerror',
      summary:
        'A centralized error handler for Koa applications that formats and responds to uncaught exceptions or thrown errors in a user-friendly way (differentiating between development and production).',
    },
    {
      name: 'koa-helmet',
      originName: 'koa-helmet',
      summary:
        'Integrates Helmet into Koa to set various HTTP headers (Content Security Policy, X-Frame-Options, HSTS, etc.) and help protect your app from common web vulnerabilities.',
    },
    {
      name: '@koa/cors',
      originName: '@koa/cors',
      summary:
        'Enables Cross-Origin Resource Sharing (CORS) in Koa, allowing browsers to safely make requests from different origins based on your configured policy.',
    },
    {
      name: 'koa-logger',
      originName: 'koa-logger',
      summary:
        'Simple middleware that logs HTTP requests and responses (method, URL, status, response time) to the console for easier debugging during development.',
    },
    {
      name: 'koa-compress',
      originName: 'koa-compress',
      summary:
        'Applies gzip/deflate compression to HTTP responses, reducing payload size and improving client load times.',
    },
    {
      name: 'dotenv',
      originName: 'dotenv',
      summary: 'Loads environment variables from a .env file into process.env.',
    },
    {
      name: 'joi',
      originName: 'joi',
      summary:
        'A powerful, schema-based validation library that lets you define rules for objects, strings, numbers, arrays, etc., and automatically validate incoming request data against those rules.',
    },
    {
      name: 'koa-jwt',
      originName: 'koa-jwt',
      summary:
        'Koa middleware for protecting routes using JSON Web Tokens, automatically decoding and verifying tokens and attaching the payload to ctx.state.',
    },
    {
      name: 'jsonwebtoken',
      originName: 'jsonwebtoken',
      summary:
        'Library to sign, verify, and decode JSON Web Tokens (JWT) for secure authentication and authorization.',
    },
    {
      name: 'koa-passport',
      originName: 'koa-passport',
      summary:
        'Passport.js integration for Koa, enabling a wide range of authentication strategies (local, OAuth, OpenID) with a familiar Passport API.',
    },
    {
      name: 'koa2-swagger-ui',
      originName: 'koa2-swagger-ui',
      summary:
        'Serves a Swagger-UI interface in your Koa app so you can visualize and interact with your OpenAPI/Swagger definitions directly in the browser.',
    },
    {
      name: 'swagger-jsdoc',
      originName: 'swagger-jsdoc',
      summary:
        'Generates an OpenAPI (Swagger) specification JSON or YAML by scanning your JSDoc comments, which you can then serve with koa2-swagger-ui.',
    },
    {
      name: 'eslint',
      originName: 'eslint',
      summary:
        'Pluggable linting utility for JavaScript/TypeScript, helping maintain code consistency.',
    },
    {
      name: 'prettier',
      originName: 'prettier',
      summary:
        'Opinionated code formatter supporting multiple languages, ensuring consistent style.',
    },
    {
      name: '@apollo/server',
      originName: '@apollo/server',
      summary:
        'Standalone GraphQL server framework with support for schema federation and caching.',
    },
    {
      name: 'graphql',
      originName: 'graphql',
      summary:
        'The JavaScript reference implementation for GraphQL, a query language for APIs created by Facebook.',
    },
    {
      name: 'jest',
      originName: 'jest',
      summary:
        'JavaScript testing framework with a focus on simplicity, performance, and zero-configuration setup for unit and integration testing.',
    },
    {
      name: 'nodemon',
      originName: 'nodemon',
      summary:
        'Development utility that monitors file changes and automatically restarts your Node.js application.',
    },
    {
      name: 'axios',
      originName: 'axios',
      summary:
        'Promise-based HTTP client for browsers and Node.js, with support for interceptors and transformations.',
    },
    {
      name: 'ky',
      originName: 'ky',
      summary:
        'A tiny, elegant HTTP client built on the Fetch API, offering a simpler API, built-in retries, hooks, and a smaller bundle size compared to Axios (mostly for browser usage).',
    },
    {
      name: 'uuid',
      originName: 'uuid',
      summary:
        'A library for generating RFC-4122 UUIDs (v1, v3, v4, v5), commonly used to create unique identifiers for resources.',
    },
    {
      name: '@paralleldrive/cuid2',
      originName: '@paralleldrive/cuid2',
      summary:
        'Generates collision-resistant, human-readable IDs (CUIDs) that are shorter than UUIDs and optimized for horizontal scalability and uniqueness.',
    },
    {
      name: 'zod',
      originName: 'zod',
      summary:
        'Type-safe schema validation library for TypeScript and JavaScript, enabling robust data parsing and type inference.',
    },
  ],
};
