FROM php:8.2-apache
RUN apt-get update && apt-get install -y unzip git
RUN docker-php-ext-install mysqli && docker-php-ext-enable mysqli
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
COPY . /var/www/html/
WORKDIR /var/www/html/back
RUN composer install --no-dev --optimize-autoloader
