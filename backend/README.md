# Aksamedia Backend API

Backend API untuk aplikasi manajemen karyawan dan divisi menggunakan Laravel.

## Features

-   Authentication dengan Laravel Sanctum
-   CRUD Karyawan dengan upload foto
-   CRUD Divisi
-   Server-side pagination
-   File storage untuk foto karyawan

## Setup

1. Copy environment file:

```bash
cp .env.example .env
```

2. Install dependencies:

```bash
composer install
```

3. Generate application key:

```bash
php artisan key:generate
```

4. Run migrations:

```bash
php artisan migrate --seed
```

5. Create storage link:

```bash
php artisan storage:link
```

6. Start development server:

```bash
php artisan serve
```

## API Endpoints

### Authentication

-   POST `/api/login` - Login user
-   POST `/api/logout` - Logout user

### Employees

-   GET `/api/employees` - Get all employees (public)
-   POST `/api/employees` - Create employee (auth required)
-   PUT `/api/employees/{id}` - Update employee (auth required)
-   DELETE `/api/employees/{id}` - Delete employee (auth required)

### Divisions

-   GET `/api/divisions` - Get all divisions (public)
-   POST `/api/divisions` - Create division (auth required)
-   PUT `/api/divisions/{id}` - Update division (auth required)

## About Laravel

Laravel is a web application framework with expressive, elegant syntax. We believe development must be an enjoyable and creative experience to be truly fulfilling. Laravel takes the pain out of development by easing common tasks used in many web projects, such as:

-   [Simple, fast routing engine](https://laravel.com/docs/routing).
-   [Powerful dependency injection container](https://laravel.com/docs/container).
-   Multiple back-ends for [session](https://laravel.com/docs/session) and [cache](https://laravel.com/docs/cache) storage.
-   Expressive, intuitive [database ORM](https://laravel.com/docs/eloquent).
-   Database agnostic [schema migrations](https://laravel.com/docs/migrations).
-   [Robust background job processing](https://laravel.com/docs/queues).
-   [Real-time event broadcasting](https://laravel.com/docs/broadcasting).

Laravel is accessible, powerful, and provides tools required for large, robust applications.

## Learning Laravel

Laravel has the most extensive and thorough [documentation](https://laravel.com/docs) and video tutorial library of all modern web application frameworks, making it a breeze to get started with the framework.

You may also try the [Laravel Bootcamp](https://bootcamp.laravel.com), where you will be guided through building a modern Laravel application from scratch.

If you don't feel like reading, [Laracasts](https://laracasts.com) can help. Laracasts contains thousands of video tutorials on a range of topics including Laravel, modern PHP, unit testing, and JavaScript. Boost your skills by digging into our comprehensive video library.

## Laravel Sponsors

We would like to extend our thanks to the following sponsors for funding Laravel development. If you are interested in becoming a sponsor, please visit the [Laravel Partners program](https://partners.laravel.com).

### Premium Partners

-   **[Vehikl](https://vehikl.com)**
-   **[Tighten Co.](https://tighten.co)**
-   **[Kirschbaum Development Group](https://kirschbaumdevelopment.com)**
-   **[64 Robots](https://64robots.com)**
-   **[Curotec](https://www.curotec.com/services/technologies/laravel)**
-   **[DevSquad](https://devsquad.com/hire-laravel-developers)**
-   **[Redberry](https://redberry.international/laravel-development)**
-   **[Active Logic](https://activelogic.com)**

## Contributing

Thank you for considering contributing to the Laravel framework! The contribution guide can be found in the [Laravel documentation](https://laravel.com/docs/contributions).

## Code of Conduct

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
