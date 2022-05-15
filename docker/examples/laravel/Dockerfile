FROM php:7.4-cli

WORKDIR /var/www

# it is important to separate the RUN commands based on the context.
# each command is a layer in the Dockerfile, that will be cached.

RUN apt-get update && \
    apt-get install -y \
    libzip-dev && \
    docker-php-ext-install zip

RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" && \
  php -r "if (hash_file('sha384', 'composer-setup.php') === '55ce33d7678c5a611085589f1f3ddf8b3c52d662cd01d4ba75c0ee0459970c2200a51f492d557530c71c15d8dba01eae') { echo 'Installer verified'; } else { echo 'Installer corrupt'; unlink('composer-setup.php'); } echo PHP_EOL;" && \
  php composer-setup.php && \
  php -r "unlink('composer-setup.php');"

RUN php composer.phar create-project --prefer-dist laravel/laravel laravel

ENTRYPOINT ["php", "laravel/artisan", "serve"]
CMD ["--host=0.0.0.0"]
# otherwise the default host would be 127.0.0.1
# now I can access the application via http://localhost:8000
# and I can also replace the default CMD, for example:
# docker run --rm -d --name laravel -p 8001:8001 <image_name> --host=0.0.0.0 --port=8001
