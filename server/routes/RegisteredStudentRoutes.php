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
    'GET /registered-students/institute/{institute_id}' => function ($institute_id) use ($controller) {
        $controller->getByInstituteId($institute_id);
    },
    'POST /registered-students/' => function () use ($controller) {
        $controller->create();
    },
    'POST /registered-students/{id}' => function ($id) use ($controller) {
        $controller->update($id);
    },
    'DELETE /registered-students/{id}' => function ($id) use ($controller) {
        $controller->delete($id);
    },
];
