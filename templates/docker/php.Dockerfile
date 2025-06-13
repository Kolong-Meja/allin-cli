# Please visit https://docs.docker.com/reference/dockerfile/ to gain more information about Dockerfile.

# See also https://stackoverflow.com/questions/26077543/how-to-name-dockerfiles

# You can change all of the setup on this file, so enjoy it!
FROM php:8.4-fpm-alpine

RUN apk update && apk add --no-cache \
  libjpeg-turbo-dev \
  libpng-dev \
  libzip-dev \
  postgresql-dev \
  freetype-dev \
  libwebp-dev \
  unzip \
  zip \
  nodejs \
  npm \
  openssl-dev \
  autoconf \
  g++ \
  make \
  librdkafka-dev \
  && apk add --no-cache --virtual .build-deps $PHPIZE_DEPS \
  && pecl install redis mongodb rdkafka \
  && docker-php-ext-enable redis mongodb rdkafka \
  && apk del .build-deps \
  && docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp \
  && docker-php-ext-install gd exif opcache pdo_mysql pdo_pgsql pgsql pcntl zip

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer \
  && composer --version

WORKDIR /path/to/your-app

COPY --chown=1000:1000 . /path/to/your-app

RUN composer install --no-interaction --optimize-autoloader

EXPOSE 9000

CMD ["php-fpm"]