<?php
// controllers/UserController.php
require_once './models/User.php';
require_once './utils/JwtHelper.php';

class UserController
{
    private $model;
    public function __construct($pdo)
    {
        $this->model = new User($pdo);
    }
    public function getAll()
    {
        echo json_encode([
            'status' => 'success',
            'data' => $this->model->getAll()
        ]);
    }
    public function getById($id)
    {
        echo json_encode([
            'status' => 'success',
            'data' => $this->model->getById($id)
        ]);
    }
    public function create()
    {
        $data = json_decode(file_get_contents("php://input"), true);
        $user = $this->model->create($data);
        echo json_encode([
            'status' => 'success',
            'message' => 'User created successfully.',
            'data' => $user
        ]);
    }
    public function update($id)
    {
        $data = json_decode(file_get_contents("php://input"), true);
        $user = $this->model->update($id, $data);
        echo json_encode([
            'status' => 'success',
            'message' => 'User updated successfully.',
            'data' => $user
        ]);
    }
    public function delete($id)
    {
        $deleted = $this->model->delete($id);
        echo json_encode([
            'status' => $deleted ? 'success' : 'error',
            'message' => $deleted ? 'User deleted successfully.' : 'User not found.'
        ]);
    }
    public function login()
    {
        $data = json_decode(file_get_contents("php://input"), true);
        if (!$data || !isset($data['email']) || !isset($data['pass'])) {
            http_response_code(400);
            echo json_encode([
                'status' => 'error',
                'message' => 'Email and password are required'
            ]);
            return;
        }
        $user = $this->model->getByEmail($data['email']);
        if (!$user || !password_verify($data['pass'], $user['pass'])) {
            http_response_code(401);
            echo json_encode([
                'status' => 'error',
                'message' => 'Invalid email or password'
            ]);
            return;
        }
        unset($user['pass']);
        $token = JwtHelper::generateToken($user);
        echo json_encode([
            'status' => 'success',
            'message' => 'Login successful',
            'token' => $token,
            'data' => $user
        ]);
    }
    private function validateApiKey()
    {
        $headers = getallheaders();
        $apiKey = isset($headers['X-API-KEY']) ? $headers['X-API-KEY'] : null;
        $validKey = getenv('API_KEY') ?: (isset($_ENV['API_KEY']) ? $_ENV['API_KEY'] : null);
        if (!$apiKey || $apiKey !== $validKey) {
            http_response_code(401);
            echo json_encode(['status' => 'error', 'message' => 'Missing or invalid API key']);
            return false;
        }
        return true;
    }
}
