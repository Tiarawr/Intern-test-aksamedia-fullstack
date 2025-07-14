<?php

// Debug environment variables
echo "=== Railway Environment Debug ===\n";
echo "PORT: " . getenv('PORT') . "\n";
echo "APP_URL: " . env('APP_URL', 'NOT_SET') . "\n";
echo "DB_HOST: " . env('DB_HOST', 'NOT_SET') . "\n";
echo "DB_PORT: " . env('DB_PORT', 'NOT_SET') . "\n";
echo "DB_DATABASE: " . env('DB_DATABASE', 'NOT_SET') . "\n";
echo "DB_USERNAME: " . env('DB_USERNAME', 'NOT_SET') . "\n";
echo "DB_PASSWORD: " . (env('DB_PASSWORD') ? 'SET' : 'NOT_SET') . "\n";

echo "\n=== Railway Provided Variables ===\n";
echo "MYSQLHOST: " . getenv('MYSQLHOST') . "\n";
echo "MYSQLPORT: " . getenv('MYSQLPORT') . "\n";
echo "MYSQL_DATABASE: " . getenv('MYSQL_DATABASE') . "\n";
echo "MYSQLUSER: " . getenv('MYSQLUSER') . "\n";
echo "MYSQL_ROOT_PASSWORD: " . (getenv('MYSQL_ROOT_PASSWORD') ? 'SET' : 'NOT_SET') . "\n";

echo "\n=== Network Info ===\n";
echo "HOST: " . ($_SERVER['HTTP_HOST'] ?? 'NOT_SET') . "\n";
echo "SERVER_PORT: " . ($_SERVER['SERVER_PORT'] ?? 'NOT_SET') . "\n";
echo "HTTPS: " . (isset($_SERVER['HTTPS']) ? 'YES' : 'NO') . "\n";

echo "\n=== All Environment Variables ===\n";
foreach (getenv() as $key => $value) {
    if (strpos($key, 'MYSQL') !== false || strpos($key, 'DB_') !== false || strpos($key, 'PORT') !== false) {
        echo "$key: " . ($key === 'MYSQL_ROOT_PASSWORD' || $key === 'DB_PASSWORD' ? 'HIDDEN' : $value) . "\n";
    }
}
