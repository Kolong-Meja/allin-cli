import type { __BackendPackagesProps } from '@/types/global.js';
import { BACKEND_DEFAULT_DEPENDENCIES } from '@/constants/default.js';

export const EXPRESS_DEPENDENCIES: __BackendPackagesProps = {
  packages: [
    ...BACKEND_DEFAULT_DEPENDENCIES.packages,
    {
      name: 'winston',
      originName: 'winston',
    },
    {
      name: 'cookie-parser',
      originName: 'cookie-parser',
    },
    {
      name: 'nodemon',
      originName: 'nodemon',
    },
    {
      name: 'helmet',
      originName: 'helmet',
    },
    {
      name: 'swagger-ui-express',
      originName: 'swagger-ui-express',
    },
    {
      name: '@apollo/server',
      originName: '@apollo/server',
    },
    {
      name: 'connect-redis',
      originName: 'connect-redis',
    },
    {
      name: 'express-session',
      originName: 'express-session',
    },
    {
      name: 'express-validator',
      originName: 'express-validator',
    },
    {
      name: 'cors',
      originName: 'cors',
    },
    {
      name: 'express-jwt',
      originName: 'express-jwt',
    },
    {
      name: 'express-rate-limit',
      originName: 'express-rate-limit',
    },
  ],
};

export const FASTIFY_DEPENDENCIES: __BackendPackagesProps = {
  packages: [
    ...BACKEND_DEFAULT_DEPENDENCIES.packages,
    {
      name: '@fastify/postgres',
      originName: '@fastify/postgres',
    },
    {
      name: 'winston',
      originName: 'winston',
    },
    {
      name: 'socket.io',
      originName: 'socket.io',
    },
    {
      name: 'nodemon',
      originName: 'nodemon',
    },
    {
      name: '@apollo/server',
      originName: '@apollo/server',
    },
    {
      name: '@fastify/helmet',
      originName: '@fastify/helmet',
    },
    {
      name: '@fastify/redis',
      originName: '@fastify/redis',
    },
    {
      name: '@fastify/jwt',
      originName: '@fastify/jwt',
    },
    {
      name: '@fastify/cookie',
      originName: '@fastify/cookie',
    },
    {
      name: '@fastify/cors',
      originName: '@fastify/cors',
    },
    {
      name: '@fastify/rate-limit',
      originName: '@fastify/rate-limit',
    },
    {
      name: '@fastify/swagger-ui',
      originName: '@fastify/swagger-ui',
    },
  ],
};

export const NEST_DEPENDENCIES: __BackendPackagesProps = {
  packages: [
    ...BACKEND_DEFAULT_DEPENDENCIES.packages,
    {
      name: 'winston',
      originName: 'winston',
    },
    {
      name: 'bcrypt',
      originName: 'bcrypt',
    },
    {
      name: 'cookie-parser',
      originName: 'cookie-parser',
    },
    {
      name: 'socket.io',
      originName: 'socket.io',
    },
    {
      name: 'helmet',
      originName: 'helmet',
    },
    {
      name: '@nestjs/config',
      originName: '@nestjs/config',
    },
    {
      name: 'class-validator',
      originName: 'class-validator',
    },
    {
      name: 'class-transformer',
      originName: 'class-transformer',
    },
    {
      name: '@nestjs/graphql',
      originName: '@nestjs/graphql',
    },
    {
      name: '@nestjs/apollo',
      originName: '@nestjs/apollo',
    },
    {
      name: 'ioredis',
      originName: 'ioredis',
    },
    {
      name: '@nestjs/jwt',
      originName: '@nestjs/jwt',
    },
    {
      name: '@nestjs/throttler',
      originName: '@nestjs/throttler',
    },
    {
      name: '@nestjs/swagger',
      originName: '@nestjs/swagger',
    },
  ],
};

export const NODE_DEPENDENCIES: __BackendPackagesProps = {
  packages: [
    ...BACKEND_DEFAULT_DEPENDENCIES.packages,
    {
      name: 'winston',
      originName: 'winston',
    },
    {
      name: 'bcrypt',
      originName: 'bcrypt',
    },
    {
      name: 'socket.io',
      originName: 'socket.io',
    },
    {
      name: '@apollo/server',
      originName: '@apollo/server',
    },
    {
      name: 'graphql',
      originName: 'graphql',
    },
    {
      name: 'ioredis',
      originName: 'ioredis',
    },
    {
      name: 'redis',
      originName: 'redis',
    },
    {
      name: 'connect-redis',
      originName: 'connect-redis',
    },
    {
      name: 'express-session',
      originName: 'express-session',
    },
    {
      name: 'nodemon',
      originName: 'nodemon',
    },
    {
      name: 'passport',
      originName: 'passport',
    },
    {
      name: 'node-cron',
      originName: 'node-cron',
    },
    {
      name: 'cors',
      originName: 'cors',
    },
    {
      name: 'swagger-ui-express',
      originName: 'swagger-ui-express',
    },
  ],
};

export const KOA_DEPENDENCIES: __BackendPackagesProps = {
  packages: [
    ...BACKEND_DEFAULT_DEPENDENCIES.packages,
    {
      name: 'koa-router',
      originName: 'koa-router',
    },
    {
      name: 'koa-bodyparser',
      originName: 'koa-bodyparser',
    },
    {
      name: 'koa-onerror',
      originName: 'koa-onerror',
    },
    {
      name: 'koa-helmet',
      originName: 'koa-helmet',
    },
    {
      name: '@koa/cors',
      originName: '@koa/cors',
    },
    {
      name: 'koa-logger',
      originName: 'koa-logger',
    },
    {
      name: 'koa-compress',
      originName: 'koa-compress',
    },
    {
      name: 'joi',
      originName: 'joi',
    },
    {
      name: 'koa-jwt',
      originName: 'koa-jwt',
    },
    {
      name: 'koa-passport',
      originName: 'koa-passport',
    },
    {
      name: 'koa2-swagger-ui',
      originName: 'koa2-swagger-ui',
    },
    {
      name: '@apollo/server',
      originName: '@apollo/server',
    },
    {
      name: 'graphql',
      originName: 'graphql',
    },
    {
      name: 'nodemon',
      originName: 'nodemon',
    },
  ],
};

export const FEATHER_DEPENDENCIES: __BackendPackagesProps = {
  packages: [
    {
      name: '@feathersjs/feathers',
      originName: '@feathersjs/feathers',
    },
    {
      name: '@feathersjs/express',
      originName: '@feathersjs/express',
    },
    {
      name: '@feathersjs/socketio',
      originName: '@feathersjs/socketio',
    },
    {
      name: '@feathersjs/koa',
      originName: '@feathersjs/koa',
    },
    {
      name: '@feathersjs/mongodb',
      originName: '@feathersjs/mongodb',
    },
    {
      name: '@feathersjs/knex',
      originName: '@feathersjs/knex',
    },
    {
      name: '@feathersjs/memory',
      originName: '@feathersjs/memory',
    },
    {
      name: '@feathersjs/authentication',
      originName: '@feathersjs/authentication',
    },
    {
      name: '@feathersjs/authentication-local',
      originName: '@feathersjs/authentication-local',
    },
    {
      name: '@feathersjs/authentication-oauth',
      originName: '@feathersjs/authentication-oauth',
    },
    {
      name: '@feathersjs/configuration',
      originName: '@feathersjs/configuration',
    },
    {
      name: '@feathersjs/rest-client',
      originName: '@feathersjs/rest-client',
    },
    {
      name: '@feathersjs/authentication-client',
      originName: '@feathersjs/authentication-client',
    },
    {
      name: 'helmet',
      originName: 'helmet',
    },
    {
      name: 'cors',
      originName: 'cors',
    },
    {
      name: 'dotenv',
      originName: 'dotenv',
    },
    {
      name: 'jest',
      originName: 'jest',
    },
  ],
};
