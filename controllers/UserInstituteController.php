<?php
// controllers/UserInstituteController.php
require_once './models/UserInstitute.php';

class UserInstituteController
{
    private $model;
    public function __construct($pdo)
    {
        $this->model = new UserInstitute($pdo);
    }
    public function getAll()
    {
        echo json_encode([
            'status' => 'success',
            'data' => $this->model->getAll()
        ]);
    }
    public function getById($id)
    {
        echo json_encode([
            'status' => 'success',
            'data' => $this->model->getById($id)
        ]);
    }
    public function create()
    {
        $data = json_decode(file_get_contents("php://input"), true);
        $record = $this->model->create($data);
        echo json_encode([
            'status' => 'success',
            'message' => 'Record created successfully.',
            'data' => $record
        ]);
    }
    public function update($id)
    {
        $data = json_decode(file_get_contents("php://input"), true);
        $record = $this->model->update($id, $data);
        echo json_encode([
            'status' => 'success',
            'message' => 'Record updated successfully.',
            'data' => $record
        ]);
    }
    public function delete($id)
    {
        $deleted = $this->model->delete($id);
        echo json_encode([
            'status' => $deleted ? 'success' : 'error',
            'message' => $deleted ? 'Record deleted successfully.' : 'Record not found.'
        ]);
    }
}
