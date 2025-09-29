<?php
// routes/StudentCertificateRoutes.php
require_once './controllers/StudentCertificateController.php';

$pdo = $GLOBALS['pdo'];
$controller = new StudentCertificateController($pdo);

return [
    'GET /students-certificates/' => function () use ($controller) {
        $controller->getAll();
    },
    'GET /students-certificates/{id}' => function ($id) use ($controller) {
        $controller->getById($id);
    },
    'GET /students-certificates/institute/{institute_id}' => function ($institute_id) use ($controller) {
        $controller->getByInstituteId($institute_id);
    },
    'POST /students-certificates/' => function () use ($controller) {
        $controller->create();
    },
    'PUT /students-certificates/{id}' => function ($id) use ($controller) {
        $controller->update($id);
    },
    'DELETE /students-certificates/{id}' => function ($id) use ($controller) {
        $controller->delete($id);
    },
];
