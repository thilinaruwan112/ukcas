<?php
// controllers/StudentCertificateController.php
require_once './models/StudentCertificate.php';

class StudentCertificateController
{
    private $model;
    public function __construct($pdo)
    {
        $this->model = new StudentCertificate($pdo);
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
        // Generate a random 6-digit certificate_id if not provided
        $data['certificate_id'] = str_pad(mt_rand(0, 999999), 6, '0', STR_PAD_LEFT);
        $certificate = $this->model->create($data);
        echo json_encode([
            'status' => 'success',
            'message' => 'Certificate created successfully.',
            'data' => $certificate
        ]);
    }
    public function update($id)
    {
        $data = json_decode(file_get_contents("php://input"), true);
        $certificate = $this->model->update($id, $data);
        echo json_encode([
            'status' => 'success',
            'message' => 'Certificate updated successfully.',
            'data' => $certificate
        ]);
    }
    public function delete($id)
    {
        $deleted = $this->model->delete($id);
        echo json_encode([
            'status' => $deleted ? 'success' : 'error',
            'message' => $deleted ? 'Certificate deleted successfully.' : 'Certificate not found.'
        ]);
    }

    // Get students by institute_id
    public function getByInstituteId($institute_id)
    {
        $result = $this->model->getByInstituteId($institute_id);
        echo json_encode([
            'status' => 'success',
            'data' => $result
        ]);
    }
}
