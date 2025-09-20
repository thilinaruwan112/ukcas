<?php
// routes/UserInstituteRoutes.php
require_once './controllers/UserInstituteController.php';

$pdo = $GLOBALS['pdo'];
$controller = new UserInstituteController($pdo);

return [
    'GET /user-institutes/' => function () use ($controller) {
        $controller->getAll();
    },
    'GET /user-institutes/{id}' => function ($id) use ($controller) {
        $controller->getById($id);
    },
    'POST /user-institutes/' => function () use ($controller) {
        $controller->create();
    },
    'PUT /user-institutes/{id}' => function ($id) use ($controller) {
        $controller->update($id);
    },
    'DELETE /user-institutes/{id}' => function ($id) use ($controller) {
        $controller->delete($id);
    },
];
