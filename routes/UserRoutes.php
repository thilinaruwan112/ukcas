<?php
// routes/UserRoutes.php
require_once './controllers/UserController.php';

$pdo = $GLOBALS['pdo'];
$controller = new UserController($pdo);

return [
    'GET /users/' => function () use ($controller) {
        $controller->getAll();
    },
    'GET /users/{id}' => function ($id) use ($controller) {
        $controller->getById($id);
    },
    'POST /users/' => function () use ($controller) {
        $controller->create();
    },
    'PUT /users/{id}' => function ($id) use ($controller) {
        $controller->update($id);
    },
    'DELETE /users/{id}' => function ($id) use ($controller) {
        $controller->delete($id);
    },
    'POST /users/login' => function () use ($controller) {
        $controller->login();
    },
];
