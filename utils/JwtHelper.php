<?php
// utils/JwtHelper.php
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class JwtHelper
{
    private static $secret_key;
    private static $algo = 'HS256';
    private static $expire = 90000; // 1 hour
    private static function loadSecret()
    {
        if (!self::$secret_key) {
            $envDir = __DIR__ . '/../';
            if (file_exists($envDir . '.env')) {
                if (method_exists('Dotenv\\Dotenv', 'createImmutable')) {
                    $dotenv = Dotenv\Dotenv::createImmutable($envDir);
                    $dotenv->load();
                }
            }
            if (getenv('JWT_SECRET')) {
                self::$secret_key = getenv('JWT_SECRET');
            } elseif (isset($_ENV['JWT_SECRET'])) {
                self::$secret_key = $_ENV['JWT_SECRET'];
            }
        }
    }
    public static function generateToken($user)
    {
        self::loadSecret();
        $payload = [
            'iss' => 'ukcas-server',
            'iat' => time(),
            'exp' => time() + self::$expire,
            'sub' => $user['id'],
            'email' => $user['email'],
            'user_name' => $user['user_name'],
        ];
        return JWT::encode($payload, self::$secret_key, self::$algo);
    }
    public static function validateToken($token)
    {
        self::loadSecret();
        try {
            $decoded = JWT::decode($token, new Key(self::$secret_key, self::$algo));
            return (array)$decoded;
        } catch (Exception $e) {
            return false;
        }
    }
}
