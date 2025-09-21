<?php
// controllers/InstituteCourseController.php
require_once './models/InstituteCourse.php';

class InstituteCourseController
{
    private $model;
    public function __construct($pdo)
    {
        $this->model = new InstituteCourse($pdo);
    }
    public function getAll()
    {
        $data = json_decode(file_get_contents("php://input"), true);
        $institute_id = $data['institute_id'] ?? null;
        echo json_encode([
            'status' => 'success',
            'data' => $this->model->getAll($institute_id)
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
        $course = $this->model->create($data);
        echo json_encode([
            'status' => 'success',
            'message' => 'Course created successfully.',
            'data' => $course
        ]);
    }
    public function update($id)
    {
        $data = json_decode(file_get_contents("php://input"), true);
        $course = $this->model->update($id, $data);
        echo json_encode([
            'status' => 'success',
            'message' => 'Course updated successfully.',
            'data' => $course
        ]);
    }
    public function delete($id)
    {
        $deleted = $this->model->delete($id);
        echo json_encode([
            'status' => $deleted ? 'success' : 'error',
            'message' => $deleted ? 'Course deleted successfully.' : 'Course not found.'
        ]);
    }
}
