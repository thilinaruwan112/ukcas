<?php
// routes/RegisteredStudentRoutes.php
require_once './controllers/RegisteredStudentController.php';

$pdo = $GLOBALS['pdo'];
$controller = new RegisteredStudentController($pdo);

return [
    'GET /registered-students/' => function () use ($controller) {
        $controller->getAll();
    },
    'GET /registered-students/{id}' => function ($id) use ($controller) {
        $controller->getById($id);
    },
    'POST /registered-students/' => function () use ($controller) {
        $controller->create();
    },
    'PUT /registered-students/{id}' => function ($id) use ($controller) {
        $controller->update($id);
    },
    'DELETE /registered-students/{id}' => function ($id) use ($controller) {
        $controller->delete($id);
    },
];
