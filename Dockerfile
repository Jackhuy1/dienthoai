FROM wordpress:php8.2-apache

# Copy application source
COPY . /var/www/html
RUN chown -R www-data:www-data /var/www/html

RUN docker-php-ext-install mysqli pdo pdo_mysql && docker-php-ext-enable pdo_mysql
# Expose port 80 to the outside world
EXPOSE 80
