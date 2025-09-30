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

    // Create new institute (API key only, no bearer token required)
    'POST /institutes/' => function () use ($instituteController) {
        // API key check only
        $headers = getallheaders();
        $apiKey = isset($headers['x-api-key']) ? $headers['x-api-key'] : (isset($headers['X-API-KEY']) ? $headers['X-API-KEY'] : null);
        $validApiKey = getenv('API_KEY') ?: (defined('API_KEY') ? API_KEY : null);
        if (!$apiKey || !$validApiKey || $apiKey !== $validApiKey) {
            http_response_code(401);
            echo json_encode(['error' => 'Invalid or missing API key']);
            return;
        }
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
