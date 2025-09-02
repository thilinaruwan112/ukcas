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

    // Create new institute
    'POST /institutes/' => function () use ($instituteController) {
        $instituteController->createRecord();
    },

    // Update institute
    'PUT /institutes/{id}/' => function ($id) use ($instituteController) {
        $instituteController->updateRecord($id);
    },

    // Delete institute
    'DELETE /institutes/{id}/' => function ($id) use ($instituteController) {
        $instituteController->deleteRecord($id);
    }
];
