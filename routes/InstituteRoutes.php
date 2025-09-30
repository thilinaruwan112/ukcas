<?php

require_once './controllers/InstituteController.php';

$pdo = $GLOBALS['pdo'];
$instituteController = new InstituteController($pdo);

return [
    // Get all institutes
    'GET /institutes/' => function () use ($instituteController) {
        $instituteController->getAllRecords();
    },

    // Get institute by ID
    'GET /institutes/{id}/' => function ($id) use ($instituteController) {
        $instituteController->getRecordById($id);
    },

    // Get institute by slug
    'GET /institutes/slug/{slug}/' => function ($slug) use ($instituteController) {
        $instituteController->getRecordBySlug($slug);
    },

    // Create new institute
    'POST /institutes/' => function () use ($instituteController) {
        $instituteController->createRecord();
    },

    // Update institute
    'POST /institutes/{id}/' => function ($id) use ($instituteController) {
        $instituteController->updateRecord($id);
    },

    // Delete institute
    'DELETE /institutes/{id}/' => function ($id) use ($instituteController) {
        $instituteController->deleteRecord($id);
    }
];
