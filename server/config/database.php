<?php
// config/database.php
require_once __DIR__ . '/env.php';

$host = envValue('DB_HOST', 'localhost');
$db = envValue('DB_NAME');
$user = envValue('DB_USER');
$pass = envValue('DB_PASS');
$charset = envValue('DB_CHARSET', 'utf8mb4');

if ($db === '' || $user === '') {
    throw new \RuntimeException('Database configuration (DB_NAME, DB_USER) is missing in server/.env.');
}

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    throw new \PDOException($e->getMessage(), (int) $e->getCode());
}
