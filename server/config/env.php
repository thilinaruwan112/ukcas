<?php
// config/env.php
require_once __DIR__ . '/../vendor/autoload.php';

if (!defined('UKCAS_ENV_LOADED')) {
    define('UKCAS_ENV_LOADED', true);
    $envDir = __DIR__ . '/../';
    if (file_exists($envDir . '.env')) {
        $dotenv = Dotenv\Dotenv::createImmutable($envDir);
        $dotenv->safeLoad();
    }
}

if (!function_exists('envValue')) {
    function envValue($key, $default = '')
    {
        if (isset($_ENV[$key]) && $_ENV[$key] !== '') {
            return $_ENV[$key];
        }
        $val = getenv($key);
        return ($val !== false && $val !== '') ? $val : $default;
    }
}
