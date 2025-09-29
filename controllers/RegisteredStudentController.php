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
        require_once './controllers/FtpController.php';
        $ftpController = new FtpController($GLOBALS['pdo']);

        $fileFields = [
            'id_card_front',
            'id_card_back',
            'ol_certificate',
            'al_certificate',
            'student_photo'
        ];

        $studentId = isset($data['student_id']) ? $data['student_id'] : (isset($data['id']) ? $data['id'] : null);
        foreach ($fileFields as $field) {
            if (isset($_FILES[$field]) && $_FILES[$field]['error'] === UPLOAD_ERR_OK) {
                $file = $_FILES[$field];
                if ($studentId) {
                    $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
                    $safeName = preg_replace('/[^a-zA-Z0-9\s-]/', '', pathinfo($file['name'], PATHINFO_FILENAME));
                    $safeName = preg_replace('/\s+/', '-', trim($safeName));
                    $safeName = strtolower($safeName);
                    $ftpPath = "/students/$studentId/$field-$safeName.$ext";
                    $result = $ftpController->uploadImage($file, $ftpPath);
                    if (isset($result['status']) && $result['status'] === 'success') {
                        $data[$field] = $ftpPath;
                    } else {
                        $data[$field] = '';
                    }
                } else {
                    $data[$field] = '';
                }
            } else {
                $data[$field] = isset($_POST[$field]) ? $_POST[$field] : '';
            }
        }

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
        require_once './controllers/FtpController.php';
        $ftpController = new FtpController($GLOBALS['pdo']);

        $fileFields = [
            'id_card_front',
            'id_card_back',
            'ol_certificate',
            'al_certificate',
            'student_photo'
        ];

        $studentId = isset($data['student_id']) ? $data['student_id'] : (isset($data['id']) ? $data['id'] : $id);
        $current = $this->model->getById($id);
        foreach ($fileFields as $field) {
            if (isset($_FILES[$field]) && $_FILES[$field]['error'] === UPLOAD_ERR_OK) {
                $file = $_FILES[$field];
                if ($studentId) {
                    $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
                    $safeName = preg_replace('/[^a-zA-Z0-9\s-]/', '', pathinfo($file['name'], PATHINFO_FILENAME));
                    $safeName = preg_replace('/\s+/', '-', trim($safeName));
                    $safeName = strtolower($safeName);
                    $ftpPath = "/students/$studentId/$field-$safeName.$ext";
                    $result = $ftpController->uploadImage($file, $ftpPath);
                    if (isset($result['status']) && $result['status'] === 'success') {
                        $data[$field] = $ftpPath;
                    } else {
                        $data[$field] = isset($current[$field]) ? $current[$field] : '';
                    }
                } else {
                    $data[$field] = isset($current[$field]) ? $current[$field] : '';
                }
            } else {
                // No new image uploaded, keep current image URL
                $data[$field] = isset($current[$field]) ? $current[$field] : (isset($_POST[$field]) ? $_POST[$field] : '');
            }
        }

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
