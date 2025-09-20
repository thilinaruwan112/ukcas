<?php
// routes/InstitutePaymentRoutes.php
require_once './controllers/InstitutePaymentController.php';

$pdo = $GLOBALS['pdo'];
$controller = new InstitutePaymentController($pdo);

return [
    'GET /institute-payments/' => function () use ($controller) {
        $controller->getAll();
    },
    'GET /institute-payments/{id}' => function ($id) use ($controller) {
        $controller->getById($id);
    },
    'POST /institute-payments/' => function () use ($controller) {
        $controller->create();
    },
    'PUT /institute-payments/{id}' => function ($id) use ($controller) {
        $controller->update($id);
    },
    'DELETE /institute-payments/{id}' => function ($id) use ($controller) {
        $controller->delete($id);
    },
];
