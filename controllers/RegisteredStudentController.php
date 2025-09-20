<?php
// controllers/RegisteredStudentController.php
require_once './models/RegisteredStudent.php';

class RegisteredStudentController
{
    private $model;
    private $uploadDir = './uploads/students/';
    public function __construct($pdo)
    {
        $this->model = new RegisteredStudent($pdo);
        if (!is_dir($this->uploadDir)) {
            mkdir($this->uploadDir, 0777, true);
        }
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
        $data = $_POST;
        $data['id_card_front'] = $this->handleFile('id_card_front');
        $data['id_card_back'] = $this->handleFile('id_card_back');
        $data['ol_certificate'] = $this->handleFile('ol_certificate');
        $data['al_certificate'] = $this->handleFile('al_certificate');
        $data['student_photo'] = $this->handleFile('student_photo');
        $student = $this->model->create($data);
        echo json_encode([
            'status' => 'success',
            'message' => 'Student registered successfully.',
            'data' => $student
        ]);
    }
    public function update($id)
    {
        $data = $_POST;
        $data['id_card_front'] = $this->handleFile('id_card_front');
        $data['id_card_back'] = $this->handleFile('id_card_back');
        $data['ol_certificate'] = $this->handleFile('ol_certificate');
        $data['al_certificate'] = $this->handleFile('al_certificate');
        $data['student_photo'] = $this->handleFile('student_photo');
        $student = $this->model->update($id, $data);
        echo json_encode([
            'status' => 'success',
            'message' => 'Student updated successfully.',
            'data' => $student
        ]);
    }
    public function delete($id)
    {
        $deleted = $this->model->delete($id);
        echo json_encode([
            'status' => $deleted ? 'success' : 'error',
            'message' => $deleted ? 'Student deleted successfully.' : 'Student not found.'
        ]);
    }
    private function handleFile($key)
    {
        if (isset($_FILES[$key]) && $_FILES[$key]['error'] === UPLOAD_ERR_OK) {
            $filename = uniqid() . '_' . basename($_FILES[$key]['name']);
            $targetPath = $this->uploadDir . $filename;
            if (move_uploaded_file($_FILES[$key]['tmp_name'], $targetPath)) {
                return $targetPath;
            }
        }
        return isset($_POST[$key]) ? $_POST[$key] : '';
    }
}
