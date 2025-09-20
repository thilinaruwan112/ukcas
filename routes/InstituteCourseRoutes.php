<?php
// routes/InstituteCourseRoutes.php
require_once './controllers/InstituteCourseController.php';

$pdo = $GLOBALS['pdo'];
$controller = new InstituteCourseController($pdo);

return [
    'GET /institute-courses/' => function () use ($controller) {
        $controller->getAll();
    },
    'GET /institute-courses/{id}' => function ($id) use ($controller) {
        $controller->getById($id);
    },
    'POST /institute-courses/' => function () use ($controller) {
        $controller->create();
    },
    'PUT /institute-courses/{id}' => function ($id) use ($controller) {
        $controller->update($id);
    },
    'DELETE /institute-courses/{id}' => function ($id) use ($controller) {
        $controller->delete($id);
    },
];
