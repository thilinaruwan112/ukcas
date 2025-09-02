<?php
require_once './models/Institute.php';

class InstituteController
{
    private $model;

    public function __construct($pdo)
    {
        $this->model = new Institute($pdo);
    }

    // Get all institutes
    public function getAllRecords()
    {
        $records = $this->model->getAll();
        echo json_encode($records);
    }

    // Get institute by ID
    public function getRecordById($id)
    {
        $record = $this->model->getById($id);
        if ($record) {
            echo json_encode($record);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Institute not found']);
        }
    }

    // Get institute by slug
    public function getRecordBySlug($slug)
    {
        $record = $this->model->getBySlug($slug);
        if ($record) {
            echo json_encode($record);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Institute not found']);
        }
    }

    // Create new institute
    public function createRecord()
    {
        $data = json_decode(file_get_contents("php://input"), true);

        if ($data && isset($data['name'], $data['code'])) {
            $id = $this->model->create($data);
            http_response_code(201);
            echo json_encode([
                'message' => 'Institute created successfully',
                'id' => $id,
                'data' => $this->model->getById($id)
            ]);
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid input']);
        }
    }

    // Update institute
    public function updateRecord($id)
    {
        $data = json_decode(file_get_contents("php://input"), true);

        if ($data && isset($data['name'], $data['code'])) {
            $this->model->update($id, $data);
            echo json_encode([
                'message' => 'Institute updated successfully',
                'data' => $this->model->getById($id)
            ]);
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid input']);
        }
    }

    // Delete institute
    public function deleteRecord($id)
    {
        $this->model->delete($id);
        echo json_encode(['message' => 'Institute deleted successfully']);
    }
}
